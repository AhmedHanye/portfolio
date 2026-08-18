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
import { type WindowId, type WindowsState } from "@/hooks/use-window-manager";
import {
  Computer,
  CdMusic,
  Folder,
  Wordpad,
  Progman11,
  FileText,
  MediaAudio,
  Mute,
  Globe,
  Printer,
} from "@react95/icons";
import { playFx, useSoundState } from "@/lib/sound";
import { useCompactViewport } from "@/hooks/use-compact-viewport";

function iconSpacing(isRtl: boolean): React.CSSProperties {
  return isRtl ? { marginLeft: 8 } : { marginRight: 8 };
}

interface StartMenuProps {
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onOpenWindow: (id: WindowId) => void;
  onExitPortfolio: () => void;
  onShutdown: () => void;
  onToggleLanguage: () => void;
  isRtl: boolean;
  t: (key: string) => string;
}

function StartMenuDropdown({
  startMenuOpen,
  setStartMenuOpen,
  onOpenWindow,
  onExitPortfolio,
  onShutdown,
  onToggleLanguage,
  isRtl,
  t,
}: StartMenuProps) {
  if (!startMenuOpen) return null;

  const handleItemClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    playFx("click");
    setStartMenuOpen(false);
    action();
  };

  return (
    <MenuList
      style={{
        position: "absolute",
        left: isRtl ? "auto" : "0",
        right: isRtl ? "0" : "auto",
        bottom: "100%",
        marginBottom: "2px",
        zIndex: 100000,
        width: "220px",
        boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)",
      }}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("about"))}>
        <Wordpad variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.aboutMe")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("projects"))}>
        <Folder variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.projects")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("skills"))}>
        <Progman11 variant="32x32_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.skills")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("certifications"))}>
        <FileText variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.certificates")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("resume"))}>
        <Printer variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.resume")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("system"))}>
        <Computer variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.systemProperties")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(() => onOpenWindow("cDrive"))}>
        <CdMusic variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.cDrive")}
      </MenuListItem>
      <Separator />
      <MenuListItem onClick={handleItemClick(onExitPortfolio)}>
        <Globe variant="16x16_4" style={{ width: "16px", height: "16px", ...iconSpacing(isRtl) }} />
        {t("startMenu.exitToPortfolio")}
      </MenuListItem>
      <MenuListItem onClick={handleItemClick(onToggleLanguage)}>
        <span role="img" aria-label="language" style={iconSpacing(isRtl)}>🌐</span>
        {t("startMenu.language")}
      </MenuListItem>
      <Separator />
      <MenuListItem onClick={handleItemClick(onShutdown)}>
        <span role="img" aria-label="shutdown" style={iconSpacing(isRtl)}>🔌</span>
        {t("startMenu.shutdown")}
      </MenuListItem>
    </MenuList>
  );
}

interface TaskbarButtonProps {
  id: WindowId;
  icon: React.ReactNode;
  titleKey: string;
  isOpen: boolean;
  isActive: boolean;
  maxBtnWidth: string;
  onToggle: (id: WindowId) => void;
  t: (key: string) => string;
}

