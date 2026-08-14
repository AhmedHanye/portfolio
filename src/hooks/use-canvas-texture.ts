import { useEffect, useRef } from "react";
import * as THREE from "three";

type DrawFn = (ctx: CanvasRenderingContext2D, frame: number) => void;

interface CanvasTextureOptions {
  width?: number;
  height?: number;
}

export function useCanvasTexture(
  draw: DrawFn,
  onTextureReady: (texture: THREE.CanvasTexture) => void,
  options?: CanvasTextureOptions,
): void {
  const width = options?.width ?? 512;
  const height = options?.height ?? 512;

  const drawRef = useRef<DrawFn>(draw);
  const onTextureReadyRef = useRef<(texture: THREE.CanvasTexture) => void>(onTextureReady);

  useEffect(() => {
    drawRef.current = draw;
    onTextureReadyRef.current = onTextureReady;
  });

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const texture = new THREE.CanvasTexture(canvas);
    // colorSpace was added in Three.js r152; @types/three is pinned at 0.151.0
    // so we cast. Upgrade @types/three when upgrading three itself.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (texture as any).colorSpace = THREE.SRGBColorSpace ?? "srgb";

    onTextureReadyRef.current(texture);

    // Cache the 2D context once outside the rAF loop to avoid repeated lookups.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let frame = 0;

    const render = () => {
      drawRef.current(ctx, frame);
      texture.needsUpdate = true;
      frame += 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      texture.dispose();
    };
  }, [width, height]);
}
