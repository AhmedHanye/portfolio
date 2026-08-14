import { useEffect, useRef } from "react";
import * as THREE from "three";

type DrawFn = (ctx: CanvasRenderingContext2D, frame: number) => void;

interface CanvasTextureOptions {
  width?: number;
  height?: number;
}

function createCanvasAndTexture(
  width: number,
  height: number,
): { canvas: HTMLCanvasElement; texture: THREE.CanvasTexture } {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const texture = new THREE.CanvasTexture(canvas);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (texture as any).colorSpace = THREE.SRGBColorSpace ?? "srgb";
  return { canvas, texture };
}

function startCanvasRenderLoop(
  ctx: CanvasRenderingContext2D,
  texture: THREE.CanvasTexture,
  drawRef: React.MutableRefObject<DrawFn>,
): () => void {
  let animationFrameId: number;
  let frame = 0;

  const render = () => {
    drawRef.current(ctx, frame);
    texture.needsUpdate = true;
    frame += 1;
    animationFrameId = requestAnimationFrame(render);
  };

  render();
  return () => cancelAnimationFrame(animationFrameId);
}

// fallow-ignore-next-line complexity
export function useCanvasTexture(
  draw: DrawFn,
  onTextureReady: (texture: THREE.CanvasTexture) => void,
  options?: CanvasTextureOptions,
): void {
  const width = options?.width || 512;
  const height = options?.height || 512;

  const drawRef = useRef<DrawFn>(draw);
  const onTextureReadyRef = useRef<(texture: THREE.CanvasTexture) => void>(onTextureReady);

  useEffect(() => {
    drawRef.current = draw;
    onTextureReadyRef.current = onTextureReady;
  });

  useEffect(() => {
    const { canvas, texture } = createCanvasAndTexture(width, height);
    onTextureReadyRef.current(texture);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => texture.dispose();

    const stopLoop = startCanvasRenderLoop(ctx, texture, drawRef);

    return () => {
      stopLoop();
      texture.dispose();
    };
  }, [width, height]);
}
