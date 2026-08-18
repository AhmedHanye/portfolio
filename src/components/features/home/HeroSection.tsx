"use client";

import React, { useRef } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Frame,
  Separator,
} from "react95";
import { Computer } from "@react95/icons";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function HeroSection() {
  const t = useTranslations("HomePage.hero");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-window", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        scale: 0.98,
      })
        .from(
          ".hero-title",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          "-=0.4"
        )
        .from(
          ".hero-badge",
          {
            scale: 0.8,
            opacity: 0,
            stagger: 0.08,
            duration: 0.4,
          },
          "-=0.3"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="w-full max-w-5xl mx-auto px-4 pt-6 pb-6"
      aria-label="Hero Introduction"
    >
      <Window className="hero-window w-full shadow-2xl">
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
            padding: "3px 6px",
            userSelect: "none",
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
            <span>Welcome.exe</span>
          </span>
        </WindowHeader>

        <WindowContent style={{ padding: "16px 20px" }}>
          {/* Top Retro System Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <Frame
              variant="well"
              className="hero-badge"
              style={{
                padding: "3px 10px",
                fontSize: "11px",
                fontWeight: "bold",
                color: "#000080",
                backgroundColor: "#e8e8e8",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("systemBadge")}</span>
            </Frame>

            <Frame
              variant="well"
              className="hero-badge"
              style={{
                padding: "3px 10px",
                fontSize: "11px",
                color: "#222",
                backgroundColor: "#f5f5f5",
              }}
            >
              <span>{t("status")}</span>
            </Frame>
          </div>

          {/* Name and Title */}
          <div className="mb-4">
            <h1
              className="hero-title text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-2"
              style={{ fontFamily: "ms_sans_serif, sans-serif" }}
            >
              {t("name")}
            </h1>
            <p
              className="hero-title text-lg sm:text-xl font-bold text-[#000080]"
              style={{ fontFamily: "ms_sans_serif, sans-serif" }}
            >
              {t("role")}
            </p>
          </div>

          {/* Bio Frame */}
          <Frame
            variant="field"
            style={{
              padding: "14px 16px",
              backgroundColor: "#ffffff",
              marginBottom: "4px",
            }}
          >
            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed m-0 mb-3">
              {t("bioSummary")}
            </p>

            <Separator style={{ margin: "10px 0" }} />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-neutral-600">
              <span className="font-semibold text-neutral-800 flex items-center gap-1">
                🎓 {t("educationBadge")}
              </span>
              <span className="text-neutral-500">📅 {t("gradDate")}</span>
              <span className="text-neutral-500">📍 {t("location")}</span>
            </div>
          </Frame>
        </WindowContent>
      </Window>
    </section>
  );
}
