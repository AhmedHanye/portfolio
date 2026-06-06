import { type RefObject, useEffect, useRef } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

/** Matches Spline's "Plane Dist: 1000". */
const PLANE_DIST = 1000;

/**
 * Per-frame slerp alpha.
 * 0.06 ≈ Spline Damping 30 at 60 fps (takes ~1 s to reach 97 % of target).
 */
const LERP_ALPHA = 0.06;

export function useCrtMouseLook(
  targetRef: RefObject<THREE.Object3D | null>,
): void {
  const { camera, gl } = useThree();

  const restQ = useRef<THREE.Quaternion | null>(null);
  const targetQ = useRef(new THREE.Quaternion());
  const currentQ = useRef(new THREE.Quaternion());

  // Allocate scratch objects once to avoid garbage collection overhead in callbacks
  const scratchRef = useRef({
    raycaster: new THREE.Raycaster(),
    mouseNDC: new THREE.Vector2(),
    plane: new THREE.Plane(),
    planeNormal: new THREE.Vector3(),
    cursorWorld: new THREE.Vector3(),
    objectWorldPos: new THREE.Vector3(),
    savedQ: new THREE.Quaternion(),
  });

  const lastCursorRef = useRef({ x: 0, y: 0, hasMoved: false });
  const containerRectRef = useRef<DOMRect | null>(null);
  const canvasRectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const currentObject = targetRef.current;
    const updateRects = () => {
      const container = document.getElementById("hero-scroll-container");
      if (container) {
        containerRectRef.current = container.getBoundingClientRect();
      }
      if (gl.domElement) {
        canvasRectRef.current = gl.domElement.getBoundingClientRect();
      }
    };

    updateRects();

    const updateMouseLook = (clientX: number, clientY: number) => {
      const object = currentObject;
      if (!object) return;

      // Ensure rest orientation is captured once the object is loaded
      if (!restQ.current) {
        restQ.current = object.quaternion.clone();
        targetQ.current.copy(restQ.current);
        currentQ.current.copy(restQ.current);
      }

      if (!containerRectRef.current || !canvasRectRef.current) {
        updateRects();
        if (!containerRectRef.current || !canvasRectRef.current) return;
      }

      const containerRect = containerRectRef.current;
      const canvasRect = canvasRectRef.current;

      const isInsideTop50 =
        clientY >= containerRect.top &&
        clientY <= containerRect.top + containerRect.height / 2 &&
        clientX >= containerRect.left &&
        clientX <= containerRect.right;

      if (!isInsideTop50) {
        if (restQ.current) {
          targetQ.current.copy(restQ.current);
        }
        return;
      }

      const scratch = scratchRef.current;

      // Convert pixel coords to NDC [-1, 1] relative to the canvas element.
      scratch.mouseNDC.x = ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
      scratch.mouseNDC.y = -((clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

      // Build the camera-aligned plane on the NEAR (camera) side of the object.
      scratch.planeNormal.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
      object.getWorldPosition(scratch.objectWorldPos);
      
      scratch.plane.setFromNormalAndCoplanarPoint(
        scratch.planeNormal,
        scratch.objectWorldPos.addScaledVector(scratch.planeNormal, -PLANE_DIST),
      );

      // Cast a ray from NDC mouse through the orthographic camera.
      scratch.raycaster.setFromCamera(scratch.mouseNDC, camera);
      if (!scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.cursorWorld)) return;

      // Capture the lookAt quaternion without permanently changing rotation.
      scratch.savedQ.copy(object.quaternion);

      object.lookAt(scratch.cursorWorld);
      targetQ.current.copy(object.quaternion);

      // Restore so the slerp loop drives the actual rotation.
      object.quaternion.copy(scratch.savedQ);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastCursorRef.current.x = e.clientX;
      lastCursorRef.current.y = e.clientY;
      lastCursorRef.current.hasMoved = true;
      updateMouseLook(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      updateRects();
      if (!lastCursorRef.current.hasMoved) return;
      updateMouseLook(lastCursorRef.current.x, lastCursorRef.current.y);
    };

    const handleMouseLeave = () => {
      if (restQ.current) {
        targetQ.current.copy(restQ.current);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateRects, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateRects);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      
      // Hard-reset to rest pose on unmount.
      if (restQ.current && currentObject) {
        currentObject.quaternion.copy(restQ.current);
      }
    };
  }, [targetRef, camera, gl]);

  // Hook into R3F frame loop to perform smooth slerping
  useFrame(() => {
    const object = targetRef.current;
    if (!object) return;

    if (!restQ.current) {
      restQ.current = object.quaternion.clone();
      targetQ.current.copy(restQ.current);
      currentQ.current.copy(restQ.current);
    }

    currentQ.current.slerp(targetQ.current, LERP_ALPHA);
    object.quaternion.copy(currentQ.current);
  });
}
