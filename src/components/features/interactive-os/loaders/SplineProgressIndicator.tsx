"use client";

import { useProgress } from "@react-three/drei";
import { useState, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface SplineProgressIndicatorProps {
  isSceneReady: boolean;
  dir: "ltr" | "rtl";
}

export default function SplineProgressIndicator({
  isSceneReady,
  dir,
}: SplineProgressIndicatorProps) {
  const { progress } = useProgress();
  const [shouldRender, setShouldRender] = useState(true);

  const progressBarRef = useRef<HTMLDivElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Smoothly animate the progress bar width and the percentage text
  useGSAP(
    () => {
      if (!shouldRender) return;

      // Animate progress bar width
      gsap.to(progressBarRef.current, {
        width: `${progress}%`,
        duration: 0.4,
        ease: "power2.out",
      });

      // Animate percentage text value smoothly
      const currentVal = parseFloat(
        percentTextRef.current?.innerText.replace(/[^0-9]/g, "") || "0",
      );
      const tempObj = { val: currentVal };

      gsap.to(tempObj, {
        val: progress,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          if (percentTextRef.current) {
            percentTextRef.current.innerText = `Loading ${Math.round(tempObj.val)}%`;
          }
        },
      });
    },
    { dependencies: [progress], revertOnUpdate: false },
  );

  // Fade out the overlay once the scene is ready
  useGSAP(
    () => {
      if (isSceneReady && overlayRef.current) {
        gsap.to(overlayRef.current, {
          opacity: 0,
          pointerEvents: "none",
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            setShouldRender(false);
          },
        });
      }
    },
    { dependencies: [isSceneReady] },
  );

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      dir={dir}
      className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#171717] font-sans text-white"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Progress Bar Container */}
        <div className="h-2 w-40 overflow-hidden rounded-full bg-white/20">
          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="h-full bg-white"
            style={{ width: "0%" }}
          />
        </div>
        {/* Monospace percentage text */}
        <span
          ref={percentTextRef}
          className="font-mono tracking-widest text-white/80 uppercase"
        >
          Loading 0%
        </span>
      </div>
    </div>
  );
}
