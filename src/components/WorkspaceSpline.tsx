"use client";

import { Suspense, lazy, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import SplineProgressIndicator from "@/components/loaders/SplineProgressIndicator";
import BotFaceLoading from "@/components/loaders/BotFaceLoading";
import * as THREE from "three";
import CrtHtmlScreen from "@/components/screen/CrtHtmlScreen";
import { useWorkspaceCamera } from "@/hooks/use-workspace-camera";
import { useSplineScene } from "@/hooks/use-spline-scene";
import { useTextDirection } from "@/hooks/use-text-direction";
import OsLoader from "@/components/loaders/OsLoader";
import { useRouter, usePathname } from "@/i18n/routing";
import { useMessages, useLocale, AbstractIntlMessages } from "next-intl";

// Lazy-loaded screen components for performance optimization
const Os = lazy(() => import("./screen/OS"));
const BotFace = lazy(() => import("./screen/BotFace"));

interface SplineCameraProps {
  scene: THREE.Group;
  screenRef: React.RefObject<THREE.Group | null>;
}

function SplineCamera({ scene, screenRef }: SplineCameraProps) {
  const { responsiveZoom } = useWorkspaceCamera(scene, screenRef);

  return (
    <OrthographicCamera
      name="Camera"
      makeDefault
      zoom={responsiveZoom}
      far={100000}
      near={-100000}
      position={[320.3, 813.4, 802.6]}
      rotation={[-0.733, 0.567, 0.451]}
    />
  );
}

/**
 * Mirrors a separate group's world transform to the screen mesh every frame.
 * This lets <Html> follow the mesh (including mouse-look rotations) without
 * touching the mesh itself or re-parenting it in the scene graph.
 *
 * Sizing strategy:
 *   - Outer div: faceWidth × faceHeight (Three.js world units) → fills the mesh
 *   - Inner div: fixed 512 × 512 "design pixels" → content is always readable
 *   - CSS scale bridges the two: scale(faceW/512, faceH/512)
 */

interface ScreenContentProps {
  screenMesh: THREE.Mesh | null;
  handleBotFaceTextureReady: (texture: THREE.Texture) => void;
  activeContent: "bot-face" | "os";
  messages: AbstractIntlMessages;
  locale: string;
  dir: "ltr" | "rtl";
  onToggleLanguage: () => void;
}

function ScreenContent({
  screenMesh,
  handleBotFaceTextureReady,
  activeContent,
  messages,
  locale,
  dir,
  onToggleLanguage,
}: ScreenContentProps) {
  return (
    <>
      {screenMesh && activeContent === "os" && (
        <CrtHtmlScreen screenMesh={screenMesh} messages={messages} locale={locale} dir={dir}>
          <Suspense fallback={<OsLoader />}>
            <Os onToggleLanguage={onToggleLanguage} />
          </Suspense>
        </CrtHtmlScreen>
      )}

      {screenMesh && activeContent === "bot-face" && (
        <Suspense
          fallback={
            <BotFaceLoading onTextureReady={handleBotFaceTextureReady} />
          }
        >
          <BotFace onTextureReady={handleBotFaceTextureReady} />
        </Suspense>
      )}
    </>
  );
}

interface SceneProps {
  onReady: () => void;
  messages: AbstractIntlMessages;
  locale: string;
  dir: "ltr" | "rtl";
  onToggleLanguage: () => void;
}

function Scene({ onReady, messages, locale, dir, onToggleLanguage }: SceneProps) {
  const {
    scene,
    screenRef,
    screenMesh,
    handleBotFaceTextureReady,
    activeContent,
    handleSceneClick,
    handleScenePointerMove,
    handleScenePointerOut,
  } = useSplineScene(onReady);

  return (
    <>
      <primitive
        object={scene}
        onClick={handleSceneClick}
        onPointerMove={handleScenePointerMove}
        onPointerOut={handleScenePointerOut}
      />

      <ScreenContent
        screenMesh={screenMesh}
        handleBotFaceTextureReady={handleBotFaceTextureReady}
        activeContent={activeContent}
        messages={messages}
        locale={locale}
        dir={dir}
        onToggleLanguage={onToggleLanguage}
      />

      <SplineCamera scene={scene} screenRef={screenRef} />
    </>
  );
}

export default function WorkspaceSpline() {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const messages = useMessages();
  const locale = useLocale();
  const dir = useTextDirection();
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="sticky top-0 h-screen" dir="ltr">
      <Canvas shadows>
        <Suspense>
          <Scene
            onReady={() => setIsSceneReady(true)}
            messages={messages}
            locale={locale}
            dir={dir}
            onToggleLanguage={handleToggleLanguage}
          />
        </Suspense>
      </Canvas>
      <SplineProgressIndicator isSceneReady={isSceneReady} dir={dir} />
    </div>
  );
}
