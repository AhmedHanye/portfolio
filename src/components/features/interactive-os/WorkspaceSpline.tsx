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
import { useLocale, useTranslations, NextIntlClientProvider, useMessages } from "next-intl";
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

  const [isSceneReady, setIsSceneReady] = useState(false);
  const [darkOpacity, setDarkOpacity] = useState(0);
  const [isOsActive, setIsOsActive] = useState(false);
  const [isOsBootedState, setIsOsBootedState] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [osOpacity, setOsOpacity] = useState(1);
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [isWebglPromptDismissed, setIsWebglPromptDismissed] = useState(false);
  const isShuttingDownRef = useRef(false);
  const cameraControllerRef = useRef<CameraTransitionController | null>(null);

  const isOsBooted = isStoredBooted || isOsBootedState;
  const effectiveOsActive = isOsActive || isSessionOsActive;
  const effectiveDarkOpacity = effectiveOsActive && !isTransitioning ? 1 : darkOpacity;

  const { isSupported: isWebGLSupported } = useWebGLSupport();
  const isWebGLUnavailable = isWebGLSupported === false || hasWebGLError;

  const messages = useMessages();
  const locale = useLocale();
  const t = useTranslations("OS");
  const dir = useTextDirection();
  const router = useRouter();

  const isInteractive = !effectiveOsActive && !isTransitioning;

  // Handle Windows 95 boot loading sequence & play startup sound once after loading completes
  useEffect(() => {
    if (effectiveOsActive && !isOsBooted) {
      const bootTimer = setTimeout(() => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("win95_booted", "true");
        }
        setIsOsBootedState(true);
        playFx("startup");
      }, 1800);
      return () => clearTimeout(bootTimer);
    }
  }, [effectiveOsActive, isOsBooted]);

  // Lock body & root scroll when full page OS is active so mouse scrolling remains inside OS windows
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

  const handleToggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    if (typeof window !== "undefined" && effectiveOsActive) {
      sessionStorage.setItem("win95_active", "true");
    }
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname.replace(/^\/(en|ar)/, "") || "/"
        : "/";
    const targetPath = effectiveOsActive ? `${currentPath}?os=true` : currentPath;
    router.replace(targetPath, { locale: nextLocale, scroll: false });
  };

  const handleEnterOs = () => {
    if (effectiveOsActive || isShuttingDownRef.current || isTransitioning) return;
    setIsTransitioning(true);

    if (cameraControllerRef.current) {
      cameraControllerRef.current.zoomToScreen(
        () => {
          setIsOsActive(true);
          setIsTransitioning(false);
          setDarkOpacity(1);
          activateOsSession();
        },
        (progress) => {
          const dark = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));
          setDarkOpacity(dark);
        },
      );
    } else {
      setIsOsActive(true);
      setIsTransitioning(false);
      setDarkOpacity(1);
      activateOsSession();
    }
  };

  const handleDirectEnterOs = () => {
    setIsOsActive(true);
    setIsTransitioning(false);
    setDarkOpacity(1);
    setIsWebglPromptDismissed(false);
    activateOsSession();
  };

  const handleExitToPortfolio = () => {
    playFx("close");
    setIsOsActive(false);
    setIsOsBootedState(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("win95_active");
      sessionStorage.removeItem("win95_booted");
      sessionStorage.removeItem("win95_windows");
      sessionStorage.removeItem("win95_active_tab");
      const url = new URL(window.location.href);
      url.searchParams.delete("os");
      window.history.replaceState(null, "", url.pathname + (url.search ? url.search : ""));
    }
    router.push("/");
  };

  const handleShutdown = () => {
    isShuttingDownRef.current = true;
    setIsTransitioning(true);
    setOsOpacity(0);

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("win95_active");
      sessionStorage.removeItem("win95_booted");
      sessionStorage.removeItem("win95_windows");
      sessionStorage.removeItem("win95_active_tab");
      const url = new URL(window.location.href);
      url.searchParams.delete("os");
      window.history.replaceState(null, "", url.pathname + (url.search ? url.search : ""));
    }

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
      cameraControllerRef.current.zoomToWorkspace(
        finishShutdown,
        (progress) => {
          const dark = Math.min(1, Math.max(0, (progress - 0.75) / 0.15));
          setDarkOpacity(dark);
        },
      );
    } else {
      finishShutdown();
    }
  };

  return (
    <div className="sticky top-0 h-dvh" dir="ltr">
      {/* Floating 3D Workspace Navigation Bar */}
      {!effectiveOsActive && (
        <div
          className="fixed top-4 z-30 flex items-center gap-2 px-4"
          style={{
            left: dir === "rtl" ? "auto" : "16px",
            right: dir === "rtl" ? "16px" : "auto",
          }}
        >
          <button
            type="button"
            onClick={handleExitToPortfolio}
            title={t("workspace.backToPortfolio")}
            className="flex cursor-pointer items-center gap-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-3.5 py-1.5 font-bold text-xs text-black shadow-[2px_2px_0px_#000000] hover:bg-[#d4d4d4] active:border-t-[#404040] active:border-l-[#404040] active:border-r-[#ffffff] active:border-b-[#ffffff]"
          >
            <span>{dir === "rtl" ? "➜" : "⬅"}</span>
            <span>{t("workspace.backToPortfolio")}</span>
          </button>
        </div>
      )}

      {isWebGLUnavailable ? (
        <div className="relative flex h-full w-full items-center justify-center bg-[#0a0a0c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a24] via-[#0d0d12] to-[#050508]">
          {isWebglPromptDismissed && !effectiveOsActive && (
            <div className="z-30 flex flex-col items-center gap-3 p-4">
              <button
                type="button"
                onClick={() => setIsWebglPromptDismissed(false)}
                className="flex cursor-pointer items-center gap-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#c0c0c0] px-4 py-2 font-bold text-xs text-black shadow-[2px_2px_0px_#000000] hover:bg-[#d4d4d4] active:border-t-[#404040] active:border-l-[#404040] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              >
                <span>⚠️</span>
                <span>{t("webglPrompt.title")}</span>
              </button>
              <button
                type="button"
                onClick={handleDirectEnterOs}
                className="flex cursor-pointer items-center gap-2 border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] bg-[#000080] px-4 py-2 font-bold text-xs text-white shadow-[2px_2px_0px_#000000] hover:bg-[#1084d0] active:border-t-[#404040] active:border-l-[#404040] active:border-r-[#ffffff] active:border-b-[#ffffff]"
              >
                <span>💻</span>
                <span>{t("webglPrompt.open2dMode")}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <WebGLErrorBoundary
          onError={() => setHasWebGLError(true)}
          fallback={
            <div className="relative flex h-full w-full items-center justify-center bg-[#0a0a0c] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a24] via-[#0d0d12] to-[#050508]" />
          }
        >
          <Canvas shadows>
            <Suspense>
              <Scene
                onReady={() => setIsSceneReady(true)}
                onEnterOs={handleEnterOs}
                isInteractive={isInteractive}
                cameraControllerRef={cameraControllerRef}
                initialProgress={effectiveOsActive ? 1 : 0}
              />
            </Suspense>
          </Canvas>
        </WebGLErrorBoundary>
      )}

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

      {/* Dark overlay screen transition during scroll-in / scroll-out */}
      <div
        className="pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-200"
        style={{ opacity: effectiveDarkOpacity }}
        aria-hidden="true"
      />

      {/* Full Page 2D Windows 95 OS Overlay */}
      <div
        className="fixed inset-0 z-50 overflow-hidden bg-black transition-opacity duration-250"
        style={{
          opacity: effectiveOsActive ? osOpacity : 0,
          pointerEvents: effectiveOsActive && osOpacity > 0 ? "auto" : "none",
        }}
      >
        {effectiveOsActive && (
          <NextIntlClientProvider messages={messages} locale={locale}>
            <main className="h-full w-full" dir={dir}>
              {!isOsBooted ? (
                <OsLoader />
              ) : (
                <Suspense fallback={<OsLoader />}>
                  <Os
                    onToggleLanguage={handleToggleLanguage}
                    onShutdown={handleShutdown}
                    onExitPortfolio={handleExitToPortfolio}
                  />
                </Suspense>
              )}
            </main>
          </NextIntlClientProvider>
        )}
      </div>
    </div>
  );
}

