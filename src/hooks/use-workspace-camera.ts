/* eslint-disable react-hooks/immutability */
import { useEffect, useRef, useCallback } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/** Baseline viewport width at which baseZoom is 1:1. */
const BASE_WIDTH = 1536;
/** Default orthographic zoom at full viewport width. */
const BASE_ZOOM = 0.5;

const START_ROT_X = -0.733;
const START_ROT_Y = 0.567;
const START_ROT_Z = 0.451;
const START_POS_X = 320.3;
const START_POS_Y = 813.4;
const START_POS_Z = 802.6;

export interface CameraTransitionController {
  zoomToScreen: (onComplete?: () => void, onProgress?: (p: number) => void) => void;
  zoomToWorkspace: (onComplete?: () => void, onProgress?: (p: number) => void) => void;
}

/**
 * Handles the full logic of the scene camera for the workspace scene,
 * including responsive zoom scaling, camera configuration, and programmatic transitions.
 */
export function useWorkspaceCamera(
  scene: THREE.Group,
  controllerRef?: React.MutableRefObject<CameraTransitionController | null>,
  initialProgress = 0,
): {
  responsiveZoom: number;
} {
  const { size, set, camera } = useThree();

  const widthScale = size.width / BASE_WIDTH;
  const heightScale = size.height / 900;
  // In low-height landscape viewports (e.g. mobile landscape), scale to fit height without clipping
  const scale = Math.min(widthScale, heightScale < 0.9 ? heightScale * 1.15 : widthScale);
  const responsiveZoom = Math.max(0.18, Math.min(BASE_ZOOM, scale * BASE_ZOOM));

  const currentProgressRef = useRef(initialProgress);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Configure the loaded scene camera if it exists
  useEffect(() => {
    currentProgressRef.current = initialProgress;
    const cam = (scene.getObjectByName("Personal Camera") ||
      scene.getObjectByProperty("isCamera", true)) as
      | THREE.OrthographicCamera
      | undefined;

    if (cam) {
      cam.rotation.x = START_ROT_X + 0.44 * initialProgress;
      cam.rotation.y = START_ROT_Y - 0.52 * initialProgress;
      cam.rotation.z = START_ROT_Z - 0.46 * initialProgress;
      cam.position.x = START_POS_X - 540 * initialProgress;
      cam.position.y = START_POS_Y - 75 * initialProgress;
      cam.position.z = START_POS_Z;
      cam.zoom = responsiveZoom * (1 + 3.8 * initialProgress);
      cam.updateProjectionMatrix();
      set({ camera: cam });
    }

    return () => {
      if (tweenRef.current) {
        tweenRef.current.kill();
      }
      if (cam) {
        cam.rotation.x = START_ROT_X;
        cam.rotation.y = START_ROT_Y;
        cam.rotation.z = START_ROT_Z;
        cam.position.x = START_POS_X;
        cam.position.y = START_POS_Y;
        cam.position.z = START_POS_Z;
      }
    };
  }, [scene, responsiveZoom, set, initialProgress]);

  const applyCameraProgress = useCallback(
    (p: number) => {
      currentProgressRef.current = p;
      if (!camera) return;

      camera.rotation.x = START_ROT_X + 0.44 * p;
      camera.rotation.y = START_ROT_Y - 0.52 * p;
      camera.rotation.z = START_ROT_Z - 0.46 * p;
      camera.position.x = START_POS_X - 540 * p;
      camera.position.y = START_POS_Y - 75 * p;
      camera.position.z = START_POS_Z;

      if ("zoom" in camera) {
        (camera as THREE.OrthographicCamera).zoom =
          responsiveZoom * (1 + 3.8 * p);
        (camera as THREE.OrthographicCamera).updateProjectionMatrix();
      }
    },
    [camera, responsiveZoom],
  );

  const zoomToScreen = useCallback(
    (onComplete?: () => void, onProgress?: (p: number) => void) => {
      if (tweenRef.current) tweenRef.current.kill();

      const proxy = { progress: currentProgressRef.current };
      tweenRef.current = gsap.to(proxy, {
        progress: 1,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          applyCameraProgress(proxy.progress);
          onProgress?.(proxy.progress);
        },
        onComplete: () => {
          applyCameraProgress(1);
          onComplete?.();
        },
      });
    },
    [applyCameraProgress],
  );

  const zoomToWorkspace = useCallback(
    (onComplete?: () => void, onProgress?: (p: number) => void) => {
      if (tweenRef.current) tweenRef.current.kill();

      const proxy = { progress: currentProgressRef.current };
      tweenRef.current = gsap.to(proxy, {
        progress: 0,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          applyCameraProgress(proxy.progress);
          onProgress?.(proxy.progress);
        },
        onComplete: () => {
          applyCameraProgress(0);
          onComplete?.();
        },
      });
    },
    [applyCameraProgress],
  );

  useEffect(() => {
    if (controllerRef) {
      controllerRef.current = {
        zoomToScreen,
        zoomToWorkspace,
      };
    }
  }, [controllerRef, zoomToScreen, zoomToWorkspace]);

  return {
    responsiveZoom,
  };
}
