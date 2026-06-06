"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  MenuList,
  MenuListItem,
  Separator,
  Frame,
} from "react95";
import { useLocale, useTranslations } from "next-intl";
import { type WindowId } from "@/hooks/use-window-manager";
import { Win95Icon } from "./Win95Icon";

/** Returns the spacing style that places an icon on the correct side for RTL. */
function iconSpacing(isRtl: boolean): React.CSSProperties {
  return isRtl ? { marginLeft: 8 } : { marginRight: 8 };
}

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
}

interface TaskBarProps {
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean) => void;
  onStartMenuClick: (item: string) => void;
  time: string;
  windows: Record<WindowId, WindowState>;
  toggleMinimize: (id: WindowId) => void;
  onToggleLanguage: () => void;
}

export default function TaskBar({
  startMenuOpen,
  setStartMenuOpen,
  onStartMenuClick,
  time,
  windows,
  toggleMinimize,
  onToggleLanguage,
}: TaskBarProps) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const handleStartButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setStartMenuOpen(!startMenuOpen);
  };

  // Internal handler wraps the prop to also close the menu
  const handleStartMenuItemClick = (item: string) => {
    setStartMenuOpen(false);
    onStartMenuClick(item);
  };

  return (
    <AppBar
      style={{
        top: "auto",
        bottom: 0,
        position: "absolute",
        left: 0,
        right: 0,
        zIndex: 9999,
      }}
    >
      <Toolbar style={{ justifyContent: "space-between", padding: "0 10px" }}>
        {/* Left Side: Start Button & Active Window Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ position: "relative" }}>
            <Button
              onClick={handleStartButtonClick}
              active={startMenuOpen}
              style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <span style={iconSpacing(isRtl)}>🏁</span>
              {t("taskbar.start")}
            </Button>

            {startMenuOpen && (
              <MenuList
                style={{
                  position: "absolute",
                  left: isRtl ? "auto" : "0",
                  right: isRtl ? "0" : "auto",
                  bottom: "100%",
                  zIndex: 99999,
                  width: "180px",
                }}
                onClick={() => setStartMenuOpen(false)}
              >
                <MenuListItem onClick={() => handleStartMenuItemClick("about")}>
                  <span role="img" aria-label="about" style={iconSpacing(isRtl)}>📬</span>
                  {t("startMenu.aboutMe")}
                </MenuListItem>
                <MenuListItem onClick={() => handleStartMenuItemClick("skills")}>
                  <span role="img" aria-label="skills" style={iconSpacing(isRtl)}>⚙️</span>
                  {t("startMenu.skills")}
                </MenuListItem>
                <MenuListItem onClick={() => handleStartMenuItemClick("portfolio")}>
                  <span role="img" aria-label="portfolio" style={iconSpacing(isRtl)}>📁</span>
                  {t("startMenu.projects")}
                </MenuListItem>
                <MenuListItem onClick={() => handleStartMenuItemClick("system")}>
                  <span role="img" aria-label="system" style={iconSpacing(isRtl)}>💻</span>
                  {t("startMenu.systemStatus")}
                </MenuListItem>
                <Separator />
                <MenuListItem onClick={onToggleLanguage}>
                  <span role="img" aria-label="language" style={iconSpacing(isRtl)}>🌐</span>
                  {t("startMenu.language")}
                </MenuListItem>
                <Separator />
                <MenuListItem onClick={() => handleStartMenuItemClick("shutdown")}>
                  <span role="img" aria-label="shutdown" style={iconSpacing(isRtl)}>🔌</span>
                  {t("startMenu.shutdown")}
                </MenuListItem>
              </MenuList>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              width: "2px",
              height: "22px",
              backgroundColor: "#fff",
              borderLeft: "1px solid #808080",
              margin: "0 5px",
            }}
          />

          {/* Active Windows Buttons */}
          {windows.system.isOpen && (
            <Button
              active={!windows.system.isMinimized}
              onClick={() => toggleMinimize("system")}
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 10px",
                height: "26px",
              }}
            >
              <Win95Icon src="/icons/computer_16x16.png" alt="Sys" size={16} />
              <span style={{ fontSize: "12px" }}>ahmed_os.exe</span>
            </Button>
          )}

          {windows.cDrive.isOpen && (
            <Button
              active={!windows.cDrive.isMinimized}
              onClick={() => toggleMinimize("cDrive")}
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 10px",
                height: "26px",
              }}
            >
              <Win95Icon src="/icons/reader_closed_16x16.png" alt="C Drive" size={16} />
              <span style={{ fontSize: "12px" }}>{t("taskbar.cDrive")}</span>
            </Button>
          )}

          {windows.explorer.isOpen && (
            <Button
              active={!windows.explorer.isMinimized}
              onClick={() => toggleMinimize("explorer")}
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 10px",
                height: "26px",
              }}
            >
              <Win95Icon src="/icons/windows_explorer_16x16.png" alt="Explorer" size={16} />
              <span style={{ fontSize: "12px" }}>{t("taskbar.explorer")}</span>
            </Button>
          )}
        </div>

        {/* Right Side: Tray with Clock, Sound Icon, and Language Switcher */}
        <Frame
          variant="well"
          style={{
            padding: "2px 8px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            height: "26px",
            boxSizing: "border-box",
          }}
        >
          <Button
            size="sm"
            onClick={onToggleLanguage}
            style={{
              height: "18px",
              padding: "0 4px",
              fontSize: "10px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "24px",
            }}
          >
            {locale.toUpperCase()}
          </Button>

          <Win95Icon src="/icons/volume_32x32.png" alt={t("taskbar.volume")} size={16} />
          <span style={{ fontSize: "12px", fontWeight: "normal" }}>
            {time}
          </span>
        </Frame>
      </Toolbar>
    </AppBar>
  );
}
