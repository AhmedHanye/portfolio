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

function toMaterialArray(material: THREE.Material | THREE.Material[]): THREE.Material[] {
  return Array.isArray(material) ? material : [material];
}

function hasPositiveEmissive(color: THREE.Color): boolean {
  return color.r + color.g + color.b > 0;
}

function isEmissiveMaterialWithColor(mat: THREE.Material): mat is EmissiveMaterial {
  if (!("emissive" in mat)) return false;
  const em = (mat as Partial<EmissiveMaterial>).emissive;
  return em instanceof THREE.Color && hasPositiveEmissive(em);
}

function extractEmissiveMaterials(lampGroup: THREE.Group): EmissiveMaterialInfo[] {
  const mats: EmissiveMaterialInfo[] = [];
  lampGroup.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      toMaterialArray(child.material).forEach((mat) => {
        if (isEmissiveMaterialWithColor(mat)) {
          mats.push({
            material: mat,
            originalColor: mat.emissive.clone(),
          });
        }
      });
    }
  });
  return mats;
}

function findSceneChildObject<T extends THREE.Object3D>(
  scene: THREE.Group,
  group: THREE.Group | undefined,
  name: string,
): T | null {
  return (scene.getObjectByName(name) || group?.getObjectByName(name) || null) as T | null;
}

function findLampObjects(scene: THREE.Group) {
  const lampGroup = scene.getObjectByName("Lamp") as THREE.Group | undefined;
  const spotLight = findSceneChildObject<THREE.Light>(scene, lampGroup, "Spot Light");
  const switchObj = findSceneChildObject<THREE.Object3D>(scene, lampGroup, "switch1");
  const emissiveMats = lampGroup ? extractEmissiveMaterials(lampGroup) : [];
  return { spotLight, switchObj, emissiveMats };
}

function initLampState(
  scene: THREE.Group,
  spotLightRef: React.MutableRefObject<THREE.Light | null>,
  switchObjRef: React.MutableRefObject<THREE.Object3D | null>,
  emissiveMatsRef: React.MutableRefObject<EmissiveMaterialInfo[]>,
  defaultIntensityRef: React.MutableRefObject<number>,
  originalSwitchRotRef: React.MutableRefObject<THREE.Euler | null>,
): void {
  const { spotLight, switchObj, emissiveMats } = findLampObjects(scene);
  spotLightRef.current = spotLight;
  switchObjRef.current = switchObj;
  emissiveMatsRef.current = emissiveMats;

  if (spotLight) {
    defaultIntensityRef.current = spotLight.intensity || 1.5;
  }
  if (switchObj) {
    originalSwitchRotRef.current = switchObj.rotation.clone();
  }
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
    duration: 0.15,
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
      duration: 0.15,
      ease: "power2.in",
    });
  });
}

function animateSwitch(
  switchObj: THREE.Object3D | null,
  originalRot: THREE.Euler | null,
  isOn: boolean,
): void {
  if (!switchObj || !originalRot) return;
  const targetX = originalRot.x + (isOn ? 0 : 0.6);
  gsap.to(switchObj.rotation, {
    x: targetX,
    duration: 0.15,
    ease: "power2.out",
  });
}

function animateLampTransition(
  spotLight: THREE.Light,
  targetIntensity: number,
  emissiveMats: EmissiveMaterialInfo[],
  isOn: boolean,
): void {
  gsap.killTweensOf(spotLight);
  emissiveMats.forEach(({ material }) => gsap.killTweensOf(material.emissive));

  if (isOn) {
    animateLampOn(spotLight, targetIntensity, emissiveMats);
  } else {
    animateLampOff(spotLight, emissiveMats);
  }
}

function animateLampEffect(
  spotLight: THREE.Light | null,
  switchObj: THREE.Object3D | null,
  originalRot: THREE.Euler | null,
  emissiveMats: EmissiveMaterialInfo[],
  defaultIntensity: number,
  isOn: boolean,
): void {
  if (!spotLight) return;
  animateSwitch(switchObj, originalRot, isOn);
  const targetIntensity = isOn ? defaultIntensity : 0;
  animateLampTransition(spotLight, targetIntensity, emissiveMats, isOn);
}

// fallow-ignore-next-line complexity
export function useLampInteractivity(scene: THREE.Group | null) {
  const [isOn, setIsOn] = useState(true);
  const hoveredRef = useRef(false);

  const defaultIntensityRef = useRef<number>(1.5);
  const emissiveMaterialsRef = useRef<EmissiveMaterialInfo[]>([]);
  const originalSwitchRotRef = useRef<THREE.Euler | null>(null);

  const spotLightRef = useRef<THREE.Light | null>(null);
  const switchObjRef = useRef<THREE.Object3D | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!scene || isInitializedRef.current) return;
    initLampState(
      scene,
      spotLightRef,
      switchObjRef,
      emissiveMaterialsRef,
      defaultIntensityRef,
      originalSwitchRotRef,
    );
    isInitializedRef.current = true;
  }, [scene]);

  useGSAP(
    () => {
      if (!scene || !isInitializedRef.current) return;
      animateLampEffect(
        spotLightRef.current,
        switchObjRef.current,
        originalSwitchRotRef.current,
        emissiveMaterialsRef.current,
        defaultIntensityRef.current,
        isOn,
      );
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

