import { useEffect, useRef } from "react";
import * as THREE from "three";

interface VideoTextureOptions {
  loop?: boolean;
  muted?: boolean;
  autoplay?: boolean;
  width?: string;
  height?: string;
}

function applyVideoAttributes(video: HTMLVideoElement, options: VideoTextureOptions = {}): void {
  const {
    muted = true,
    loop = true,
    autoplay = true,
    width = "256px",
    height = "256px",
  } = options;

  video.muted = muted;
  video.defaultMuted = muted;
  video.loop = loop;
  video.playsInline = true;
  video.autoplay = autoplay;
  video.crossOrigin = "anonymous";

  Object.assign(video.style, {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    width,
    height,
    opacity: "0",
    pointerEvents: "none",
  });
}

function createConfiguredVideo(
  src: string,
  options?: VideoTextureOptions,
): HTMLVideoElement {
  const video = document.createElement("video");
  video.src = src;
  applyVideoAttributes(video, options);
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

const DEFAULT_OPTIONS: Required<VideoTextureOptions> = {
  loop: true,
  muted: true,
  autoplay: true,
  width: "256px",
  height: "256px",
};

function setupVideoAutoplay(video: HTMLVideoElement, src: string): () => void {
  const handlePlay = () => {
    video.play().catch((err) => {
      if (err.name !== "AbortError") {
        console.warn(`[useVideoTexture] Autoplay blocked for ${src}:`, err);
      }
    });
  };

  handlePlay();
  window.addEventListener("click", handlePlay, { once: true });
  return () => window.removeEventListener("click", handlePlay);
}

function cleanupVideo(video: HTMLVideoElement, texture: THREE.VideoTexture): void {
  video.pause();
  video.src = "";
  video.load();
  if (video.parentNode) {
    video.parentNode.removeChild(video);
  }
  texture.dispose();
}

export function useVideoTexture(
  src: string,
  onTextureReady: (texture: THREE.VideoTexture) => void,
  options: VideoTextureOptions = DEFAULT_OPTIONS,
): void {
  const onTextureReadyRef = useRef<(texture: THREE.VideoTexture) => void>(onTextureReady);

  useEffect(() => {
    onTextureReadyRef.current = onTextureReady;
  }, [onTextureReady]);

  useEffect(() => {
    const video = createConfiguredVideo(src, options);
    document.body.appendChild(video);

    const texture = createVideoTexture(video);
    onTextureReadyRef.current(texture);

    const cleanupAutoplay = options.autoplay !== false ? setupVideoAutoplay(video, src) : undefined;

    return () => {
      cleanupAutoplay?.();
      cleanupVideo(video, texture);
    };
  }, [src, options]);
}

