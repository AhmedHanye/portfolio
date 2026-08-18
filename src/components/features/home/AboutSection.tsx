"use client";

import React, { useRef } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Frame,
  GroupBox,
  Separator,
} from "react95";
import { Wordpad, Printer } from "@react95/icons";
import { useTranslations } from "next-intl";
import { playFx } from "@/lib/sound";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface AboutSectionProps {
  onOpenResume?: () => void;
}

export default function AboutSection({ onOpenResume }: AboutSectionProps) {
  const t = useTranslations("HomePage.about");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-window", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const handleOpenLink = (url: string) => {
    playFx("click");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEmailClick = () => {
    playFx("click");
    window.location.href = "mailto:ahmedhanyehossny@gmail.com";
  };

  return (
    <section
      ref={containerRef}
      id="about"
      className="w-full max-w-5xl mx-auto px-4 py-8"
      aria-label="About Ahmed Hanye"
    >
      <Window className="about-window w-full shadow-2xl">
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
            <Wordpad variant="16x16_4" style={{ width: "16px", height: "16px" }} />
            <span>{t("windowTitle")}</span>
          </span>
        </WindowHeader>


        <WindowContent style={{ padding: "16px" }}>
          <div className="flex flex-col gap-6">
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#000080] bg-blue-100 px-2 py-0.5 border border-blue-300">
                {t("badge")}
              </span>
            </div>

            {/* Notepad Content Area */}
            <Frame
              variant="field"
              style={{
                backgroundColor: "#ffffff",
                padding: "16px",
                fontFamily: "ms_sans_serif, monospace, sans-serif",
              }}
            >
              <h2 className="text-xl font-bold text-neutral-900 mb-3">
                {t("heading")}
              </h2>

              <p className="text-sm sm:text-base text-neutral-800 leading-relaxed mb-3">
                {t("bio1")}
              </p>

              <p className="text-sm sm:text-base text-neutral-800 leading-relaxed mb-4">
                {t("bio2")}
              </p>

              <Separator style={{ margin: "14px 0" }} />

              {/* Education & Core Focus Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Academic Credentials */}
                <GroupBox label={`🎓 ${t("educationTitle")}`}>
                  <div className="space-y-1.5 text-xs sm:text-sm text-neutral-800 p-1">
                    <p className="font-bold text-neutral-900 m-0">
                      {t("university")}
                    </p>
                    <p className="text-indigo-900 font-semibold m-0">
                      {t("major")}
                    </p>
                    <p className="text-neutral-700 m-0">
                      {t("graduated")}
                    </p>
                    <p className="text-neutral-700 m-0">
                      {t("location")}
                    </p>
                  </div>
                </GroupBox>

                {/* Core Focus Areas */}
                <GroupBox label={`🚀 ${t("careerTitle")}`}>
                  <div className="space-y-2 text-xs sm:text-sm text-neutral-800 p-1">
                    <div className="flex items-start gap-1.5">
                      <span>⚡</span>
                      <span>{t("focusItem1")}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span>📐</span>
                      <span>{t("focusItem2")}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span>🔒</span>
                      <span>{t("focusItem3")}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span>🛠</span>
                      <span>{t("focusItem4")}</span>
                    </div>
                  </div>
                </GroupBox>
              </div>

              <Separator style={{ margin: "14px 0" }} />

              {/* Bottom Quick Links */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {onOpenResume && (
                  <Button
                    primary
                    onClick={() => {
                      playFx("click");
                      onOpenResume();
                    }}
                    style={{ fontWeight: "bold", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Printer variant="16x16_4" style={{ width: "16px", height: "16px" }} />
                    <span>{t("btnViewResume")}</span>
                  </Button>
                )}
                <Button
                  onClick={() => handleOpenLink("https://github.com/AhmedHanye")}
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  GitHub Profile
                </Button>
                <Button
                  onClick={() => handleOpenLink("https://www.linkedin.com/in/ahmed-hanye/")}
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  LinkedIn Profile
                </Button>
                <Button
                  onClick={handleEmailClick}
                  style={{ fontWeight: "bold", fontSize: "12px" }}
                >
                  Email Ahmed
                </Button>
              </div>
            </Frame>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
