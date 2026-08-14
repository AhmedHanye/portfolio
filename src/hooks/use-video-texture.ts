import { useEffect, useRef } from "react";
import * as THREE from "three";

interface VideoTextureOptions {
  loop?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  width?: string;
  height?: string;
}

function createConfiguredVideo(
  src: string,
  options?: VideoTextureOptions,
): HTMLVideoElement {
  const video = document.createElement("video");
  video.src = src;

  const {
    muted = true,
    loop = true,
    autoplay = true,
    width = "256px",
    height = "256px",
  } = options || {};

  video.muted = muted;
  video.loop = loop;
  video.playsInline = true;
  video.autoplay = autoplay;
  video.crossOrigin = "anonymous";

  if (muted) video.setAttribute("muted", "");
  if (loop) video.setAttribute("loop", "");
  if (autoplay) video.setAttribute("autoplay", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("crossorigin", "anonymous");

  Object.assign(video.style, {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    width,
    height,
    opacity: "0",
    pointerEvents: "none",
  });

  return video;
}

function createVideoTexture(video: HTMLVideoElement): THREE.VideoTexture {
  const texture = new THREE.VideoTexture(video);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (texture as any).colorSpace = THREE.SRGBColorSpace ?? "srgb";
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
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
    const video = createConfiguredVideo(src, options);
    document.body.appendChild(video);

    const texture = createVideoTexture(video);
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
  }, [src, loop, muted, autoplay, width, height, options]);
}

