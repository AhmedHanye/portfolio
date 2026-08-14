"use client";

import React from "react";
import {
  WindowContent,
  ScrollView,
  GroupBox,
  Frame,
} from "react95";
import { useTranslations } from "next-intl";
import { Progman11 } from "@react95/icons";
import WindowFrame from "./WindowFrame";

interface SkillsExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
}

export default function SkillsExplorer({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
}: SkillsExplorerProps) {
  const t = useTranslations("OS");

  if (!isOpen) return null;

  const interests = [
    { key: "interestOffline" as const, icon: "💾" },
    { key: "interestFsd" as const, icon: "📐" },
    { key: "interestHeadless" as const, icon: "⚡" },
    { key: "interestTooling" as const, icon: "🚀" },
    { key: "interestTesting" as const, icon: "🧪" },
  ];

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<Progman11 variant="32x32_4" style={{ width: "16px", height: "16px" }} />}
      title={t("skills.title")}
      initialX={140}
      initialY={40}
      defaultWidth={640}
      defaultHeight={500}
      allowMaximize
    >
      <WindowContent
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          padding: "6px",
        }}
      >
        <ScrollView
          style={{
            background: "#fff",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {/* Languages Group */}
            <GroupBox label={`💻 ${t("skills.languages")}`}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "4px 0" }}>
                {["TypeScript", "JavaScript", "Python", "SQL", "HTML5 & CSS3"].map((skill) => (
                  <Frame
                    key={skill}
                    variant="well"
                    style={{ padding: "3px 8px", fontSize: "11px", background: "#f0f0f0" }}
                  >
                    {skill}
                  </Frame>
                ))}
              </div>
            </GroupBox>

            {/* Frameworks & Libraries Group */}
            <GroupBox label={`📦 ${t("skills.frameworks")}`}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "4px 0" }}>
                {[
                  "Next.js 16+",
                  "React 19",
                  "Django 6.0+",
                  "Django Ninja",
                  "Celery",
                  "PowerSync",
                  "TanStack DB",
                  "Tailwind CSS v4",
                  "Fumadocs",
                  "shadcn/ui",
                  "@base-ui/react",
                  "TanStack Query v5",
                  "TanStack Form",
                  "Zod v4",
                  "next-intl",
                  "Three.js / R3F",
                  "GSAP",
                ].map((skill) => (
                  <Frame
                    key={skill}
                    variant="well"
                    style={{ padding: "3px 8px", fontSize: "11px", background: "#f0f0f0" }}
                  >
                    {skill}
                  </Frame>
                ))}
              </div>
            </GroupBox>

            {/* Tools & Databases Group */}
            <GroupBox label={`🛠 ${t("skills.tools")}`}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "4px 0" }}>
                {[
                  "Bun",
                  "uv",
                  "PostgreSQL 18",
                  "SQLite (wa-sqlite)",
                  "Redis",
                  "Docker & Docker Compose",
                  "Storybook 10",
                  "Playwright",
                  "Vitest",
                  "React Doctor",
                  "Fallow",
                  "Ruff",
                  "ESLint / Prettier",
                  "Husky",
                  "Steiger (FSD)",
                ].map((skill) => (
                  <Frame
                    key={skill}
                    variant="well"
                    style={{ padding: "3px 8px", fontSize: "11px", background: "#f0f0f0" }}
                  >
                    {skill}
                  </Frame>
                ))}
              </div>
            </GroupBox>

            {/* Areas of Interest Group */}
            <GroupBox label={`🎯 ${t("skills.interests")}`}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "2px 0" }}>
                {interests.map(({ key, icon }) => {
                  const text = t(`skills.${key}`);
                  const colonIndex = text.indexOf(":");
                  const title = colonIndex !== -1 ? text.slice(0, colonIndex).trim() : text;
                  const desc = colonIndex !== -1 ? text.slice(colonIndex + 1).trim() : "";

                  return (
                    <Frame
                      key={key}
                      variant="well"
                      style={{
                        padding: "6px 8px",
                        fontSize: "11px",
                        background: "#f7f7f7",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: "bold",
                          color: "#000080",
                        }}
                      >
                        <span style={{ fontSize: "12px", lineHeight: 1 }}>{icon}</span>
                        <span>{title}</span>
                      </div>
                      {desc && (
                        <div
                          style={{
                            color: "#333",
                            lineHeight: "1.4",
                            paddingInlineStart: "20px",
                          }}
                        >
                          {desc}
                        </div>
                      )}
                    </Frame>
                  );
                })}
              </div>
            </GroupBox>
          </div>
        </ScrollView>
      </WindowContent>
    </WindowFrame>
  );
}
