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
import { Folder } from "@react95/icons";
import { useTranslations } from "next-intl";
import { playFx } from "@/lib/sound";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface ProjectCardData {
  key: "saas" | "proto" | "awwwards";
  titleKey: string;
  taglineKey: string;
  descKey: string;
  liveUrl?: string;
  githubUrl?: string;
  isPrivate?: boolean;
}

const PROJECTS_DATA: ProjectCardData[] = [
  {
    key: "saas",
    titleKey: "items.saas.title",
    taglineKey: "items.saas.tagline",
    descKey: "items.saas.desc",
    isPrivate: true,
  },
  {
    key: "proto",
    titleKey: "items.proto.title",
    taglineKey: "items.proto.tagline",
    descKey: "items.proto.desc",
    liveUrl: "https://interview-flow-prototype.vercel.app/",
    githubUrl: "https://github.com/AhmedHanye/InterviewFlow-prototype",
  },
  {
    key: "awwwards",
    titleKey: "items.awwwards.title",
    taglineKey: "items.awwwards.tagline",
    descKey: "items.awwwards.desc",
    liveUrl: "https://ahmedhanye.github.io/awwwards/",
    githubUrl: "https://github.com/AhmedHanye/awwwards",
  },
];

export default function ProjectsSection() {
  const t = useTranslations("HomePage.projects");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".projects-window", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(".project-card-item", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
        y: 25,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const handleOpenLink = (url?: string) => {
    if (url) {
      playFx("click");
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handlePrivateClick = () => {
    playFx("error");
    alert(t("privateRepoAlert"));
  };

  return (
    <section
      ref={containerRef}
      id="projects"
      className="w-full max-w-5xl mx-auto px-4 py-6"
      aria-label="Projects Showcase"
    >
      <Window className="projects-window w-full shadow-2xl">
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
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
            <Folder variant="16x16_4" style={{ width: "16px", height: "16px" }} />
            <span>{t("windowTitle")}</span>
          </span>
        </WindowHeader>


        {/* Address Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#dcdcdc] border-b border-[#808080]">
          <span className="text-xs text-neutral-800 font-bold shrink-0">{t("addressLabel")}</span>
          <Frame
            variant="field"
            className="flex-1 px-2 py-1 bg-white text-xs font-mono font-bold text-neutral-800 flex items-center gap-1.5"
          >
            <Folder variant="16x16_4" style={{ width: "14px", height: "14px" }} />
            <span>C:\Projects\</span>
          </Frame>
        </div>

        <WindowContent style={{ padding: "16px" }}>
          <div className="flex flex-col gap-4">
            {/* Header info */}
            <div>
              <span className="text-xs font-bold text-[#000080] bg-blue-100 px-2 py-0.5 border border-blue-300">
                {t("badge")}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2 mb-1">
                {t("heading")}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 mb-4">
                {t("subheading")}
              </p>
            </div>

            {/* Projects List */}
            <div className="flex flex-col gap-6">
              {PROJECTS_DATA.map((proj) => (
                <GroupBox
                  key={proj.key}
                  className="project-card-item"
                  label={`📁 ${t(proj.titleKey)}`}
                  style={{ backgroundColor: "#fbfbfb" }}
                >
                  <div className="p-2 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs sm:text-sm font-bold text-[#000080]">
                        {t(proj.taglineKey)}
                      </span>
                      {proj.isPrivate && (
                        <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5">
                          🔒 {t("privateOrg")}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-base text-neutral-800 leading-relaxed m-0">
                      {t(proj.descKey)}
                    </p>

                    <Separator style={{ margin: "8px 0" }} />

                    {/* Card Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                      {proj.liveUrl && (
                        <Button
                          primary
                          onClick={() => handleOpenLink(proj.liveUrl)}
                          style={{ fontWeight: "bold", fontSize: "11px" }}
                        >
                          🚀 {t("launchLive")}
                        </Button>
                      )}

                      {proj.githubUrl && (
                        <Button
                          onClick={() => handleOpenLink(proj.githubUrl)}
                          style={{ fontWeight: "bold", fontSize: "11px" }}
                        >
                          💻 {t("viewCode")}
                        </Button>
                      )}

                      {proj.isPrivate && (
                        <Button
                          onClick={handlePrivateClick}
                          style={{ fontSize: "11px", color: "#333" }}
                        >
                          🔒 {t("privateOrg")}
                        </Button>
                      )}
                    </div>
                  </div>
                </GroupBox>
              ))}
            </div>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
