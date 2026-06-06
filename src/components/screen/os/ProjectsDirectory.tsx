"use client";

import React from "react";
import { ScrollView, Button, GroupBox, Separator } from "react95";
import { useTranslations } from "next-intl";

interface ProjectItemProps {
  title: string;
  description: string;
  technologies: string[];
  websiteUrl: string;
  githubUrl: string;
}

function ProjectCard({ title, description, technologies, websiteUrl, githubUrl }: ProjectItemProps) {
  const t = useTranslations("OS");

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <GroupBox label={`📁 ${title}`} style={{ marginBottom: "15px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "5px 0" }}>
        <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.4" }}>
          {description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "5px 0" }}>
          {technologies.map((tech) => (
            <span
              key={tech}
              style={{
                background: "#e0e0e0",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        <Separator />

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <Button onClick={() => handleOpenLink(websiteUrl)}>
            {t("projects.launchApp")}
          </Button>
          <Button onClick={() => handleOpenLink(githubUrl)}>
            {t("projects.sourceCode")}
          </Button>
        </div>
      </div>
    </GroupBox>
  );
}

export default function ProjectsDirectory() {
  const t = useTranslations("OS");

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
          gap: "10px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {t("projects.title")}
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* InterviewFlow */}
          <ProjectCard
            title={t("projects.interviewFlow.title")}
            description={t("projects.interviewFlow.desc")}
            technologies={["Next.js", "Django Ninja", "Celery", "PowerSync", "SQLite", "PostgreSQL", "Docker"]}
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
      </div>
    </ScrollView>
  );
}
