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

let currentSnapshot: ViewportInfo = DEFAULT_VIEWPORT;

function getSnapshot(): ViewportInfo {
  if (typeof window === "undefined") return DEFAULT_VIEWPORT;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isCompact = width < 1024 || height < 680;
  const isShortScreen = height < 520;
  const isMobile = width < 768;
  const isPortrait = height > width;

  if (
    currentSnapshot.width !== width ||
    currentSnapshot.height !== height ||
    currentSnapshot.isCompact !== isCompact ||
    currentSnapshot.isShortScreen !== isShortScreen ||
    currentSnapshot.isMobile !== isMobile ||
    currentSnapshot.isPortrait !== isPortrait
  ) {
    currentSnapshot = {
      isCompact,
      isShortScreen,
      isMobile,
      isPortrait,
      width,
      height,
    };
  }

  return currentSnapshot;
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
