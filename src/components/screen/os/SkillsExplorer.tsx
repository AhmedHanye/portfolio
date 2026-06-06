"use client";

import React from "react";
import { ScrollView, GroupBox, Frame } from "react95";
import { useTranslations } from "next-intl";

export default function SkillsExplorer() {
  const t = useTranslations("OS");

  const renderInterest = (key: "interestOffline" | "interestFsd" | "interestHeadless" | "interestTooling" | "interestTesting") => {
    const text = t(`skills.${key}`);
    const colonIndex = text.indexOf(":");
    if (colonIndex === -1) return <li>{text}</li>;
    const title = text.slice(0, colonIndex);
    const desc = text.slice(colonIndex + 1);
    return (
      <li>
        <strong>{title}:</strong>{desc}
      </li>
    );
  };

  return (
    <ScrollView
      style={{
        background: "#fff",
        height: "100%",
      }}
    >
      <div
        style={{
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {t("skills.title")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {/* Languages Group */}
          <GroupBox label={`💻 ${t("skills.languages")}`}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "5px 0" }}>
              {["TypeScript", "JavaScript", "Python", "SQL", "HTML & CSS"].map((skill) => (
                <Frame
                  key={skill}
                  variant="well"
                  style={{ padding: "4px 8px", fontSize: "11px", background: "#f0f0f0" }}
                >
                  {skill}
                </Frame>
              ))}
            </div>
          </GroupBox>

          {/* Frameworks & Libraries Group */}
          <GroupBox label={`📦 ${t("skills.frameworks")}`}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "5px 0" }}>
              {[
                "Next.js 16+",
                "React 19",
                "Django 6.0+",
                "Django Ninja",
                "Celery",
                "PowerSync",
                "Tailwind CSS v4",
                "Fumadocs",
                "shadcn/ui",
                "@base-ui/react",
                "TanStack Query v5",
                "TanStack Form",
                "Zod v4",
                "next-intl",
              ].map((skill) => (
                <Frame
                  key={skill}
                  variant="well"
                  style={{ padding: "4px 8px", fontSize: "11px", background: "#f0f0f0" }}
                >
                  {skill}
                </Frame>
              ))}
            </div>
          </GroupBox>

          {/* Tools & Databases Group */}
          <GroupBox label={`🛠 ${t("skills.tools")}`}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "5px 0" }}>
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
                "Ruff",
                "ESLint / Prettier",
                "Husky",
                "Steiger (FSD)",
              ].map((skill) => (
                <Frame
                  key={skill}
                  variant="well"
                  style={{ padding: "4px 8px", fontSize: "11px", background: "#f0f0f0" }}
                >
                  {skill}
                </Frame>
              ))}
            </div>
          </GroupBox>

          {/* Areas of Interest Group */}
          <GroupBox label={`🎯 ${t("skills.interests")}`}>
            <ul style={{ margin: "5px 0 5px 20px", padding: 0, fontSize: "12px", lineHeight: "1.5" }}>
              {renderInterest("interestOffline")}
              {renderInterest("interestFsd")}
              {renderInterest("interestHeadless")}
              {renderInterest("interestTooling")}
              {renderInterest("interestTesting")}
            </ul>
          </GroupBox>
        </div>
      </div>
    </ScrollView>
  );
}
