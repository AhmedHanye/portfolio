"use client";

import React from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Toolbar,
  Tabs,
  Tab,
  TabBody,
} from "react95";
import { useLocale, useTranslations } from "next-intl";
import SystemProperties from "./SystemProperties";
import ProjectsDirectory from "./ProjectsDirectory";
import AboutMe from "./AboutMe";
import SkillsExplorer from "./SkillsExplorer";

interface SystemWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  progress: number;
  systemLogs: string[];
}

export default function SystemWindow({
  isOpen,
  onClose,
  isMinimized,
  activeTab,
  setActiveTab,
  progress,
  systemLogs,
}: SystemWindowProps) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";

  if (!isOpen) return null;

  return (
    <Window
      style={{
        width: "740px",
        height: "580px",
        position: "absolute",
        left: "180px",
        top: "20px",
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <WindowHeader
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontWeight: "bold" }}>ahmed_os.exe</span>
        <Button
          style={{
            marginRight: isRtl ? 0 : -6,
            marginLeft: isRtl ? -6 : 0,
            marginTop: 1,
          }}
          size="sm"
          square
          onClick={onClose}
        >
          <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>
            x
          </span>
        </Button>
      </WindowHeader>

      <Toolbar>
        <Button variant="menu" size="sm" onClick={() => setActiveTab(0)}>
          {t("systemWindow.file")}
        </Button>
        <Button variant="menu" size="sm" onClick={() => setActiveTab(1)}>
          {t("systemWindow.view")}
        </Button>
        <Button
          variant="menu"
          size="sm"
          onClick={() => alert(t("systemWindow.helpAlert"))}
        >
          {t("systemWindow.help")}
        </Button>
      </Toolbar>

      <WindowContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
          <Tab value={0}>Diagnostics.exe</Tab>
          <Tab value={1}>{t("startMenu.aboutMe")}</Tab>
          <Tab value={2}>{t("startMenu.skills") + ".lnk"}</Tab>
          <Tab value={3}>{t("startMenu.projects") + ".lnk"}</Tab>
        </Tabs>

        {/* Tab Contents */}
        <TabBody
          style={{
            height: "390px",
            background: "#ced0d0",
            boxSizing: "border-box",
            flex: 1,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          {activeTab === 0 && (
            <SystemProperties progress={progress} systemLogs={systemLogs} />
          )}
          {activeTab === 1 && <AboutMe />}
          {activeTab === 2 && <SkillsExplorer />}
          {activeTab === 3 && <ProjectsDirectory />}
        </TabBody>

        {/* Blink Prompt */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "5px 0",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#666",
              animation: "blink 1.2s step-start infinite",
            }}
          >
            {t("systemWindow.scrollWarning")}
          </p>
        </div>
      </WindowContent>
    </Window>
  );
}
