import { useMemo } from "react";
import * as THREE from "three";

const OS_DESIGN_WIDTH = 1020;
const OS_DESIGN_HEIGHT = 770;

interface ScreenGeometry {
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  position: [number, number, number];
}

export function useCrtScreenGeometry(screenMesh: THREE.Mesh): ScreenGeometry {
  return useMemo(() => {
    if (!screenMesh.geometry.boundingBox) {
      screenMesh.geometry.computeBoundingBox();
    }
    const localSize = new THREE.Vector3();
    screenMesh.geometry.boundingBox!.getSize(localSize);

    const localCenter = new THREE.Vector3();
    screenMesh.geometry.boundingBox!.getCenter(localCenter);

    return {
      width: OS_DESIGN_WIDTH,
      height: OS_DESIGN_HEIGHT,
      scaleX: localSize.x / OS_DESIGN_WIDTH,
      scaleY: localSize.y / OS_DESIGN_HEIGHT,
      position: [
        localCenter.x + 1.0, // Shifted to the right to align with the physical screen bezel
        localCenter.y + 1.5,
        localCenter.z + localSize.z / 2 + 0.02,
      ] as [number, number, number],
    };
  }, [screenMesh]);
}
