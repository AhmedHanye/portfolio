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

function handleIconTap(
  id: DesktopIconId,
  isMobile: boolean,
  isDoubleTap: boolean,
  onSelect: (id: DesktopIconId) => void,
  onOpen: (id: DesktopIconId) => void,
): void {
  if (isMobile || isDoubleTap) {
    onSelect(id);
    onOpen(id);
    return;
  }
  onSelect(id);
}

function getIconGraphicStyle(isSelected: boolean, isShortScreen: boolean): React.CSSProperties {
  const sizePx = isShortScreen ? "32px" : "38px";
  return {
    width: sizePx,
    height: sizePx,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    filter: isSelected ? "drop-shadow(0 0 1px #000080)" : "none",
    opacity: isSelected ? 0.85 : 1,
  };
}

function getIconLabelBoxStyle(isSelected: boolean, isShortScreen: boolean): React.CSSProperties {
  return {
    marginTop: isShortScreen ? "2px" : "4px",
    padding: "1px 4px",
    backgroundColor: isSelected ? "#000080" : "transparent",
    outline: isSelected ? "1px dotted #ffffff" : "none",
    borderRadius: "0px",
    maxWidth: "100%",
  };
}

function getIconLabelTextStyle(isSelected: boolean, isShortScreen: boolean): React.CSSProperties {
  return {
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
  };
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
    handleIconTap(id, isMobile, isDoubleTap, onSelect, onOpen);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpen(id);
  };

  const graphicStyle = getIconGraphicStyle(isSelected, isShortScreen);
  const labelBoxStyle = getIconLabelBoxStyle(isSelected, isShortScreen);
  const labelTextStyle = getIconLabelTextStyle(isSelected, isShortScreen);

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
      <div style={graphicStyle}>{icon}</div>
      <div style={labelBoxStyle}>
        <span style={labelTextStyle}>{label}</span>
      </div>
    </button>
  );
}

function getDesktopIconsContainerStyle(isRtl: boolean, isShortScreen: boolean): React.CSSProperties {
  return {
    position: "absolute",
    left: isRtl ? "auto" : "12px",
    right: isRtl ? "12px" : "auto",
    top: "10px",
    display: "flex",
    flexDirection: "column",
    gap: isShortScreen ? "8px" : "16px",
    zIndex: 1,
  };
}

const DESKTOP_ICON_LIST: Array<{
  id: DesktopIconId;
  labelKey: string;
  renderIcon: (size: string) => React.ReactNode;
}> = [
  { id: "system", labelKey: "desktop.myComputer", renderIcon: (s) => <Computer variant="32x32_4" style={{ width: s, height: s }} /> },
  { id: "about", labelKey: "desktop.aboutMe", renderIcon: (s) => <Wordpad variant="32x32_4" style={{ width: s, height: s }} /> },
  { id: "projects", labelKey: "desktop.myProjects", renderIcon: (s) => <Folder variant="32x32_4" style={{ width: s, height: s }} /> },
  { id: "skills", labelKey: "desktop.mySkills", renderIcon: (s) => <Progman11 variant="32x32_4" style={{ width: s, height: s }} /> },
  { id: "cDrive", labelKey: "desktop.cDrive", renderIcon: (s) => <CdMusic variant="32x32_4" style={{ width: s, height: s }} /> },
  { id: "webPortfolio", labelKey: "desktop.webPortfolio", renderIcon: (s) => <Globe variant="32x32_4" style={{ width: s, height: s }} /> },
];

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

  const handleIconOpen = (id: DesktopIconId) => {
    onSelect(id);
    if (id === "webPortfolio") {
      onExitPortfolio();
      return;
    }
    openWindow(id);
  };

  const containerStyle = getDesktopIconsContainerStyle(isRtl, isShortScreen);

  return (
    <div style={containerStyle}>
      {DESKTOP_ICON_LIST.map(({ id, labelKey, renderIcon }) => (
        <DesktopIcon
          key={id}
          id={id}
          icon={renderIcon(iconSize)}
          label={t(labelKey)}
          isSelected={selectedId === id}
          onSelect={onSelect}
          onOpen={handleIconOpen}
          isShortScreen={isShortScreen}
        />
      ))}
    </div>
  );
}

