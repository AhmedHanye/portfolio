"use client";

import React from "react";
import { WindowContent, Frame } from "react95";
import { useTranslations } from "next-intl";
import { Folder, CdMusic } from "@react95/icons";
import WindowFrame from "./WindowFrame";

interface FolderItemProps {
  label: string;
  onClick: () => void;
}

function FolderItem({ label, onClick }: FolderItemProps) {
  return (
    <button
      type="button"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "none",
        border: "none",
        padding: "6px",
        cursor: "pointer",
        color: "inherit",
        font: "inherit",
        width: "70px",
      }}
      onClick={onClick}
    >
      <Folder variant="32x32_4" style={{ width: "32px", height: "32px" }} />
      <span style={{ fontSize: "11px", marginTop: "4px", textAlign: "center", wordBreak: "break-word" }}>
        {label}
      </span>
    </button>
  );
}

interface CDriveWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
  onOpenProjects: () => void;
}

export default function CDriveWindow({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
  onOpenProjects,
}: CDriveWindowProps) {
  const t = useTranslations("OS");

  if (!isOpen) return null;

  const folderItems: FolderItemProps[] = [
    {
      label: t("cDrive.projects"),
      onClick: onOpenProjects,
    },
    {
      label: t("cDrive.windows"),
      onClick: () => alert(t("cDrive.windowsAlert")),
    },
    {
      label: t("cDrive.recycled"),
      onClick: () => alert(t("cDrive.recycledAlert")),
    },
  ];

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<CdMusic variant="16x16_4" style={{ width: "16px", height: "16px" }} />}
      title={t("cDrive.title")}
      initialX={100}
      initialY={60}
      defaultWidth={420}
      defaultHeight={300}
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
          <CdMusic variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", fontWeight: "bold", fontFamily: "ms_sans_serif, sans-serif" }}>
            C:\
          </span>
        </Frame>
      </div>

      <WindowContent
        style={{
          padding: "6px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <Frame
          variant="field"
          style={{
            background: "#fff",
            padding: "12px",
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            flex: 1,
            alignContent: "flex-start",
          }}
        >
          {folderItems.map((item) => (
            <FolderItem key={item.label} {...item} />
          ))}
        </Frame>
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
          {t("systemWindow.items", { count: folderItems.length })}
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
