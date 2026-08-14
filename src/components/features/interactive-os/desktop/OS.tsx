"use client";

import React, { useState, useEffect } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import original from "react95/dist/themes/original";
import StyledComponentsRegistry from "@/lib/registry";

// @ts-expect-error woff2 file imports need declaration
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
// @ts-expect-error woff2 file imports need declaration
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

import { useTranslations, useLocale } from "next-intl";
import { useWindowManager } from "@/hooks/use-window-manager";
import { useCompactViewport } from "@/hooks/use-compact-viewport";
import { playFx } from "@/lib/sound";

// Import OS components
import DesktopIcons, { type DesktopIconId } from "./DesktopIcons";
import SystemProperties from "./SystemProperties";
import AboutMe from "./AboutMe";
import ProjectsDirectory from "./ProjectsDirectory";
import SkillsExplorer from "./SkillsExplorer";
import CDriveWindow from "./CDriveWindow";
import TaskBar from "./TaskBar";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: 700;
    font-style: normal;
  }
  
  .win95-screen-container {
    font-family: 'ms_sans_serif', sans-serif;
  }

  /* Apply classic Windows 95 cursors globally within the OS container */
  .win95-screen-container,
  .win95-screen-container * {
    cursor: url('/cursors/Arrow.png'), auto;
  }
  
  .win95-screen-container a,
  .win95-screen-container button,
  .win95-screen-container select,
  .win95-screen-container input[type="submit"],
  .win95-screen-container input[type="button"],
  .win95-screen-container input[type="reset"],
  .win95-screen-container [role="button"],
  .win95-screen-container .cursor-pointer,
  .win95-screen-container button *,
  .win95-screen-container .react95-btn,
  .win95-screen-container .react95-btn *,
  .win95-screen-container .react95-tab,
  .win95-screen-container .react95-tab * {
    cursor: url('/cursors/HandPointer.png'), pointer !important;
  }
  
  .win95-screen-container input[type="text"],
  .win95-screen-container input[type="email"],
  .win95-screen-container input[type="password"],
  .win95-screen-container input[type="search"],
  .win95-screen-container input[type="number"],
  .win95-screen-container textarea {
    cursor: url('/cursors/Text.png'), text !important;
  }
  
  /* Fix react95 legend positioning under RTL direction */
  .win95-screen-container[dir="rtl"] legend,
  [dir="rtl"] .win95-screen-container legend {
    left: auto !important;
    right: 8px !important;
  }
`;

interface OsProps {
  onToggleLanguage: () => void;
  onShutdown?: () => void;
  onExitPortfolio?: () => void;
}

export default function Os({ onToggleLanguage, onShutdown, onExitPortfolio }: OsProps) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { isCompact } = useCompactViewport();

  const [time, setTime] = useState("");
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState<DesktopIconId | null>(null);

  // Centralised multi-window manager
  const {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    toggleMinimize,
    focusWindow,
  } = useWindowManager();

  // Update clock time
  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExitPortfolio = () => {
    playFx("close");
    if (onExitPortfolio) {
      onExitPortfolio();
    } else {
      window.location.href = `/${locale}`;
    }
  };

  const handleShutdown = () => {
    if (onShutdown) {
      onShutdown();
    } else {
      alert(t("startMenu.shutdownAlert"));
    }
  };

  const handleDesktopClick = () => {
    setStartMenuOpen(false);
    setSelectedIconId(null);
  };

  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={original}>
        <GlobalStyles />
        <div
          className="win95-screen-container"
          dir={isRtl ? "rtl" : "ltr"}
          role="presentation"
          style={{
            backgroundImage: "url('/windows95_bg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            boxSizing: "border-box",
            padding: isCompact ? "4px 4px 34px 4px" : "12px 12px 40px 12px",
            color: "#000",
            fontSize: "14px",
          }}
          onClick={handleDesktopClick}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setStartMenuOpen(false);
            }
          }}
        >
          {/* Main Desktop Workspace Area */}
          <div
            style={{
              flex: 1,
              position: "relative",
              zIndex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            {/* Desktop Shortcuts */}
            <DesktopIcons
              selectedId={selectedIconId}
              onSelect={setSelectedIconId}
              openWindow={openWindow}
              onExitPortfolio={handleExitPortfolio}
            />

            {/* System Properties Dialog (My Computer) */}
            <SystemProperties
              isOpen={windows.system.isOpen}
              onClose={() => closeWindow("system")}
              isMinimized={windows.system.isMinimized}
              isActive={activeWindowId === "system"}
              onFocus={() => focusWindow("system")}
              zIndex={windows.system.zIndex}
            />

            {/* About Me (about.txt - Notepad) */}
            <AboutMe
              isOpen={windows.about.isOpen}
              onClose={() => closeWindow("about")}
              isMinimized={windows.about.isMinimized}
              isActive={activeWindowId === "about"}
              onFocus={() => focusWindow("about")}
              zIndex={windows.about.zIndex}
            />

            {/* Projects Directory (C:\Projects Explorer) */}
            <ProjectsDirectory
              isOpen={windows.projects.isOpen}
              onClose={() => closeWindow("projects")}
              isMinimized={windows.projects.isMinimized}
              isActive={activeWindowId === "projects"}
              onFocus={() => focusWindow("projects")}
              zIndex={windows.projects.zIndex}
            />

            {/* Skills Explorer */}
            <SkillsExplorer
              isOpen={windows.skills.isOpen}
              onClose={() => closeWindow("skills")}
              isMinimized={windows.skills.isMinimized}
              isActive={activeWindowId === "skills"}
              onFocus={() => focusWindow("skills")}
              zIndex={windows.skills.zIndex}
            />

            {/* Local Disk (C:) */}
            <CDriveWindow
              isOpen={windows.cDrive.isOpen}
              onClose={() => closeWindow("cDrive")}
              isMinimized={windows.cDrive.isMinimized}
              isActive={activeWindowId === "cDrive"}
              onFocus={() => focusWindow("cDrive")}
              zIndex={windows.cDrive.zIndex}
              onOpenProjects={() => openWindow("projects")}
            />
          </div>

          {/* Classic Start Bar / Taskbar */}
          <TaskBar
            startMenuOpen={startMenuOpen}
            setStartMenuOpen={setStartMenuOpen}
            onOpenWindow={openWindow}
            onExitPortfolio={handleExitPortfolio}
            onShutdown={handleShutdown}
            time={time}
            windows={windows}
            activeWindowId={activeWindowId}
            toggleMinimize={toggleMinimize}
            onToggleLanguage={onToggleLanguage}
          />
        </div>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
