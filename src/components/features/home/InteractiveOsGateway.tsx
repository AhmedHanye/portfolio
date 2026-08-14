"use client";

import React, { useRef, useState, useEffect } from "react";
import { Window, WindowHeader, WindowContent, Button, Frame, GroupBox } from "react95";
import { Computer, CdMusic, Progman11, MediaAudio } from "@react95/icons";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const BOOT_LOGS = [
  "[SYS_INIT] Initializing Three.js WebGL 2.0 Renderer...",
  "[SYS_GPU] Compiling custom GLSL CRT shaders & scanline filters...",
  "[SYS_3D] Mounting interactive retro 3D room workstation (Spline)...",
  "[SYS_OS] Starting React95 desktop environment & window manager...",
  "[SYS_AUDIO] Synthesizing Web Audio 8-bit sound fx engine...",
  "[SYS_READY] AHMED_OS is LIVE and waiting for user connection.",
];

export default function InteractiveOsGateway() {
  const t = useTranslations("HomePage.gateway3d");
  const containerRef = useRef<HTMLDivElement>(null);
  const [logIndex, setLogIndex] = useState(1);

  useEffect(() => {
    if (logIndex >= BOOT_LOGS.length) return;
    const timer = setTimeout(() => {
      setLogIndex((prev) => prev + 1);
    }, 450);
    return () => clearTimeout(timer);
  }, [logIndex]);

  useGSAP(
    () => {
      gsap.from(".gateway-window", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // Pulse animation for CTA button
      gsap.to(".gateway-cta-btn", {
        scale: 1.03,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="interactive-os-gateway"
      className="w-full max-w-5xl mx-auto px-4 py-8"
      aria-label="3D Interactive OS Portal"
    >
      <Window className="gateway-window w-full shadow-2xl border-2 border-neutral-700">
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
            color: "#fff",
            padding: "3px 6px",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            <Computer variant="16x16_4" style={{ width: "16px", height: "16px" }} />
            <span>Ahmed_OS 3D Workstation Gateway (WebGL / Three.js)</span>
          </span>
        </WindowHeader>

        <WindowContent style={{ padding: "16px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Column: CRT Terminal Preview */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              <Frame
                variant="field"
                style={{
                  backgroundColor: "#05080c",
                  color: "#33ff33",
                  fontFamily: "monospace, 'Courier New', Courier",
                  padding: "14px",
                  borderRadius: "2px",
                  border: "2px solid #222",
                  boxShadow: "inset 0 0 15px rgba(0, 255, 65, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: "220px",
                }}
              >
                {/* CRT Scanline Overlay Effect */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
                    backgroundSize: "100% 4px",
                  }}
                />

                {/* CRT Header */}
                <div className="flex items-center justify-between text-xs text-cyan-400 border-b border-cyan-900 pb-2 mb-3">
                  <span className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>AHMED_OS_V4_KERNEL [3D_STANDALONE]</span>
                  </span>
                  <span>60 FPS // VSYNC ON</span>
                </div>

                {/* Terminal Boot Lines */}
                <div className="text-xs space-y-1.5 leading-relaxed">
                  {BOOT_LOGS.slice(0, logIndex).map((log, i) => (
                    <div key={log} className="flex items-start gap-2">
                      <span className="text-neutral-500 select-none">&gt;</span>
                      <span
                        className={
                          i === BOOT_LOGS.length - 1
                            ? "text-yellow-300 font-bold"
                            : "text-emerald-400"
                        }
                      >
                        {log}
                      </span>
                    </div>
                  ))}
                  {logIndex >= BOOT_LOGS.length && (
                    <div className="text-cyan-300 animate-pulse mt-2 font-bold flex items-center gap-2">
                      <span>READY_FOR_IMMERSIVE_BOOT</span>
                      <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse" />
                    </div>
                  )}
                </div>
              </Frame>

              {/* Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <Frame variant="well" className="p-1.5 bg-[#f0f0f0]">
                  <div className="flex items-center justify-center gap-1 font-bold text-neutral-800">
                    <Progman11 variant="32x32_4" style={{ width: "14px", height: "14px" }} />
                    <span>{t("featureRoom")}</span>
                  </div>
                </Frame>
                <Frame variant="well" className="p-1.5 bg-[#f0f0f0]">
                  <div className="flex items-center justify-center gap-1 font-bold text-neutral-800">
                    <Computer variant="16x16_4" style={{ width: "14px", height: "14px" }} />
                    <span>{t("featureDraggable")}</span>
                  </div>
                </Frame>
                <Frame variant="well" className="p-1.5 bg-[#f0f0f0]">
                  <div className="flex items-center justify-center gap-1 font-bold text-neutral-800">
                    <CdMusic variant="16x16_4" style={{ width: "14px", height: "14px" }} />
                    <span>{t("featureTerminal")}</span>
                  </div>
                </Frame>
                <Frame variant="well" className="p-1.5 bg-[#f0f0f0]">
                  <div className="flex items-center justify-center gap-1 font-bold text-neutral-800">
                    <MediaAudio variant="16x16_4" style={{ width: "14px", height: "14px" }} />
                    <span>{t("featureAudio")}</span>
                  </div>
                </Frame>
              </div>
            </div>

            {/* Right Column: Description & Launch Button */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <GroupBox label={t("groupOverview")}>
                <div className="space-y-3 p-1">
                  <div className="text-xs font-bold text-[#000080]">
                    {t("badge")}
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 leading-tight">
                    {t("title")}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    {t("description")}
                  </p>
                </div>
              </GroupBox>

              <div className="flex flex-col gap-2">
                <Link
                  href="/interactive-os"
                  prefetch={false}
                  className="gateway-cta-btn block w-full"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    primary
                    size="lg"
                    style={{
                      width: "100%",
                      fontWeight: "bold",
                      fontSize: "14px",
                      padding: "10px 16px",
                      backgroundColor: "#000080",
                      color: "#ffffff",
                      boxShadow: "0 0 14px rgba(0, 0, 128, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{t("btnLaunch")}</span>
                  </Button>
                </Link>
                <div className="text-[11px] text-center text-neutral-700 font-mono">
                  {t("terminalHint")}
                </div>
              </div>
            </div>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
