/* eslint-disable react-hooks/immutability */
import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from "react";
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
import { gsap } from "@/lib/gsap";

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

export function useSplineScene(onReady?: () => void) {
  const scene = useLoader(SplineLoader, "/scene.splinecode");
  const screenRef = useRef<THREE.Group | null>(null);

  const hasNotifiedRef = useRef(false);

  // Notify when the first frame has successfully rendered within R3F loop
  useFrame(() => {
    if (onReady && !hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      requestAnimationFrame(() => {
        onReady();
      });
    }
  });

  useLayoutEffect(() => {
    if (scene) {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          const isCup = /cup/i.test(child.name);
          let isCactusDescendant = false;
          let current: THREE.Object3D | null = child;
          while (current) {
            if (/small-cactus/i.test(current.name)) {
              isCactusDescendant = true;
              break;
            }
            current = current.parent;
          }
          child.castShadow = isCup || isCactusDescendant;
          child.receiveShadow = true;
        }
        if (child instanceof THREE.Light) {
          if (
            !(
              child instanceof THREE.AmbientLight ||
              child instanceof THREE.HemisphereLight
            )
          ) {
            child.castShadow = true;
            if (child.shadow) {
              child.shadow.mapSize.width = 2048;
              child.shadow.mapSize.height = 2048;
              child.shadow.bias = -0.0005;
            }
          }
        }
      });
      screenRef.current = scene.getObjectByName("Top-CRT") as THREE.Group;
    }
  }, [scene]);

  const screenMesh = useMemo(() => {
    if (!scene) return null;
    const group = scene.getObjectByName("Top-CRT") as THREE.Group;
    return group ? findScreenMesh(group) : null;
  }, [scene]);

  useCrtMouseLook(screenRef);

  // Only used by BotFace — Os is rendered via <Html> instead of a texture.
  const originalMaterial = useMemo(() => {
    return screenMesh ? screenMesh.material : null;
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
      if (screenMesh && originalMaterial) {
        screenMesh.material = originalMaterial;
      }
    };
  }, [screenMesh, originalMaterial]);

  const { gl } = useThree();
  const activeContent = useScreenContent(screenMesh, originalMaterial);
  const [screenHovered, setScreenHovered] = useState(false);

  const { handleClick, handlePointerMove, handlePointerOut, hovered } =
    useLampInteractivity(scene);

  // Manage cursor style dynamically to prevent overlapping side effects
  useEffect(() => {
    const isHovered = hovered || screenHovered;
    const canvasElement = gl.domElement;
    if (canvasElement) {
      canvasElement.style.cursor = isHovered ? "pointer" : "";
    }
    return () => {
      if (canvasElement) {
        canvasElement.style.cursor = "";
      }
    };
  }, [hovered, screenHovered, gl]);

  /** Walks up the ancestor chain to check if obj is a descendant of "Screen". */
  const isScreenObject = (obj: THREE.Object3D | null): boolean => {
    let current = obj;
    while (current) {
      if (current.name === "Screen") return true;
      current = current.parent;
    }
    return false;
  };

  const handleSceneClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      // 1. Handle lamp click
      handleClick(e);

      // 2. Handle screen click-to-zoom when showing bot face
      if (activeContent === "bot-face" && isScreenObject(e.object)) {
        e.stopPropagation();
        gsap.to(window, {
          scrollTo: document.documentElement.scrollHeight,
          duration: 1.2,
          ease: "power2.inOut",
        });
      }
    },
    [handleClick, activeContent],
  );

  const handleScenePointerMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      // 1. Handle lamp hover check
      handlePointerMove(e);

      // 2. Handle screen hover check when showing bot face
      if (activeContent === "bot-face" && isScreenObject(e.object)) {
        e.stopPropagation();
        setScreenHovered(true);
        return;
      }
      setScreenHovered(false);
    },
    [handlePointerMove, activeContent],
  );

  const handleScenePointerOut = useCallback(() => {
    handlePointerOut();
    setScreenHovered(false);
  }, [handlePointerOut]);

  return {
    scene,
    screenRef,
    screenMesh,
    handleBotFaceTextureReady,
    activeContent,
    handleSceneClick,
    handleScenePointerMove,
    handleScenePointerOut,
  };
}
