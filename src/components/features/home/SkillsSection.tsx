"use client";

import React, { useRef } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Frame,
  GroupBox,
} from "react95";
import { Progman11 } from "@react95/icons";
import { useTranslations } from "next-intl";
import { playFx } from "@/lib/sound";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

import {
  LANGUAGES_SKILLS,
  FRAMEWORKS_SKILLS,
  TOOLS_AND_DBS_SKILLS,
  type SkillItem,
} from "@/lib/constants/skills";

const SPECIALTIES = [
  {
    icon: "💾",
    titleKey: "specialtyOfflineTitle" as const,
    descKey: "specialtyOfflineDesc" as const,
  },
  {
    icon: "📐",
    titleKey: "specialtyFsdTitle" as const,
    descKey: "specialtyFsdDesc" as const,
  },
  {
    icon: "⚡",
    titleKey: "specialtyHeadlessTitle" as const,
    descKey: "specialtyHeadlessDesc" as const,
  },
  {
    icon: "🚀",
    titleKey: "specialtyToolingTitle" as const,
    descKey: "specialtyToolingDesc" as const,
  },
  {
    icon: "🧪",
    titleKey: "specialtyTestingTitle" as const,
    descKey: "specialtyTestingDesc" as const,
  },
];

function SkillBadge({ skill }: { skill: SkillItem }) {
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Visit official ${skill.name} website`}
      aria-label={`Official website for ${skill.name}`}
      onClick={() => playFx("click")}
      onMouseEnter={() => playFx("click")}
      className="inline-block no-underline text-inherit focus:outline-hidden focus:ring-1 focus:ring-blue-800"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Frame
        variant="well"
        style={{
          padding: "4px 10px",
          fontSize: "11px",
          fontWeight: "bold",
          backgroundColor: "#f0f0f0",
          cursor: "pointer",
          transition: "background 0.15s ease",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        }}
        className="hover:bg-neutral-200 active:bg-neutral-300"
      >
        <bdi dir="ltr">{skill.name}</bdi>
      </Frame>
    </a>
  );
}

export default function SkillsSection() {
  const t = useTranslations("HomePage.skillsSection");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".skills-window", {
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

  return (
    <section
      ref={containerRef}
      id="skills"
      className="w-full max-w-5xl mx-auto px-4 py-8"
      aria-label="Technical Skills and Stack"
    >
      <Window className="skills-window w-full shadow-2xl border-2 border-neutral-700">
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
            <Progman11 variant="32x32_4" style={{ width: "16px", height: "16px" }} />
            <span>{t("windowTitle")}</span>
          </span>
        </WindowHeader>

        <WindowContent style={{ padding: "16px" }}>
          <div className="flex flex-col gap-6">
            {/* Section Introduction */}
            <div>
              <span className="text-xs font-bold text-[#000080] bg-blue-100 px-2 py-0.5 border border-blue-300">
                {t("badge")}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2 mb-1">
                {t("heading")}
              </h2>
            </div>

            {/* Languages Group */}
            <GroupBox label={`💻 ${t("languages")}`} style={{ backgroundColor: "#fafafa" }}>
              <div className="flex flex-wrap gap-2 p-1">
                {LANGUAGES_SKILLS.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </GroupBox>

            {/* Frameworks & Libraries */}
            <GroupBox label={`📦 ${t("frameworks")}`} style={{ backgroundColor: "#fafafa" }}>
              <div className="flex flex-wrap gap-2 p-1">
                {FRAMEWORKS_SKILLS.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </GroupBox>

            {/* Tools & Databases */}
            <GroupBox label={`🛠 ${t("tools")}`} style={{ backgroundColor: "#fafafa" }}>
              <div className="flex flex-wrap gap-2 p-1">
                {TOOLS_AND_DBS_SKILLS.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </GroupBox>

            {/* Key Specialties */}
            <GroupBox label={`🎯 ${t("specialties")}`} style={{ backgroundColor: "#fafafa" }}>
              <div className="space-y-2.5 p-1">
                {SPECIALTIES.map((spec) => (
                  <Frame
                    key={spec.titleKey}
                    variant="well"
                    style={{
                      padding: "8px 12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#000080] mb-1">
                      <span>{spec.icon}</span>
                      <span>{t(spec.titleKey)}</span>
                    </div>
                    <p className="text-xs text-neutral-700 leading-relaxed m-0 ps-6">
                      {t(spec.descKey)}
                    </p>
                  </Frame>
                ))}
              </div>
            </GroupBox>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
