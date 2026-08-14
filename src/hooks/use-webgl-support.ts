"use client";

import { useSyncExternalStore } from "react";

let cachedSupport: boolean | null = null;

function probeGlContext(canvas: HTMLCanvasElement): RenderingContext | null {
  return (
    canvas.getContext("webgl2") ||
    canvas.getContext("webgl") ||
    canvas.getContext("experimental-webgl")
  );
}

function releaseGlContext(gl: RenderingContext | null): void {
  if (gl && "getExtension" in gl) {
    const loseContext = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
  }
}

function checkIsWebGLSupported(): boolean {
  if (typeof window === "undefined") return true;
  if (cachedSupport !== null) return cachedSupport;

  try {
    const canvas = document.createElement("canvas");
    const gl = probeGlContext(canvas);
    releaseGlContext(gl);
    cachedSupport = Boolean(gl);
    return cachedSupport;
  } catch {
    cachedSupport = false;
    return false;
  }
}

function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("webglcontextlost", callback);
  window.addEventListener("webglcontextrestored", callback);
  return () => {
    window.removeEventListener("webglcontextlost", callback);
    window.removeEventListener("webglcontextrestored", callback);
  };
}

function getSnapshot(): boolean {
  return checkIsWebGLSupported();
}

function getServerSnapshot(): boolean {
  return true;
}

export function useWebGLSupport() {
  const isSupported = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const recheck = () => {
    cachedSupport = null;
    return checkIsWebGLSupported();
  };

  return {
    isSupported,
    recheck,
  };
}
