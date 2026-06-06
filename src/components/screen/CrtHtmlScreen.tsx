"use client";

import { createPortal } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";
import { useCrtScreenGeometry } from "@/hooks/use-crt-screen-geometry";

interface CrtHtmlScreenProps {
  screenMesh: THREE.Mesh;
  children: React.ReactNode;
  messages: AbstractIntlMessages;
  locale: string;
  dir: "ltr" | "rtl";
}

export default function CrtHtmlScreen({
  screenMesh,
  children,
  messages,
  locale,
  dir,
}: CrtHtmlScreenProps) {
  const { scaleX, scaleY, position, width, height } =
    useCrtScreenGeometry(screenMesh);

  return createPortal(
    <group scale={[scaleX, scaleY, 1]} position={position}>
      <Html
        transform
        dir={dir}
        distanceFactor={400}
        style={{
          pointerEvents: "auto",
          width: `${width}px`,
          height: `${height}px`,
        }}
        zIndexRange={[1, 0]}
      >
        <main
          dir={dir}
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            background: "#0a0a0a",
            borderRadius: "30px",
            overflow: "hidden",
            width: "99%",
            height: "100%",
          }}
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        </main>
      </Html>
    </group>,
    screenMesh,
  );
}
