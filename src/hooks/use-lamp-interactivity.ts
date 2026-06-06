import { useState, useEffect, useRef } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { gsap, useGSAP } from "@/lib/gsap";

type EmissiveMaterial = THREE.Material & { emissive: THREE.Color };

interface EmissiveMaterialInfo {
  material: EmissiveMaterial;
  originalColor: THREE.Color;
}

/** Walks up the ancestor chain to check if obj belongs to the lamp head. */
function isHeadAttachmentObject(obj: THREE.Object3D | null): boolean {
  let current = obj;
  while (current) {
    if (current.name === "head_attachment") return true;
    current = current.parent;
  }
  return false;
}

export function useLampInteractivity(scene: THREE.Group | null) {
  const [isOn, setIsOn] = useState(true);
  const [hovered, setHovered] = useState(false);

  // References to store default properties once loaded
  const defaultIntensityRef = useRef<number>(1.5);
  const emissiveMaterialsRef = useRef<EmissiveMaterialInfo[]>([]);
  const originalSwitchRotRef = useRef<THREE.Euler | null>(null);

  // Cached object references to avoid repeated scene tree traversals
  const spotLightRef = useRef<THREE.Light | null>(null);
  const switchObjRef = useRef<THREE.Object3D | null>(null);

  // Track if we have initialized default values
  const isInitializedRef = useRef(false);

  // Find and initialize references
  useEffect(() => {
    if (!scene || isInitializedRef.current) return;

    const lampGroup = scene.getObjectByName("Lamp") as THREE.Group | undefined;
    const spotLight = (scene.getObjectByName("Spot Light") ||
      (lampGroup
        ? lampGroup.getObjectByName("Spot Light")
        : null)) as THREE.Light | null;
    spotLightRef.current = spotLight;

    if (spotLight) {
      defaultIntensityRef.current = spotLight.intensity ?? 1.5;
    }

    const switchObj = (scene.getObjectByName("switch1") ||
      (lampGroup
        ? lampGroup.getObjectByName("switch1")
        : null)) as THREE.Object3D | null;
    switchObjRef.current = switchObj;

    if (switchObj) {
      originalSwitchRotRef.current = switchObj.rotation.clone();
    }

    const mats: EmissiveMaterialInfo[] = [];
    if (lampGroup) {
      lampGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

          materials.forEach((mat) => {
            if (
              mat &&
              "emissive" in mat &&
              mat.emissive instanceof THREE.Color
            ) {
              // Capture materials that have non-zero emissive color components
              if (
                mat.emissive.r > 0 ||
                mat.emissive.g > 0 ||
                mat.emissive.b > 0
              ) {
                mats.push({
                  material: mat as EmissiveMaterial,
                  originalColor: mat.emissive.clone(),
                });
              }
            }
          });
        }
      });
    }

    emissiveMaterialsRef.current = mats;
    isInitializedRef.current = true;
  }, [scene]);

  // Perform GSAP flicker animation on ON/OFF transition
  useGSAP(
    () => {
      if (!scene || !isInitializedRef.current) return;

      const spotLight = spotLightRef.current;
      const switchObj = switchObjRef.current;

      if (!spotLight) return;

      const targetIntensity = isOn ? defaultIntensityRef.current : 0;
      const emissiveMats = emissiveMaterialsRef.current;

      // Kill any active tweens on the spotlight, materials, and switch
      gsap.killTweensOf(spotLight);
      emissiveMats.forEach(({ material }) =>
        gsap.killTweensOf(material.emissive),
      );
      if (switchObj) {
        gsap.killTweensOf(switchObj.rotation);
      }

      // 1. Animate switch rotation slightly to reflect physical interaction
      if (switchObj && originalSwitchRotRef.current) {
        const orig = originalSwitchRotRef.current;
        // Rotate the switch slightly on its local X axis (typical toggle motion)
        gsap.to(switchObj.rotation, {
          x: isOn ? orig.x : orig.x + 0.35,
          duration: 0.15,
          ease: "back.out(2)",
        });
      }

      // 2. Animate spotlight and emissive materials
      if (isOn) {
        // Spotlight state: visible
        spotLight.visible = true;

        // Premium Turn-on flicker timeline
        const tl = gsap.timeline();
        tl.to(spotLight, { intensity: targetIntensity * 0.25, duration: 0.05 })
          .to(spotLight, { intensity: 0, duration: 0.04 })
          .to(spotLight, { intensity: targetIntensity * 0.85, duration: 0.08 })
          .to(spotLight, { intensity: targetIntensity * 0.1, duration: 0.06 })
          .to(spotLight, {
            intensity: targetIntensity,
            duration: 0.15,
            ease: "power2.out",
          });

        // Emissive material flickers synced with spotlight
        emissiveMats.forEach(({ material, originalColor }) => {
          const emissive = material.emissive;
          const tlMat = gsap.timeline();
          tlMat
            .to(emissive, {
              r: originalColor.r * 0.25,
              g: originalColor.g * 0.25,
              b: originalColor.b * 0.25,
              duration: 0.05,
            })
            .to(emissive, { r: 0, g: 0, b: 0, duration: 0.04 })
            .to(emissive, {
              r: originalColor.r * 0.85,
              g: originalColor.g * 0.85,
              b: originalColor.b * 0.85,
              duration: 0.08,
            })
            .to(emissive, {
              r: originalColor.r * 0.1,
              g: originalColor.g * 0.1,
              b: originalColor.b * 0.1,
              duration: 0.06,
            })
            .to(emissive, {
              r: originalColor.r,
              g: originalColor.g,
              b: originalColor.b,
              duration: 0.15,
              ease: "power2.out",
            });
        });
      } else {
        // Turn-off: smooth rapid fade-out
        gsap.to(spotLight, {
          intensity: 0,
          duration: 0.12,
          ease: "power2.in",
          onComplete: () => {
            spotLight.visible = false;
          },
        });

        emissiveMats.forEach(({ material }) => {
          const emissive = material.emissive;
          gsap.to(emissive, {
            r: 0,
            g: 0,
            b: 0,
            duration: 0.12,
            ease: "power2.in",
          });
        });
      }
    },
    { dependencies: [isOn, scene], revertOnUpdate: true },
  );

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (isHeadAttachmentObject(e.object)) {
      e.stopPropagation();
      setIsOn((prev) => !prev);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isHeadAttachmentObject(e.object)) {
      e.stopPropagation();
      setHovered(true);
    } else {
      setHovered(false);
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
  };

  return {
    isOn,
    hovered,
    handleClick,
    handlePointerMove,
    handlePointerOut,
  };
}
