"use client";

import React, { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Computer, CdMusic, Wordpad, Progman11, Folder, Globe } from "@react95/icons";
import { type WindowId } from "@/hooks/use-window-manager";
import { useCompactViewport } from "@/hooks/use-compact-viewport";

export type DesktopIconId = WindowId | "webPortfolio";

interface DesktopIconProps {
  id: DesktopIconId;
  icon: React.ReactNode;
  label: string;
  isSelected: boolean;
  onSelect: (id: DesktopIconId) => void;
  onOpen: (id: DesktopIconId) => void;
  isShortScreen: boolean;
}

function DesktopIcon({
  id,
  icon,
  label,
  isSelected,
  onSelect,
  onOpen,
  isShortScreen,
}: DesktopIconProps) {
  const lastTouchRef = useRef<number>(0);
  const { isMobile } = useCompactViewport();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const isDoubleTap = now - lastTouchRef.current < 450;
    lastTouchRef.current = now;

    if (isMobile) {
      // Mobile / touch screen: single tap selects & opens smoothly
      onSelect(id);
      onOpen(id);
    } else {
      // Desktop: single click selects, double tap / fast click opens
      if (isDoubleTap) {
        onOpen(id);
      } else {
        onSelect(id);
      }
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(id);
  };

  return (
    <button
      type="button"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: isShortScreen ? "75px" : "85px",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: "4px 2px",
        color: "inherit",
        font: "inherit",
        userSelect: "none",
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      title={label}
    >
      <div
        style={{
          width: isShortScreen ? "32px" : "38px",
          height: isShortScreen ? "32px" : "38px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          filter: isSelected ? "drop-shadow(0 0 1px #000080)" : "none",
          opacity: isSelected ? 0.85 : 1,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          marginTop: isShortScreen ? "2px" : "4px",
          padding: "1px 4px",
          backgroundColor: isSelected ? "#000080" : "transparent",
          outline: isSelected ? "1px dotted #ffffff" : "none",
          borderRadius: "0px",
          maxWidth: "100%",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: isShortScreen ? "10px" : "11px",
            fontFamily: "ms_sans_serif, sans-serif",
            textShadow: isSelected
              ? "none"
              : "1px 1px #000, -1px -1px #000, 1px -1px #000, -1px 1px #000",
            textAlign: "center",
            userSelect: "none",
            pointerEvents: "none",
            lineHeight: "1.2",
            display: "block",
            wordBreak: "break-word",
          }}
        >
          {label}
        </span>
      </div>
    </button>
  );
}

interface DesktopIconsProps {
  selectedId: DesktopIconId | null;
  onSelect: (id: DesktopIconId | null) => void;
  openWindow: (id: WindowId) => void;
  onExitPortfolio: () => void;
}

export default function DesktopIcons({
  selectedId,
  onSelect,
  openWindow,
  onExitPortfolio,
}: DesktopIconsProps) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { isShortScreen } = useCompactViewport();

  const iconSize = isShortScreen ? "28px" : "34px";

  const handleIconSelect = (id: DesktopIconId) => {
    onSelect(id);
  };

  const handleIconOpen = (id: DesktopIconId) => {
    onSelect(id);
    if (id === "webPortfolio") {
      onExitPortfolio();
    } else {
      openWindow(id);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: isRtl ? "auto" : "12px",
        right: isRtl ? "12px" : "auto",
        top: "10px",
        display: "flex",
        flexDirection: "column",
        gap: isShortScreen ? "8px" : "16px",
        zIndex: 1,
      }}
    >
      <DesktopIcon
        id="system"
        icon={<Computer variant="32x32_4" style={{ width: iconSize, height: iconSize }} />}
        label={t("desktop.myComputer")}
        isSelected={selectedId === "system"}
        onSelect={handleIconSelect}
        onOpen={handleIconOpen}
        isShortScreen={isShortScreen}
      />

      <DesktopIcon
        id="about"
        icon={<Wordpad variant="32x32_4" style={{ width: iconSize, height: iconSize }} />}
        label={t("desktop.aboutMe")}
        isSelected={selectedId === "about"}
        onSelect={handleIconSelect}
        onOpen={handleIconOpen}
        isShortScreen={isShortScreen}
      />

      <DesktopIcon
        id="projects"
        icon={<Folder variant="32x32_4" style={{ width: iconSize, height: iconSize }} />}
        label={t("desktop.myProjects")}
        isSelected={selectedId === "projects"}
        onSelect={handleIconSelect}
        onOpen={handleIconOpen}
        isShortScreen={isShortScreen}
      />

      <DesktopIcon
        id="skills"
        icon={<Progman11 variant="32x32_4" style={{ width: iconSize, height: iconSize }} />}
        label={t("desktop.mySkills")}
        isSelected={selectedId === "skills"}
        onSelect={handleIconSelect}
        onOpen={handleIconOpen}
        isShortScreen={isShortScreen}
      />

      <DesktopIcon
        id="cDrive"
        icon={<CdMusic variant="32x32_4" style={{ width: iconSize, height: iconSize }} />}
        label={t("desktop.cDrive")}
        isSelected={selectedId === "cDrive"}
        onSelect={handleIconSelect}
        onOpen={handleIconOpen}
        isShortScreen={isShortScreen}
      />

      <DesktopIcon
        id="webPortfolio"
        icon={<Globe variant="32x32_4" style={{ width: iconSize, height: iconSize }} />}
        label={t("desktop.webPortfolio")}
        isSelected={selectedId === "webPortfolio"}
        onSelect={handleIconSelect}
        onOpen={handleIconOpen}
        isShortScreen={isShortScreen}
      />
    </div>
  );
}

