import { useState, useEffect, useRef } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { gsap, useGSAP } from "@/lib/gsap";
import { playFx } from "@/lib/sound";

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

function extractEmissiveMaterials(lampGroup: THREE.Group): EmissiveMaterialInfo[] {
  const mats: EmissiveMaterialInfo[] = [];
  lampGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      materials.forEach((mat) => {
        if (mat && "emissive" in mat && mat.emissive instanceof THREE.Color) {
          if (mat.emissive.r > 0 || mat.emissive.g > 0 || mat.emissive.b > 0) {
            mats.push({
              material: mat as EmissiveMaterial,
              originalColor: mat.emissive.clone(),
            });
          }
        }
      });
    }
  });
  return mats;
}

function animateLampOn(
  spotLight: THREE.Light,
  targetIntensity: number,
  emissiveMats: EmissiveMaterialInfo[],
): void {
  spotLight.visible = true;

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
}

function animateLampOff(
  spotLight: THREE.Light,
  emissiveMats: EmissiveMaterialInfo[],
): void {
  gsap.to(spotLight, {
    intensity: 0,
    duration: 0.12,
    ease: "power2.in",
    onComplete: () => {
      spotLight.visible = false;
    },
  });

  emissiveMats.forEach(({ material }) => {
    gsap.to(material.emissive, {
      r: 0,
      g: 0,
      b: 0,
      duration: 0.12,
      ease: "power2.in",
    });
  });
}

export function useLampInteractivity(scene: THREE.Group | null) {
  const [isOn, setIsOn] = useState(true);
  // useRef instead of useState: hover is only used for cursor style (side-effect),
  // not for rendering. Avoids re-renders that flicker the BotFace Suspense fallback.
  const hoveredRef = useRef(false);

  const defaultIntensityRef = useRef<number>(1.5);
  const emissiveMaterialsRef = useRef<EmissiveMaterialInfo[]>([]);
  const originalSwitchRotRef = useRef<THREE.Euler | null>(null);

  const spotLightRef = useRef<THREE.Light | null>(null);
  const switchObjRef = useRef<THREE.Object3D | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!scene || isInitializedRef.current) return;

    const lampGroup = scene.getObjectByName("Lamp") as THREE.Group | undefined;
    const spotLight = (scene.getObjectByName("Spot Light") ||
      (lampGroup ? lampGroup.getObjectByName("Spot Light") : null)) as THREE.Light | null;
    spotLightRef.current = spotLight;

    if (spotLight) {
      defaultIntensityRef.current = spotLight.intensity ?? 1.5;
    }

    const switchObj = (scene.getObjectByName("switch1") ||
      (lampGroup ? lampGroup.getObjectByName("switch1") : null)) as THREE.Object3D | null;
    switchObjRef.current = switchObj;

    if (switchObj) {
      originalSwitchRotRef.current = switchObj.rotation.clone();
    }

    if (lampGroup) {
      emissiveMaterialsRef.current = extractEmissiveMaterials(lampGroup);
    }
    isInitializedRef.current = true;
  }, [scene]);

  useGSAP(
    () => {
      if (!scene || !isInitializedRef.current) return;

      const spotLight = spotLightRef.current;
      const switchObj = switchObjRef.current;
      if (!spotLight) return;

      const targetIntensity = isOn ? defaultIntensityRef.current : 0;
      const emissiveMats = emissiveMaterialsRef.current;

      gsap.killTweensOf(spotLight);
      emissiveMats.forEach(({ material }) => gsap.killTweensOf(material.emissive));
      if (switchObj) {
        gsap.killTweensOf(switchObj.rotation);
      }

      if (switchObj && originalSwitchRotRef.current) {
        const orig = originalSwitchRotRef.current;
        gsap.to(switchObj.rotation, {
          x: isOn ? orig.x : orig.x + 0.35,
          duration: 0.15,
          ease: "back.out(2)",
        });
      }

      if (isOn) {
        animateLampOn(spotLight, targetIntensity, emissiveMats);
      } else {
        animateLampOff(spotLight, emissiveMats);
      }
    },
    { dependencies: [isOn, scene], revertOnUpdate: true },
  );

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (isHeadAttachmentObject(e.object)) {
      e.stopPropagation();
      playFx("lamp");
      setIsOn((prev) => !prev);
    }
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (isHeadAttachmentObject(e.object)) {
      e.stopPropagation();
      hoveredRef.current = true;
    } else {
      hoveredRef.current = false;
    }
  };

  const handlePointerOut = () => {
    hoveredRef.current = false;
  };

  return {
    isOn,
    hoveredRef,
    handleClick,
    handlePointerMove,
    handlePointerOut,
  };
}

