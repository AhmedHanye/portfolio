import { type RefObject, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";

/** Matches Spline's "Plane Dist: 1000". */
const PLANE_DIST = 1000;

/**
 * Per-frame slerp alpha.
 * 0.06 ≈ Spline Damping 30 at 60 fps (takes ~1 s to reach 97 % of target).
 */
const LERP_ALPHA = 0.06;

interface ScratchObjects {
  raycaster: THREE.Raycaster;
  mouseNDC: THREE.Vector2;
  plane: THREE.Plane;
  planeNormal: THREE.Vector3;
  cursorWorld: THREE.Vector3;
  objectWorldPos: THREE.Vector3;
  savedQ: THREE.Quaternion;
}

function createScratchObjects(): ScratchObjects {
  return {
    raycaster: new THREE.Raycaster(),
    mouseNDC: new THREE.Vector2(),
    plane: new THREE.Plane(),
    planeNormal: new THREE.Vector3(),
    cursorWorld: new THREE.Vector3(),
    objectWorldPos: new THREE.Vector3(),
    savedQ: new THREE.Quaternion(),
  };
}

function isInsideRect(clientX: number, clientY: number, rect: DOMRect): boolean {
  return (
    clientY >= rect.top &&
    clientY <= rect.bottom &&
    clientX >= rect.left &&
    clientX <= rect.right
  );
}

function computeMouseLook(
  object: THREE.Object3D,
  camera: THREE.Camera,
  clientX: number,
  clientY: number,
  canvasRect: DOMRect,
  scratch: ScratchObjects,
  targetQ: THREE.Quaternion,
): void {
  scratch.mouseNDC.x = ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
  scratch.mouseNDC.y = -((clientY - canvasRect.top) / canvasRect.height) * 2 + 1;

  scratch.planeNormal.set(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
  object.getWorldPosition(scratch.objectWorldPos);

  scratch.plane.setFromNormalAndCoplanarPoint(
    scratch.planeNormal,
    scratch.objectWorldPos.addScaledVector(scratch.planeNormal, -PLANE_DIST),
  );

  scratch.raycaster.setFromCamera(scratch.mouseNDC, camera);
  if (!scratch.raycaster.ray.intersectPlane(scratch.plane, scratch.cursorWorld)) return;

  scratch.savedQ.copy(object.quaternion);
  object.lookAt(scratch.cursorWorld);
  targetQ.copy(object.quaternion);
  object.quaternion.copy(scratch.savedQ);
}

export function useCrtMouseLook(
  targetRef: RefObject<THREE.Object3D | null>,
  enabled: boolean = true,
): void {
  const { camera, gl } = useThree();

  const restQ = useRef<THREE.Quaternion | null>(null);
  const [targetQ] = useState(() => new THREE.Quaternion());
  const [currentQ] = useState(() => new THREE.Quaternion());
  const [scratch] = useState(() => createScratchObjects());

  const lastCursorRef = useRef({ x: 0, y: 0, hasMoved: false });
  const containerRectRef = useRef<DOMRect | null>(null);
  const canvasRectRef = useRef<DOMRect | null>(null);

  // If disabled, immediately reset targetQ to restQ so it smoothly slerps to rest
  useEffect(() => {
    if (!enabled && restQ.current) {
      targetQ.copy(restQ.current);
    }
  }, [enabled, targetQ]);

  useEffect(() => {
    const currentObject = targetRef.current;
    const updateRects = () => {
      if (gl.domElement) {
        canvasRectRef.current = gl.domElement.getBoundingClientRect();
        containerRectRef.current = canvasRectRef.current;
      }
    };

    updateRects();

    const updateMouseLook = (clientX: number, clientY: number) => {
      if (!enabled) return;
      const object = currentObject;
      if (!object) return;

      if (!restQ.current) {
        restQ.current = object.quaternion.clone();
        targetQ.copy(restQ.current);
        currentQ.copy(restQ.current);
      }

      if (!containerRectRef.current || !canvasRectRef.current) {
        updateRects();
        if (!containerRectRef.current || !canvasRectRef.current) return;
      }

      if (!isInsideRect(clientX, clientY, containerRectRef.current)) {
        if (restQ.current) targetQ.copy(restQ.current);
        return;
      }

      computeMouseLook(
        object,
        camera,
        clientX,
        clientY,
        canvasRectRef.current,
        scratch,
        targetQ,
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enabled) return;
      lastCursorRef.current.x = e.clientX;
      lastCursorRef.current.y = e.clientY;
      lastCursorRef.current.hasMoved = true;
      updateMouseLook(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      if (restQ.current) targetQ.copy(restQ.current);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", updateRects, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateRects);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);

      if (restQ.current && currentObject) {
        currentObject.quaternion.copy(restQ.current);
      }
    };
  }, [targetRef, camera, gl, enabled, scratch, targetQ, currentQ]);

  useFrame(() => {
    const object = targetRef.current;
    if (!object) return;

    if (!restQ.current) {
      restQ.current = object.quaternion.clone();
      targetQ.copy(restQ.current);
      currentQ.copy(restQ.current);
    }

    if (!enabled && restQ.current) {
      targetQ.copy(restQ.current);
    }

    currentQ.slerp(targetQ, LERP_ALPHA);
    object.quaternion.copy(currentQ);
  });
}

