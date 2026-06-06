"use client";

import * as THREE from "three";
import { useVideoTexture } from "@/hooks/use-video-texture";

interface BotFaceProps {
  onTextureReady: (texture: THREE.Texture) => void;
}

export default function BotFace({ onTextureReady }: BotFaceProps) {
  useVideoTexture("/bot_face.webm", onTextureReady);
  return null;
}
