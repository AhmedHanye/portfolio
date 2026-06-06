import { useEffect, useRef } from "react";
import * as THREE from "three";

interface VideoTextureOptions {
  loop?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  width?: string;
  height?: string;
}

export function useVideoTexture(
  src: string,
  onTextureReady: (texture: THREE.VideoTexture) => void,
  options?: VideoTextureOptions,
): void {
  const loop = options?.loop ?? true;
  const muted = options?.muted ?? true;
  const autoplay = options?.autoplay ?? true;
  const width = options?.width ?? "256px";
  const height = options?.height ?? "256px";

  const onTextureReadyRef = useRef<(texture: THREE.VideoTexture) => void>(onTextureReady);

  useEffect(() => {
    onTextureReadyRef.current = onTextureReady;
  }, [onTextureReady]);

  useEffect(() => {
    // Create the video element
    const video = document.createElement("video");
    video.src = src;

    // Configure settings for video playback
    video.muted = muted;
    if (muted) {
      video.setAttribute("muted", "");
    }
    video.loop = loop;
    if (loop) {
      video.setAttribute("loop", "");
    }
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.autoplay = autoplay;
    if (autoplay) {
      video.setAttribute("autoplay", "");
    }
    video.crossOrigin = "anonymous";
    video.setAttribute("crossorigin", "anonymous");

    // Position video element off-screen
    video.style.position = "absolute";
    video.style.top = "-9999px";
    video.style.left = "-9999px";
    video.style.width = width;
    video.style.height = height;
    video.style.opacity = "0";
    video.style.pointerEvents = "none";
    document.body.appendChild(video);

    // Create the VideoTexture
    const texture = new THREE.VideoTexture(video);
    // colorSpace was added in Three.js r152; @types/three is pinned at 0.151.0
    // so we cast. Upgrade @types/three when upgrading three itself.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (texture as any).colorSpace = THREE.SRGBColorSpace ?? "srgb";
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    onTextureReadyRef.current(texture);

    const handlePlay = () => {
      video.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn(
            `[useVideoTexture] Autoplay blocked for ${src}, waiting for user interaction:`,
            err,
          );
        }
      });
    };

    if (autoplay) {
      handlePlay();
      window.addEventListener("click", handlePlay, { once: true });
    }

    return () => {
      window.removeEventListener("click", handlePlay);
      video.pause();
      video.src = "";
      video.load();
      if (video.parentNode) {
        video.parentNode.removeChild(video);
      }
      texture.dispose();
    };
  }, [src, loop, muted, autoplay, width, height]);
}
