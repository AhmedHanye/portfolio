"use client";

import React from "react";
import { Window, WindowHeader, WindowContent, Button, Frame } from "react95";
import { useTranslations } from "next-intl";
import { Win95Icon } from "./Win95Icon";

interface FolderItemProps {
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
}

function FolderItem({ src, alt, label, onClick }: FolderItemProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Win95Icon src={src} alt={alt} size={32} />
      <span style={{ fontSize: "11px", marginTop: "4px", textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

interface CDriveWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  onOpenExplorer: () => void;
}

export default function CDriveWindow({
  isOpen,
  onClose,
  isMinimized,
  onOpenExplorer,
}: CDriveWindowProps) {
  const t = useTranslations("OS");

  if (!isOpen) return null;

  const folderItems: FolderItemProps[] = [
    {
      src: "/icons/folder_32x32.png",
      alt: t("cDrive.projects"),
      label: t("cDrive.projects"),
      onClick: onOpenExplorer,
    },
    {
      src: "/icons/folder_32x32.png",
      alt: t("cDrive.windows"),
      label: t("cDrive.windows"),
      onClick: () => alert(t("cDrive.windowsAlert")),
    },
    {
      src: "/icons/folder_32x32.png",
      alt: t("cDrive.recycled"),
      label: t("cDrive.recycled"),
      onClick: () => alert(t("cDrive.recycledAlert")),
    },
  ];

  return (
    <Window
      style={{
        width: "350px",
        height: "260px",
        position: "absolute",
        left: "50px",
        top: "280px",
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
        zIndex: 11,
      }}
    >
      <WindowHeader
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Win95Icon src="/icons/reader_closed_16x16.png" alt="C:" size={16} />
          <span style={{ fontWeight: "bold" }}>{t("cDrive.title")}</span>
        </span>
        <Button size="sm" square onClick={onClose}>
          <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>
            x
          </span>
        </Button>
      </WindowHeader>

      <WindowContent style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, padding: "10px" }}>
        <p style={{ margin: 0, fontSize: "12px" }}>
          {t("cDrive.subtitle")}
        </p>

        <Frame
          variant="field"
          style={{
            background: "#fff",
            flex: 1,
            padding: "10px",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "10px",
            overflowY: "auto",
          }}
        >
          {folderItems.map((item) => (
            <FolderItem key={item.alt} {...item} />
          ))}
        </Frame>
      </WindowContent>
    </Window>
  );
}
