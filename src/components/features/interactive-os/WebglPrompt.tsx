"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTextDirection } from "@/hooks/use-text-direction";
import { playFx } from "@/lib/sound";

interface WebglPromptProps {
  onLaunch2dMode?: () => void;
  onDismiss?: () => void;
}

const MODERN_FONT_STACK =
  "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

export default function WebglPrompt({ onLaunch2dMode, onDismiss }: WebglPromptProps) {
  const t = useTranslations("OS");
  const dir = useTextDirection();
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    // Play retro Win95 error ding sound when alert pops up
    playFx("error");
  }, []);

  const handleDismiss = () => {
    playFx("click");
    onDismiss?.();
  };

  const handleLaunch2d = () => {
    playFx("click");
    onLaunch2dMode?.();
  };

  const handleReload = () => {
    playFx("click");
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <dialog
      open
      className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs select-none m-0 max-w-none max-h-none h-full w-full border-none"
      dir={dir}
      aria-label={t("webglPrompt.title")}
      style={{ fontFamily: MODERN_FONT_STACK }}
    >
      <div
        className="relative w-full max-w-lg p-1 text-black shadow-[4px_4px_0px_#000000]"
        style={{
          backgroundColor: "#c0c0c0",
          borderTop: "2px solid #ffffff",
          borderLeft: "2px solid #ffffff",
          borderRight: "2px solid #404040",
          borderBottom: "2px solid #404040",
          fontFamily: MODERN_FONT_STACK,
        }}
      >
        {/* Win95 Window Title Bar */}
        <div className="flex h-7 items-center justify-between bg-linear-to-r from-[#000080] via-[#1084d0] to-[#000080] px-2 text-white">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className="text-sm">⚠️</span>
            <span>{t("webglPrompt.title")}</span>
          </div>
          {onDismiss && (
            <button
              type="button"
              onClick={handleDismiss}
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
          )}
        </div>

        {/* Window Content */}
        <div className="flex flex-col gap-3.5 p-3 sm:p-4">
          {/* Header Info Banner */}
          <div className="flex items-start gap-3">
            {/* Warning Icon Graphic */}
            <div
              className="flex size-12 shrink-0 items-center justify-center text-2xl"
              style={{
                backgroundColor: "#000000",
                borderTop: "2px solid #808080",
                borderLeft: "2px solid #808080",
                borderRight: "2px solid #ffffff",
                borderBottom: "2px solid #ffffff",
              }}
            >
              <span className="animate-pulse">⚠️</span>
            </div>

            <div className="flex flex-col gap-1 text-left rtl:text-right">
              <span className="font-bold text-[11px] tracking-wider text-[#800000] uppercase">
                {t("webglPrompt.badge")}
              </span>
              <p className="font-bold text-xs text-black leading-snug sm:text-sm">
                {t("webglPrompt.message")}
              </p>
            </div>
          </div>

          {/* Browser Guide Sunken Box */}
          <div
            className="flex flex-col gap-2 p-2.5 text-black"
            style={{
              backgroundColor: "#ffffff",
              borderTop: "2px solid #808080",
              borderLeft: "2px solid #808080",
              borderRight: "2px solid #ffffff",
              borderBottom: "2px solid #ffffff",
            }}
          >
            <div className="flex items-center justify-between border-b border-[#c0c0c0] pb-1 font-bold text-xs">
              <span className="text-[#000080]">{t("webglPrompt.guideTitle")}</span>
              <button
                type="button"
                onClick={() => {
                  playFx("click");
                  setShowGuide(!showGuide);
                }}
                aria-label={showGuide ? "Hide browser guide" : "Show browser guide"}
                className="cursor-pointer text-[10px] text-[#404040] underline hover:text-black"
              >
                {showGuide ? "▼" : "▲"}
              </button>
            </div>

            {showGuide && (
              <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[11px] leading-tight sm:text-xs">
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#000080]">▶</span>
                  <span>{t("webglPrompt.chromeStep")}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#000080]">▶</span>
                  <span>{t("webglPrompt.firefoxStep")}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="font-bold text-[#000080]">▶</span>
                  <span>{t("webglPrompt.safariStep")}</span>
                </li>
              </ul>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            {/* Primary Action: Direct 2D Desktop launch */}
            {onLaunch2dMode && (
              <button
                type="button"
                onClick={handleLaunch2d}
                className="flex cursor-pointer items-center gap-1.5 px-3.5 py-1.5 font-bold text-xs text-white shadow-[1px_1px_0px_#000000] hover:bg-[#1084d0]"
                style={{
                  backgroundColor: "#000080",
                  borderTop: "2px solid #ffffff",
                  borderLeft: "2px solid #ffffff",
                  borderRight: "2px solid #404040",
                  borderBottom: "2px solid #404040",
                }}
              >
                <span>💻</span>
                <span>{t("webglPrompt.open2dMode")}</span>
              </button>
            )}

            {/* External Guide Link */}
            <a
              href="https://get.webgl.org/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playFx("click")}
              className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 font-bold text-xs text-black no-underline shadow-[1px_1px_0px_#000000] hover:bg-[#d4d4d4] hover:text-black hover:no-underline"
              style={{
                backgroundColor: "#c0c0c0",
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderRight: "2px solid #404040",
                borderBottom: "2px solid #404040",
                textDecoration: "none",
              }}
            >
              <span>🌐</span>
              <span>{t("webglPrompt.learnMore")}</span>
            </a>

            {/* Reload / Retry */}
            <button
              type="button"
              onClick={handleReload}
              className="flex cursor-pointer items-center px-3 py-1.5 font-bold text-xs text-black shadow-[1px_1px_0px_#000000] hover:bg-[#d4d4d4]"
              style={{
                backgroundColor: "#c0c0c0",
                borderTop: "2px solid #ffffff",
                borderLeft: "2px solid #ffffff",
                borderRight: "2px solid #404040",
                borderBottom: "2px solid #404040",
              }}
            >
              {t("webglPrompt.retry")}
            </button>

            {/* Dismiss */}
            {onDismiss && (
              <button
                type="button"
                onClick={handleDismiss}
                className="flex cursor-pointer items-center px-2.5 py-1.5 font-bold text-xs text-black shadow-[1px_1px_0px_#000000] hover:bg-[#d4d4d4]"
                style={{
                  backgroundColor: "#c0c0c0",
                  borderTop: "2px solid #ffffff",
                  borderLeft: "2px solid #ffffff",
                  borderRight: "2px solid #404040",
                  borderBottom: "2px solid #404040",
                }}
              >
                {t("webglPrompt.dismiss")}
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