function TaskbarWindowButton({
  id,
  icon,
  titleKey,
  isOpen,
  isActive,
  maxBtnWidth,
  onToggle,
  t,
}: TaskbarButtonProps) {
  if (!isOpen) return null;

  return (
    <Button
      active={isActive}
      onClick={() => onToggle(id)}
      style={{
        fontWeight: isActive ? "bold" : "normal",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "0 6px",
        height: "26px",
        maxWidth: maxBtnWidth,
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      {icon}
      <span
        style={{
          fontSize: "11px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {t(titleKey)}
      </span>
    </Button>
  );
}

const TASKBAR_WINDOW_CONFIGS: Array<{
  id: WindowId;
  icon: React.ReactNode;
  titleKey: string;
}> = [
  {
    id: "system",
    icon: <Computer variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.system",
  },
  {
    id: "about",
    icon: <Wordpad variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.about",
  },
  {
    id: "projects",
    icon: <Folder variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.projects",
  },
  {
    id: "skills",
    icon: <Progman11 variant="32x32_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.skills",
  },
  {
    id: "certifications",
    icon: <FileText variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.certificates",
  },
  {
    id: "resume",
    icon: <Printer variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.resume",
  },
  {
    id: "cDrive",
    icon: <CdMusic variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />,
    titleKey: "taskbar.cDrive",
  },
];

interface ActiveWindowButtonsProps {
  windows: WindowsState;
  activeWindowId: WindowId | null;
  toggleMinimize: (id: WindowId) => void;
  t: (key: string) => string;
}

function isTaskbarWindowActive(
  win: WindowsState[WindowId] | undefined,
  activeWindowId: WindowId | null,
  id: WindowId,
): boolean {
  if (!win || !win.isOpen || win.isMinimized) return false;
  return activeWindowId === id;
}

function isWindowOpen(win: WindowsState[WindowId] | undefined): boolean {
  return win ? win.isOpen : false;
}

function ActiveWindowButtons({
  windows,
  activeWindowId,
  toggleMinimize,
  t,
}: ActiveWindowButtonsProps) {
  const { isCompact } = useCompactViewport();
  const maxBtnWidth = isCompact ? "100px" : "150px";

  return (
    <>
      {TASKBAR_WINDOW_CONFIGS.map(({ id, icon, titleKey }) => {
        const win = windows[id];
        return (
          <TaskbarWindowButton
            key={id}
            id={id}
            icon={icon}
            titleKey={titleKey}
            isOpen={isWindowOpen(win)}
            isActive={isTaskbarWindowActive(win, activeWindowId, id)}
            maxBtnWidth={maxBtnWidth}
            onToggle={toggleMinimize}
            t={t}
          />
        );
      })}
    </>
  );
}

interface TaskBarProps {
  startMenuOpen: boolean;
  setStartMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  onOpenWindow: (id: WindowId) => void;
  onExitPortfolio: () => void;
  onShutdown: () => void;
  time: string;
  windows: WindowsState;
  activeWindowId: WindowId | null;
  toggleMinimize: (id: WindowId) => void;
  onToggleLanguage: () => void;
}

export default function TaskBar({
  startMenuOpen,
  setStartMenuOpen,
  onOpenWindow,
  onExitPortfolio,
  onShutdown,
  time,
  windows,
  activeWindowId,
  toggleMinimize,
  onToggleLanguage,
}: TaskBarProps) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { muted, toggle: toggleSound } = useSoundState();

  const handleStartButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playFx("click");
    setStartMenuOpen((prev) => !prev);
  };

  const handleLanguageToggle = () => {
    playFx("click");
    onToggleLanguage();
  };

  const handleSoundToggle = () => {
    toggleSound();
    playFx("click");
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
        overflow: "visible",
      }}
    >
      <Toolbar style={{ justifyContent: "space-between", padding: "0 6px", overflow: "visible" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0, flex: 1, overflow: "visible" }}>
          <div style={{ position: "relative", zIndex: 10000 }}>
            <Button
              onClick={handleStartButtonClick}
              active={startMenuOpen}
              style={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <span style={iconSpacing(isRtl)}>🏁</span>
              {t("taskbar.start")}
            </Button>

            <StartMenuDropdown
              startMenuOpen={startMenuOpen}
              setStartMenuOpen={setStartMenuOpen}
              onOpenWindow={onOpenWindow}
              onExitPortfolio={onExitPortfolio}
              onShutdown={onShutdown}
              onToggleLanguage={handleLanguageToggle}
              isRtl={isRtl}
              t={t}
            />
          </div>

          <div
            style={{
              width: "2px",
              height: "22px",
              backgroundColor: "#fff",
              borderLeft: "1px solid #808080",
              margin: "0 4px",
              flexShrink: 0,
            }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "3px", overflowX: "auto", minWidth: 0, flex: 1, scrollbarWidth: "none" }}>
            <ActiveWindowButtons
              windows={windows}
              activeWindowId={activeWindowId}
              toggleMinimize={toggleMinimize}
              t={t}
            />
          </div>
        </div>

        <Frame
          variant="well"
          style={{
            padding: "2px 6px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            height: "28px",
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <Button
            size="sm"
            onClick={handleLanguageToggle}
            style={{
              height: "20px",
              padding: "0 4px",
              fontSize: "11px",
              fontWeight: "bold",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "24px",
              lineHeight: 1,
            }}
          >
            {locale.toUpperCase()}
          </Button>

          <button
            type="button"
            onClick={handleSoundToggle}
            title={muted ? "Unmute Sound" : "Mute Sound"}
            aria-label={muted ? "Unmute Sound" : "Mute Sound"}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
              cursor: "pointer",
            }}
          >
            {muted ? (
              <Mute variant="16x16_4" style={{ width: "16px", height: "16px" }} />
            ) : (
              <MediaAudio variant="16x16_4" style={{ width: "16px", height: "16px" }} />
            )}
          </button>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "normal",
              lineHeight: "18px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {time}
          </span>
        </Frame>
      </Toolbar>
    </AppBar>
  );
}
