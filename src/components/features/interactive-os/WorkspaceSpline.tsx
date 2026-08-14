"use client";

import { Suspense, lazy, useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import SplineProgressIndicator from "./loaders/SplineProgressIndicator";
import BotFaceLoading from "./loaders/BotFaceLoading";
import * as THREE from "three";
import { useWorkspaceCamera, type CameraTransitionController } from "@/hooks/use-workspace-camera";
import { useSplineScene } from "@/hooks/use-spline-scene";
import { useTextDirection } from "@/hooks/use-text-direction";
import OsLoader from "./loaders/OsLoader";
import RotatePrompt from "./RotatePrompt";
import WebglPrompt from "./WebglPrompt";
import WebGLErrorBoundary from "./WebGLErrorBoundary";
import { useWebGLSupport } from "@/hooks/use-webgl-support";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations, NextIntlClientProvider, useMessages, type AbstractIntlMessages } from "next-intl";
import { playFx } from "@/lib/sound";

// Lazy-loaded screen components for performance optimization
const Os = lazy(() => import("./desktop/OS"));
const BotFace = lazy(() => import("./BotFace"));

interface SplineCameraProps {
  scene: THREE.Group;
  cameraControllerRef?: React.MutableRefObject<CameraTransitionController | null>;
  initialProgress?: number;
}

function SplineCamera({ scene, cameraControllerRef, initialProgress = 0 }: SplineCameraProps) {
  const { responsiveZoom } = useWorkspaceCamera(scene, cameraControllerRef, initialProgress);

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

interface ScreenContentProps {
  screenMesh: THREE.Mesh | null;
  handleBotFaceTextureReady: (texture: THREE.Texture) => void;
}

function ScreenContent({
  screenMesh,
  handleBotFaceTextureReady,
}: ScreenContentProps) {
  return (
    <>
      {screenMesh && (
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
  onEnterOs: () => void;
  isInteractive?: boolean;
  cameraControllerRef?: React.MutableRefObject<CameraTransitionController | null>;
  initialProgress?: number;
}

function Scene({
  onReady,
  onEnterOs,
  isInteractive = true,
  cameraControllerRef,
  initialProgress = 0,
}: SceneProps) {
  const {
    scene,
    screenMesh,
    handleBotFaceTextureReady,
    handleSceneClick,
    handleScenePointerMove,
    handleScenePointerOut,
  } = useSplineScene(onReady, onEnterOs, isInteractive);

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
      />

      <SplineCamera
        scene={scene}
        cameraControllerRef={cameraControllerRef}
        initialProgress={initialProgress}
      />
    </>
  );
}

function subscribeSession(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("popstate", callback);
  };
}

function activateOsSession() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("win95_active", "true");
    const url = new URL(window.location.href);
    url.searchParams.set("os", "true");
    window.history.replaceState(null, "", url.pathname + url.search);
  }
}

function getSessionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("os") === "true";
}

function getSessionBootedSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem("win95_booted") === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

function clearOsSessionStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("win95_active");
  sessionStorage.removeItem("win95_booted");
  sessionStorage.removeItem("win95_windows");
  sessionStorage.removeItem("win95_active_tab");
  const url = new URL(window.location.href);
  url.searchParams.delete("os");
  window.history.replaceState(null, "", url.pathname + (url.search ? url.search : ""));
}

function getCleanPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname.replace(/^\/(en|ar)/, "") || "/";
}

function persistOsSession(isOsActive: boolean): void {
  if (isOsActive && typeof window !== "undefined") {
    sessionStorage.setItem("win95_active", "true");
  }
}

function resolveLanguageToggle(
  locale: string,
  isOsActive: boolean,
): { nextLocale: string; targetPath: string } {
  persistOsSession(isOsActive);
  const nextLocale = locale === "en" ? "ar" : "en";
  const currentPath = getCleanPath();
  const targetPath = isOsActive ? `${currentPath}?os=true` : currentPath;
  return { nextLocale, targetPath };
}

function useOsScrollLock(effectiveOsActive: boolean): void {
  useEffect(() => {
    if (effectiveOsActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [effectiveOsActive]);
}

function useOsBootSequence(
  effectiveOsActive: boolean,
  isOsBooted: boolean,
  onBooted: () => void,
): void {
  const onBootedRef = useRef(onBooted);
  useEffect(() => {
    onBootedRef.current = onBooted;
  });

  useEffect(() => {
    if (effectiveOsActive && !isOsBooted) {
      const bootTimer = setTimeout(() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("win95_booted", "true");
        }
        onBootedRef.current();
        playFx("startup");
      }, 1800);
      return () => clearTimeout(bootTimer);
    }
  }, [effectiveOsActive, isOsBooted]);
}

