"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTextDirection } from "@/hooks/use-text-direction";
import { playFx } from "@/lib/sound";

const MODERN_FONT_STACK =
  "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function isCompactScreenWidth(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth <= 768 || window.screen.width <= 768;
}

function isPortraitMobileViewport(): boolean {
  if (!isCompactScreenWidth()) return false;
  return window.innerHeight > window.innerWidth;
}

function RotatePromptHeader({
  title,
  onDismiss,
}: {
  title: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex h-7 items-center justify-between bg-linear-to-r from-[#000080] via-[#1084d0] to-[#000080] px-2 text-white">
      <div className="flex items-center gap-1.5 font-bold text-xs">
        <span className="text-sm">🔄</span>
        <span>{title}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Close"
        className="flex size-4 cursor-pointer items-center justify-center p-0 font-bold text-[10px] text-black leading-none"
        style={{
          backgroundColor: "#c0c0c0",
          borderTop: "1px solid #ffffff",
          borderLeft: "1px solid #ffffff",
          borderRight: "1px solid #404040",
          borderBottom: "1px solid #404040",
        }}
      >
        ✕
      </button>
    </div>
  );
}

function RotatingPhoneGraphic({ isRtl }: { isRtl: boolean }) {
  return (
    <div
      className="relative flex size-24 items-center justify-center p-2"
      style={{
        backgroundColor: "#000000",
        borderTop: "2px solid #808080",
        borderLeft: "2px solid #808080",
        borderRight: "2px solid #ffffff",
        borderBottom: "2px solid #ffffff",
      }}
    >
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className="flex h-16 w-10 flex-col items-center justify-between rounded-xs border-2 border-emerald-400 bg-emerald-950/80 p-1 transition-transform"
          style={{
            animation: "win95-rotate-phone 2.4s ease-in-out infinite",
            boxShadow: "0 0 8px rgba(52, 211, 153, 0.4)",
          }}
        >
          <div className="h-0.5 w-3 rounded-full bg-emerald-400/70" />
          <div className="flex flex-col items-center gap-0.5">
            <div className="h-1 w-5 rounded-xs bg-emerald-400/80" />
            <div className="h-1 w-3 rounded-xs bg-emerald-400/50" />
          </div>
          <div className="h-1 w-1 rounded-full border border-emerald-400/80" />
        </div>

        <svg
          className="pointer-events-none absolute h-20 w-20 text-emerald-400/70"
          style={{ transform: isRtl ? "scaleX(-1)" : undefined }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 25,25 A 35,35 0 0,1 78,35"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
          <polygon points="76,23 88,36 72,43" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export default function RotatePrompt() {
  const t = useTranslations("OS");
  const dir = useTextDirection();
  const isRtl = dir === "rtl";

  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const portraitMobile = isPortraitMobileViewport();
      setIsPortraitMobile(portraitMobile);
      if (!portraitMobile) {
        setDismissed(false);
      }
    };

    handleOrientationChange();
    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  if (!isPortraitMobile || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    playFx("click");
    setDismissed(true);
  };

  return (
    <dialog
      open
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs select-none m-0 max-w-none max-h-none h-full w-full border-none"
      dir={dir}
      aria-label={t("rotatePrompt.title")}
      style={{ fontFamily: MODERN_FONT_STACK }}
    >
      <div
        className="relative w-full max-w-sm p-1 text-black shadow-md"
        style={{
          backgroundColor: "#c0c0c0",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderRight: "2px solid #404040",
          borderBottom: "2px solid #404040",
          fontFamily: MODERN_FONT_STACK,
        }}
      >
        <RotatePromptHeader
          title={t("rotatePrompt.title")}
          onDismiss={handleDismiss}
        />

        <div className="flex flex-col items-center gap-4 p-4 text-center">
          <RotatingPhoneGraphic isRtl={isRtl} />

          <div className="flex flex-col gap-1">
            <p className="font-bold text-xs text-black sm:text-sm">
              {t("rotatePrompt.message")}
            </p>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="mt-1 flex cursor-pointer items-center justify-center px-4 py-1.5 font-bold text-xs text-black hover:bg-neutral-300"
            style={{
              backgroundColor: "#c0c0c0",
              borderTop: "2px solid #ffffff",
              borderLeft: "2px solid #ffffff",
              borderRight: "2px solid #404040",
              borderBottom: "2px solid #404040",
            }}
          >
            {t("rotatePrompt.dismiss")}
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes win95-rotate-phone {
          0%,
          20% {
            transform: rotate(0deg);
          }
          50%,
          70% {
            transform: rotate(-90deg);
          }
          90%,
          100% {
            transform: rotate(0deg);
          }
        }
      `}</style>
    </dialog>
  );
}
