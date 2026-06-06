"use client";

import React from "react";

/**
 * Thin wrapper around <img> for small Win95-style icons (16×16 / 32×32).
 * Using next/image for these fixed-size assets would inject an unwanted wrapper
 * div that breaks the flex layouts inside react95 components.
 * The eslint suppression is intentionally scoped to this one file.
 */
interface Win95IconProps {
  src: string;
  alt: string;
  size?: 16 | 32;
  style?: React.CSSProperties;
}

export function Win95Icon({ src, alt, size = 16, style }: Win95IconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size, ...style }}
    />
  );
}
