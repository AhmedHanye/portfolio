import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap, useGSAP } from "@/lib/gsap";

/** Baseline viewport width at which baseZoom is 1:1. */
const BASE_WIDTH = 1536;
/** Default orthographic zoom at full viewport width. */
const BASE_ZOOM = 0.5;

/**
 * Handles the full logic of the scene camera for the workspace scene,
 * including responsive zoom scaling, camera configuration, and scroll-driven animation.
 */
export function useWorkspaceCamera(
  scene: THREE.Group,
  targetRef: React.RefObject<THREE.Object3D | null>,
): {
  responsiveZoom: number;
} {
  const { size, set, camera } = useThree();

  const responsiveZoom =
    size.width < BASE_WIDTH ? (size.width / BASE_WIDTH) * BASE_ZOOM : BASE_ZOOM;

  // Configure the loaded scene camera if it exists
  useEffect(() => {
    const cam = (scene.getObjectByName("Personal Camera") ||
      scene.getObjectByProperty("isCamera", true)) as
      | THREE.OrthographicCamera
      | undefined;
    if (cam) {
      cam.zoom = responsiveZoom;
      cam.updateProjectionMatrix();
      set({ camera: cam });
    }
  }, [scene, responsiveZoom, set]);

  // Handle scroll trigger animation on the active camera
  useGSAP(() => {
    const target = targetRef.current;
    if (!camera || !target) return;

    // Capture starting state so we animate FROM these values.
    const startRotX = camera.rotation.x;
    const startRotY = camera.rotation.y;
    const startRotZ = camera.rotation.z;
    const startPosX = camera.position.x;
    const startPosY = camera.position.y;
    const startZoom =
      "zoom" in camera ? (camera as THREE.OrthographicCamera).zoom : 1;

    // Proxy object gives GSAP plain numerics to tween.
    const proxy = {
      rotX: startRotX,
      rotY: startRotY,
      rotZ: startRotZ,
      posX: startPosX,
      posY: startPosY,
      zoom: startZoom,
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
        snap: {
          snapTo: (value, self) => {
            return self?.direction === 1 ? 1 : 0;
          },
          duration: { min: 0.3, max: 0.6 },
          delay: 0.05,
          ease: "power2.inOut",
        },
      },
    });

    tl.to(proxy, {
      rotX: startRotX + 0.42, // tilt forward
      rotY: startRotY - 0.5, // rotate left
      rotZ: startRotZ - 0.45, // roll clockwise
      posX: startPosX - 530, // move left
      posY: startPosY - 70, // move down
      zoom: startZoom * 4.3, // zoom in
      ease: "none",
      onUpdate() {
        camera.rotation.x = proxy.rotX;
        camera.rotation.y = proxy.rotY;
        camera.rotation.z = proxy.rotZ;
        camera.position.x = proxy.posX;
        camera.position.y = proxy.posY;
        if ("zoom" in camera) {
          (camera as THREE.OrthographicCamera).zoom = proxy.zoom;
          (camera as THREE.OrthographicCamera).updateProjectionMatrix();
        }
      },
    });
  }, [camera, targetRef]);

  return {
    responsiveZoom,
  };
}
