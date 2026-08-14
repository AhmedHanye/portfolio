/* eslint-disable react-hooks/immutability */
import { useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import {
  useLoader,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import SplineLoader from "@splinetool/loader";
import { useCrtMouseLook } from "@/hooks/use-crt-mouse-look";
import { useLampInteractivity } from "@/hooks/use-lamp-interactivity";
import { useScreenContent } from "@/hooks/use-screen-content";

function findScreenMesh(group: THREE.Group): THREE.Mesh | null {
  let found: THREE.Mesh | null = null;

  // traverse() skips invisible objects — use manual recursion instead
  function walk(obj: THREE.Object3D) {
    if (obj.name === "Screen" && obj instanceof THREE.Mesh) {
      found = obj;
      return;
    }
    for (const child of obj.children) {
      walk(child);
    }
  }

  walk(group);

  if (!found) {
    console.warn("Screen mesh not found in Spline scene");
  }

  return found;
}

function isCactus(obj: THREE.Object3D | null): boolean {
  let current: THREE.Object3D | null = obj;
  while (current) {
    if (/small-cactus/i.test(current.name)) return true;
    current = current.parent;
  }
  return false;
}

function applyMeshShadow(child: THREE.Object3D): void {
  if (child instanceof THREE.Mesh) {
    const isCup = /cup/i.test(child.name);
    child.castShadow = isCup || isCactus(child);
    child.receiveShadow = true;
  }
}

function isShadowCastingLight(child: THREE.Object3D): child is THREE.Light {
  return (
    child instanceof THREE.Light &&
    !(child instanceof THREE.AmbientLight || child instanceof THREE.HemisphereLight)
  );
}

function configureLightShadowProperties(light: THREE.Light): void {
  light.castShadow = true;
  if (light.shadow) {
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.bias = -0.0005;
  }
}

function applyLightShadow(child: THREE.Object3D): void {
  if (isShadowCastingLight(child)) {
    configureLightShadowProperties(child);
  }
}

function applyShadowsAndLighting(scene: THREE.Group): void {
  scene.traverse((child: THREE.Object3D) => {
    applyMeshShadow(child);
    applyLightShadow(child);
  });
}

function configureSceneCamera(scene: THREE.Group): void {
  const personalCamera = scene.getObjectByName("Personal Camera");
  if (personalCamera) {
    personalCamera.position.set(320.3, 813.4, 802.6);
    personalCamera.rotation.set(-0.733, 0.567, 0.451);
  }
}

function isScreenObject(obj: THREE.Object3D | null): boolean {
  let current = obj;
  while (current) {
    if (current.name === "Screen") return true;
    current = current.parent;
  }
  return false;
}

function useSplineScenePointerEvents({
  scene,
  activeContent,
  onEnterOs,
  gl,
}: {
  scene: THREE.Group | null;
  activeContent: string;
  onEnterOs?: () => void;
  gl: THREE.WebGLRenderer;
}) {
  const screenHoveredRef = useRef(false);
  const { handleClick, handlePointerMove, handlePointerOut, hoveredRef } =
    useLampInteractivity(scene);

  const handleSceneClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      handleClick(e);
      if (activeContent === "bot-face" && isScreenObject(e.object)) {
        e.stopPropagation();
        onEnterOs?.();
      }
    },
    [handleClick, activeContent, onEnterOs],
  );

  const handleScenePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      handlePointerMove(e);
      if (activeContent === "bot-face" && isScreenObject(e.object)) {
        e.stopPropagation();
        screenHoveredRef.current = true;
        gl.domElement.style.cursor = "pointer";
        return;
      }
      screenHoveredRef.current = false;
      gl.domElement.style.cursor = hoveredRef.current ? "pointer" : "";
    },
    [handlePointerMove, activeContent, gl, hoveredRef],
  );

  const handleScenePointerOut = useCallback(() => {
    handlePointerOut();
    screenHoveredRef.current = false;
    gl.domElement.style.cursor = "";
  }, [handlePointerOut, gl]);

  return { handleSceneClick, handleScenePointerMove, handleScenePointerOut };
}

export function useSplineScene(
  onReady?: () => void,
  onEnterOs?: () => void,
  isInteractive: boolean = true,
) {
  const scene = useLoader(SplineLoader, "/scene.splinecode");
  const screenRef = useRef<THREE.Group | null>(null);

  const hasNotifiedRef = useRef(false);

  // Notify when the first frame has successfully rendered within R3F loop
  useFrame(() => {
    if (!hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      onReady?.();
    }
  });

  useEffect(() => {
    if (scene) {
      applyShadowsAndLighting(scene);
      configureSceneCamera(scene);
    }
  }, [scene]);

  useCrtMouseLook(screenRef, isInteractive);

  const screenMesh = useMemo(() => {
    return findScreenMesh(scene);
  }, [scene]);

  // Store initial material in ref on first discovery so re-renders do not overwrite it.
  const originalMaterialRef = useRef<THREE.Material | THREE.Material[] | null>(null);

  useLayoutEffect(() => {
    if (!screenMesh) return;
    if (screenMesh.parent instanceof THREE.Group) {
      screenRef.current = screenMesh.parent;
    }
    if (!originalMaterialRef.current) {
      originalMaterialRef.current = screenMesh.material;
    }
  }, [screenMesh]);

  const handleBotFaceTextureReady = useMemo(() => {
    let activeMaterial: THREE.MeshBasicMaterial | null = null;

    return (texture: THREE.Texture) => {
      if (!screenMesh) return;

      if (activeMaterial) {
        activeMaterial.dispose();
      }

      const mat = new THREE.MeshBasicMaterial({
        map: texture,
        toneMapped: false,
      });

      screenMesh.material = mat;
      activeMaterial = mat;
    };
  }, [screenMesh]);

  useEffect(() => {
    return () => {
      if (screenMesh && originalMaterialRef.current) {
        screenMesh.material = originalMaterialRef.current;
      }
    };
  }, [screenMesh]);

  const { gl } = useThree();
  const activeContent = useScreenContent();

  const { handleSceneClick, handleScenePointerMove, handleScenePointerOut } =
    useSplineScenePointerEvents({ scene, activeContent, onEnterOs, gl });

  return {
    scene,
    screenMesh,
    screenRef,
    handleSceneClick,
    handleScenePointerMove,
    handleScenePointerOut,
    handleBotFaceTextureReady,
  };
}
