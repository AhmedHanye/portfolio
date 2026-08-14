"use client";

import { useSyncExternalStore } from "react";

interface ViewportInfo {
  isCompact: boolean;
  isShortScreen: boolean;
  isMobile: boolean;
  isPortrait: boolean;
  width: number;
  height: number;
}

const DEFAULT_VIEWPORT: ViewportInfo = {
  isCompact: false,
  isShortScreen: false,
  isMobile: false,
  isPortrait: false,
  width: 1920,
  height: 1080,
};

function computeViewport(width: number, height: number): ViewportInfo {
  return {
    width,
    height,
    isCompact: width < 1024 || height < 680,
    isShortScreen: height < 520,
    isMobile: width < 768,
    isPortrait: height > width,
  };
}

function areViewportsEqual(a: ViewportInfo, b: ViewportInfo): boolean {
  return a.width === b.width && a.height === b.height;
}

let cachedSnapshot: ViewportInfo = DEFAULT_VIEWPORT;

function getSnapshot(): ViewportInfo {
  if (typeof window === "undefined") return DEFAULT_VIEWPORT;

  const next = computeViewport(window.innerWidth, window.innerHeight);
  if (!areViewportsEqual(cachedSnapshot, next)) {
    cachedSnapshot = next;
  }
  return cachedSnapshot;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("resize", callback);
  window.addEventListener("orientationchange", callback);

  return () => {
    window.removeEventListener("resize", callback);
    window.removeEventListener("orientationchange", callback);
  };
}

export function useCompactViewport(): ViewportInfo {
  return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_VIEWPORT);
}
