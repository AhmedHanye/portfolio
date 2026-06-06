"use client";

import * as THREE from "three";
import { useCanvasTexture } from "@/hooks/use-canvas-texture";

interface BotFaceLoadingProps {
  onTextureReady: (texture: THREE.Texture) => void;
}

export default function BotFaceLoading({
  onTextureReady,
}: BotFaceLoadingProps) {
  useCanvasTexture(
    (ctx, frame) => {
      // Dark CRT background
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 512, 512);

      const cx = 256;
      const cy = 256;
      const ticksCount = 12;
      const step = Math.floor(frame / 3) % ticksCount;

      ctx.save();
      ctx.translate(cx, cy);

      for (let i = 0; i < ticksCount; i++) {
        const diff = (step - i + ticksCount) % ticksCount;
        const opacity = Math.max(0.15, 1 - diff / 9);

        ctx.save();
        const angle = (i * 2 * Math.PI) / ticksCount;
        ctx.rotate(angle);

        ctx.beginPath();
        // Inner radius 60, outer radius 110, line width 14
        ctx.moveTo(0, -60);
        ctx.lineTo(0, -110);
        ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`; // #22c55e green
        ctx.lineWidth = 14;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    },
    onTextureReady,
    { width: 512, height: 512 },
  );

  return null;
}
