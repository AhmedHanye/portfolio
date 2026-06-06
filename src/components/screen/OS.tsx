"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { styleReset } from "react95";
import original from "react95/dist/themes/original";
import StyledComponentsRegistry from "@/lib/registry";

// @ts-expect-error woff2 file imports need declaration
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
// @ts-expect-error woff2 file imports need declaration
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

import { useTranslations, useLocale } from "next-intl";
import { useWindowManager } from "@/hooks/use-window-manager";

// Import OS windows directly — no barrel — for optimal tree-shaking.
import DesktopIcons from "./os/DesktopIcons";
import SystemWindow from "./os/SystemWindow";
import CDriveWindow from "./os/CDriveWindow";
import ExplorerWindow from "./os/ExplorerWindow";
import TaskBar from "./os/TaskBar";

const GlobalStyles = createGlobalStyle`
  ${styleReset}
  
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
  /* Specifically target styled-components inside react95 */
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
  
  body {
    font-family: 'ms_sans_serif', sans-serif;
  }
  
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  /* Fix react95 legend positioning under RTL direction */
  .win95-screen-container[dir="rtl"] legend,
  [dir="rtl"] .win95-screen-container legend {
    left: auto !important;
    right: 8px !important;
  }
`;

export default function Os({ onToggleLanguage }: { onToggleLanguage: () => void }) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Seed with current time to avoid the initial empty-string flash.
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  );
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Centralised window open/minimized state
  const { windows, openWindow, closeWindow, toggleMinimize } = useWindowManager();

  // Update clock time
  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simple progress animation for "system loading"
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(progressInterval);
  }, []);

  // Memoised to prevent SystemWindow → SystemProperties from re-rendering on
  // every tick — the array reference was previously new on every render.
  const systemLogs = useMemo(() => {
    const logs = [
      t("diagnostics.logKernel"),
      t("diagnostics.logDjango"),
      t("diagnostics.logPowerSync"),
    ];
    if (progress >= 30) logs.push(t("diagnostics.logNextReact"));
    if (progress >= 60) logs.push(t("diagnostics.logCelery"));
    if (progress >= 90) logs.push(t("diagnostics.logFsd"));
    if (progress === 100) logs.push(t("diagnostics.logReady"));
    return logs;
  }, [progress, t]);

  const handleStartMenuClick = (item: string) => {
    setStartMenuOpen(false);
    if (item === "shutdown") {
      alert(t("startMenu.shutdownAlert"));
    } else if (item === "about") {
      setActiveTab(1);
      openWindow("system");
    } else if (item === "skills") {
      setActiveTab(2);
      openWindow("system");
    } else if (item === "portfolio") {
      setActiveTab(3);
      openWindow("system");
    } else if (item === "system") {
      setActiveTab(0);
      openWindow("system");
    }
  };

  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={original}>
        <GlobalStyles />
        <div
          className="win95-screen-container"
          dir={isRtl ? "rtl" : "ltr"}
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
            padding: "20px",
            color: "#000",
            fontSize: "14px",
          }}
          onClick={() => setStartMenuOpen(false)}
        >
          {/* Main Desktop Space */}
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            {/* Desktop Shortcuts */}
            <DesktopIcons
              setActiveTab={setActiveTab}
              openWindow={openWindow}
            />

            {/* Main Application Window (ahmed_os.exe) */}
            <SystemWindow
              isOpen={windows.system.isOpen}
              onClose={() => closeWindow("system")}
              isMinimized={windows.system.isMinimized}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              progress={progress}
              systemLogs={systemLogs}
            />

            {/* Simulated CDrive Explorer Window */}
            <CDriveWindow
              isOpen={windows.cDrive.isOpen}
              onClose={() => closeWindow("cDrive")}
              isMinimized={windows.cDrive.isMinimized}
              onOpenExplorer={() => openWindow("explorer")}
            />

            {/* Simulated Windows Explorer Window */}
            <ExplorerWindow
              isOpen={windows.explorer.isOpen}
              onClose={() => closeWindow("explorer")}
              isMinimized={windows.explorer.isMinimized}
            />
          </div>

          {/* Classic Start Bar / Taskbar */}
          <TaskBar
            startMenuOpen={startMenuOpen}
            setStartMenuOpen={setStartMenuOpen}
            onStartMenuClick={handleStartMenuClick}
            time={time}
            windows={windows}
            toggleMinimize={toggleMinimize}
            onToggleLanguage={onToggleLanguage}
          />
        </div>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
