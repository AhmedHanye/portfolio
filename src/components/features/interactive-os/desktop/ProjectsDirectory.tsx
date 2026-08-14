"use client";

import React from "react";
import {
  WindowContent,
  Button,
  ScrollView,
  GroupBox,
  Separator,
  Frame,
} from "react95";
import { useTranslations } from "next-intl";
import { Folder } from "@react95/icons";
import WindowFrame from "./WindowFrame";

interface ProjectItemProps {
  title: string;
  description: string;
  technologies?: string[];
  websiteUrl?: string;
  githubUrl?: string;
  isPrivate?: boolean;
}

function openExternalLink(url?: string): void {
  if (url && (url.startsWith("https://") || url.startsWith("http://"))) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function ProjectTechBadgeList({ technologies }: { technologies?: string[] }) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", margin: "2px 0" }}>
      {technologies.map((tech) => (
        <Frame
          key={tech}
          variant="well"
          style={{
            padding: "2px 6px",
            fontSize: "10px",
            fontWeight: "bold",
            background: "#ececec",
            fontFamily: "ms_sans_serif, sans-serif",
          }}
        >
          {tech}
        </Frame>
      ))}
    </div>
  );
}

function ProjectActions({
  websiteUrl,
  isPrivate,
  launchAppLabel,
  privateRepoLabel,
  sourceCodeLabel,
  onSourceCodeClick,
}: {
  websiteUrl?: string;
  isPrivate?: boolean;
  launchAppLabel: string;
  privateRepoLabel: string;
  sourceCodeLabel: string;
  onSourceCodeClick: () => void;
}) {
  const codeLabel = isPrivate ? `🔒 ${privateRepoLabel}` : sourceCodeLabel;

  return (
    <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", alignItems: "center" }}>
      {websiteUrl && (
        <Button onClick={() => openExternalLink(websiteUrl)}>
          {launchAppLabel}
        </Button>
      )}
      <Button onClick={onSourceCodeClick}>
        {codeLabel}
      </Button>
    </div>
  );
}

function ProjectCard({
  title,
  description,
  technologies,
  websiteUrl,
  githubUrl,
  isPrivate,
}: ProjectItemProps) {
  const t = useTranslations("OS");

  const handleSourceCodeClick = () => {
    if (isPrivate) {
      alert(t("projects.privateRepoAlert"));
      return;
    }
    openExternalLink(githubUrl);
  };

  return (
    <GroupBox label={`📁 ${title}`} style={{ marginBottom: "12px", background: "#f8f8f8" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "4px 0" }}>
        <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.4", color: "#111" }}>
          {description}
        </p>

        <ProjectTechBadgeList technologies={technologies} />
        <Separator />
        <ProjectActions
          websiteUrl={websiteUrl}
          isPrivate={isPrivate}
          launchAppLabel={t("projects.launchApp")}
          privateRepoLabel={t("projects.privateRepo")}
          sourceCodeLabel={t("projects.sourceCode")}
          onSourceCodeClick={handleSourceCodeClick}
        />
      </div>
    </GroupBox>
  );
}

interface ProjectsDirectoryProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
}

export default function ProjectsDirectory({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
}: ProjectsDirectoryProps) {
  const t = useTranslations("OS");

  if (!isOpen) return null;

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<Folder variant="16x16_4" style={{ width: "16px", height: "16px" }} />}
      title={t("projects.title")}
      initialX={110}
      initialY={50}
      defaultWidth={680}
      defaultHeight={520}
      allowMaximize
    >
      {/* Path Address Bar */}
      <div
        style={{
          padding: "2px 6px 4px 6px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            color: "#444",
            flexShrink: 0,
          }}
        >
          {t("systemWindow.address")}
        </span>
        <Frame
          variant="field"
          style={{
            flex: 1,
            padding: "2px 6px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#fff",
            height: "22px",
          }}
        >
          <Folder variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", fontWeight: "bold", fontFamily: "ms_sans_serif, sans-serif" }}>
            {t("projects.title")}
          </span>
        </Frame>
      </div>

      <Separator style={{ margin: 0 }} />

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
              gap: "8px",
            }}
          >
            {/* InterviewFlow SaaS (Production) */}
            <ProjectCard
              title={t("projects.interviewFlowSaas.title")}
              description={t("projects.interviewFlowSaas.desc")}
              isPrivate
            />

            {/* InterviewFlow Prototype (Graduation Project) */}
            <ProjectCard
              title={t("projects.interviewFlow.title")}
              description={t("projects.interviewFlow.desc")}
              technologies={[
                "React",
                "TypeScript",
                "Vite",
                "Tailwind CSS",
                "shadcn/ui",
                "Supabase",
                "PostgreSQL",
                "Auth",
                "Edge Functions",
                "Realtime",
                "Playwright (E2E)",
                "Vitest (Unit)",
              ]}
              websiteUrl="https://interview-flow-prototype.vercel.app/"
              githubUrl="https://github.com/AhmedHanye/InterviewFlow-prototype"
            />

            {/* awwwards */}
            <ProjectCard
              title={t("projects.awwwards.title")}
              description={t("projects.awwwards.desc")}
              technologies={["React 19", "TypeScript", "Tailwind CSS v4", "GSAP"]}
              websiteUrl="https://ahmedhanye.github.io/awwwards/"
              githubUrl="https://github.com/AhmedHanye/awwwards"
            />
          </div>
        </ScrollView>
      </WindowContent>

      {/* Status Bar */}
      <div style={{ padding: "0 6px 6px 6px", display: "flex", gap: "4px" }}>
        <Frame
          variant="well"
          style={{
            flex: 1,
            padding: "2px 6px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {t("systemWindow.items", { count: 3 })}
        </Frame>
        <Frame
          variant="well"
          style={{
            width: "80px",
            padding: "2px 6px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t("systemWindow.statusReady")}
        </Frame>
      </div>
    </WindowFrame>
  );
}