function WebGLFallbackView({
  showControls,
  promptTitle,
  open2dLabel,
  onShowPrompt,
  onEnter2d,
}: {
  showControls: boolean;
  promptTitle: string;
  open2dLabel: string;
  onShowPrompt: () => void;
  onEnter2d: () => void;
}) {
  return (
    <div className="relative flex h-full w-full items-center justify-center bg-[#0a0a0c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a24] via-[#0d0d12] to-[#050508]">
      {showControls && (
        <div className="z-30 flex flex-col items-center gap-3 p-4">
          <button
            type="button"
            onClick={onShowPrompt}
            className="flex cursor-pointer items-center gap-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-4 py-2 font-bold text-xs text-black shadow-[2px_2px_0px_#000000] hover:bg-[#d4d4d4]"
          >
            <span>⚠️</span>
            <span>{promptTitle}</span>
          </button>
          <button
            type="button"
            onClick={onEnter2d}
            className="flex cursor-pointer items-center gap-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#000080] px-4 py-2 font-bold text-xs text-white shadow-[2px_2px_0px_#000000] hover:bg-[#1084d0]"
          >
            <span>💻</span>
            <span>{open2dLabel}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function WorkspaceBackButton({
  dir,
  label,
  onExit,
}: {
  dir: string;
  label: string;
  onExit: () => void;
}) {
  return (
    <div
      className="fixed top-4 z-30 flex items-center gap-2 px-4"
      style={{
        left: dir === "rtl" ? "auto" : "16px",
        right: dir === "rtl" ? "16px" : "auto",
      }}
    >
      <button
        type="button"
        onClick={onExit}
        title={label}
        className="flex cursor-pointer items-center gap-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-3.5 py-1.5 font-bold text-xs text-black shadow-[2px_2px_0px_#000000] hover:bg-[#d4d4d4]"
      >
        <span>{dir === "rtl" ? "➜" : "⬅"}</span>
        <span>{label}</span>
      </button>
    </div>
  );
}

function Workspace3DScene({
  isWebGLUnavailable,
  isWebglPromptDismissed,
  effectiveOsActive,
  isInteractive,
  promptTitle,
  open2dLabel,
  cameraControllerRef,
  onShowPrompt,
  onEnterOs,
  onDirectEnterOs,
  onSceneReady,
  onError,
}: {
  isWebGLUnavailable: boolean;
  isWebglPromptDismissed: boolean;
  effectiveOsActive: boolean;
  isInteractive: boolean;
  promptTitle: string;
  open2dLabel: string;
  cameraControllerRef: React.MutableRefObject<CameraTransitionController | null>;
  onShowPrompt: () => void;
  onEnterOs: () => void;
  onDirectEnterOs: () => void;
  onSceneReady: () => void;
  onError: () => void;
}) {
  if (isWebGLUnavailable) {
    return (
      <WebGLFallbackView
        showControls={isWebglPromptDismissed && !effectiveOsActive}
        promptTitle={promptTitle}
        open2dLabel={open2dLabel}
        onShowPrompt={onShowPrompt}
        onEnter2d={onDirectEnterOs}
      />
    );
  }

  return (
    <WebGLErrorBoundary
      onError={onError}
      fallback={
        <div className="relative flex h-full w-full items-center justify-center bg-[#0a0a0c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a24] via-[#0d0d12] to-[#050508]" />
      }
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        className="absolute inset-0 z-0 h-full w-full"
      >
        <Suspense fallback={null}>
          <Scene
            onReady={onSceneReady}
            onEnterOs={onEnterOs}
            isInteractive={isInteractive}
            cameraControllerRef={cameraControllerRef}
            initialProgress={effectiveOsActive ? 1 : 0}
          />
        </Suspense>
      </Canvas>
    </WebGLErrorBoundary>
  );
}

function WorkspaceOsLayer({
  effectiveOsActive,
  osOpacity,
  isOsBooted,
  messages,
  locale,
  dir,
  onToggleLanguage,
  onShutdown,
  onExitPortfolio,
}: {
  effectiveOsActive: boolean;
  osOpacity: number;
  isOsBooted: boolean;
  messages?: AbstractIntlMessages;
  locale: string;
  dir: string;
  onToggleLanguage: () => void;
  onShutdown: () => void;
  onExitPortfolio: () => void;
}) {
  if (!effectiveOsActive) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black transition-opacity duration-250"
      style={{
        opacity: osOpacity,
        pointerEvents: osOpacity > 0 ? "auto" : "none",
      }}
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <main
          className="relative h-full w-full overflow-hidden bg-[#008080]"
          dir={dir}
        >
          {!isOsBooted ? (
            <OsLoader />
          ) : (
            <Suspense fallback={<OsLoader />}>
              <Os
                onToggleLanguage={onToggleLanguage}
                onShutdown={onShutdown}
                onExitPortfolio={onExitPortfolio}
              />
            </Suspense>
          )}
        </main>
      </NextIntlClientProvider>
    </div>
  );
}

function zoomCameraToScreen(
  controller: CameraTransitionController | null,
  onComplete: () => void,
  onProgress: (progress: number) => void,
): void {
  if (controller) {
    controller.zoomToScreen(onComplete, onProgress);
  } else {
    onComplete();
  }
}

// fallow-ignore-next-line complexity
export default function WorkspaceSpline() {
  const isSessionOsActive = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSnapshot,
  );
  const isStoredBooted = useSyncExternalStore(
    subscribeSession,
    getSessionBootedSnapshot,
    getServerSnapshot,
  );

  const [isOsActive, setIsOsActive] = useState<boolean>(false);
  const [isOsBootedState, setIsOsBootedState] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [darkOpacity, setDarkOpacity] = useState(0);
  const [osOpacity, setOsOpacity] = useState(1);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [isWebglPromptDismissed, setIsWebglPromptDismissed] = useState(false);

  const { isSupported: isWebGLSupported } = useWebGLSupport();
  const isWebGLUnavailable = isWebGLSupported === false || hasWebGLError;

  const dir = useTextDirection();
  const locale = useLocale();
  const t = useTranslations("OS");
  const router = useRouter();
  const messages = useMessages();

  const cameraControllerRef = useRef<CameraTransitionController | null>(null);
  const isShuttingDownRef = useRef(false);

  const effectiveOsActive = isSessionOsActive || isOsActive;
  const isOsBooted = isStoredBooted || isOsBootedState;
  const effectiveDarkOpacity = effectiveOsActive && !isTransitioning ? 1 : darkOpacity;

  const isInteractive = !effectiveOsActive && !isTransitioning;

  const handleBootComplete = () => {
    setIsOsBootedState(true);
  };

  useOsBootSequence(effectiveOsActive, isOsBooted, handleBootComplete);
  useOsScrollLock(effectiveOsActive);

  const handleToggleLanguage = () => {
    const { nextLocale, targetPath } = resolveLanguageToggle(locale, effectiveOsActive);
    router.replace(targetPath, { locale: nextLocale, scroll: false });
  };

  const handleEnterOs = () => {
    if (effectiveOsActive || isShuttingDownRef.current || isTransitioning) return;
    setIsTransitioning(true);

    const onZoomComplete = () => {
      setIsOsActive(true);
      setIsTransitioning(false);
      setDarkOpacity(1);
      activateOsSession();
    };

    zoomCameraToScreen(cameraControllerRef.current, onZoomComplete, (progress) => {
      const dark = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));
      setDarkOpacity(dark);
    });
  };

  const handleDirectEnterOs = () => {
    setIsOsActive(true);
    setIsTransitioning(false);
    setDarkOpacity(1);
    activateOsSession();
  };

  const handleExitToPortfolio = () => {
    playFx("close");
    setIsOsActive(false);
    setIsOsBootedState(false);
    clearOsSessionStorage();
    router.push("/");
  };

  const handleShutdown = () => {
    isShuttingDownRef.current = true;
    setIsTransitioning(true);
    setOsOpacity(0);
    clearOsSessionStorage();

    const finishShutdown = () => {
      setIsOsActive(false);
      setIsOsBootedState(false);
      setIsTransitioning(false);
      setOsOpacity(1);
      setDarkOpacity(0);
      isShuttingDownRef.current = false;
      setIsWebglPromptDismissed(false);
    };

    if (cameraControllerRef.current) {
      cameraControllerRef.current.zoomToWorkspace(finishShutdown, (progress) => {
        const dark = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));
        setDarkOpacity(dark);
      });
    } else {
      finishShutdown();
    }
  };

  return (
    <div className="sticky top-0 h-dvh" dir="ltr">
      {!effectiveOsActive && (
        <WorkspaceBackButton
          dir={dir}
          label={t("workspace.backToPortfolio")}
          onExit={handleExitToPortfolio}
        />
      )}

      <Workspace3DScene
        isWebGLUnavailable={isWebGLUnavailable}
        isWebglPromptDismissed={isWebglPromptDismissed}
        effectiveOsActive={effectiveOsActive}
        isInteractive={isInteractive}
        promptTitle={t("webglPrompt.title")}
        open2dLabel={t("webglPrompt.open2dMode")}
        cameraControllerRef={cameraControllerRef}
        onShowPrompt={() => setIsWebglPromptDismissed(false)}
        onEnterOs={handleEnterOs}
        onDirectEnterOs={handleDirectEnterOs}
        onSceneReady={() => setIsSceneReady(true)}
        onError={() => setHasWebGLError(true)}
      />

      {!isWebGLUnavailable && (
        <SplineProgressIndicator isSceneReady={isSceneReady} dir={dir} />
      )}
      <RotatePrompt />
      {isWebGLUnavailable && !isWebglPromptDismissed && !effectiveOsActive && (
        <WebglPrompt
          onLaunch2dMode={handleDirectEnterOs}
          onDismiss={() => setIsWebglPromptDismissed(true)}
        />
      )}

      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-200"
        style={{ opacity: effectiveDarkOpacity }}
        aria-hidden="true"
      />

      <WorkspaceOsLayer
        effectiveOsActive={effectiveOsActive}
        osOpacity={osOpacity}
        isOsBooted={isOsBooted}
        messages={messages}
        locale={locale}
        dir={dir}
        onToggleLanguage={handleToggleLanguage}
        onShutdown={handleShutdown}
        onExitPortfolio={handleExitToPortfolio}
      />
    </div>
  );
}

