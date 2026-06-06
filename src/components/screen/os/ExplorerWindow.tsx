"use client";

import React from "react";
import { Window, WindowHeader, WindowContent, Button, Frame } from "react95";
import { useTranslations } from "next-intl";
import { Win95Icon } from "./Win95Icon";

interface ExplorerWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
}

export default function ExplorerWindow({
  isOpen,
  onClose,
  isMinimized,
}: ExplorerWindowProps) {
  const t = useTranslations("OS");

  if (!isOpen) return null;

  const handleOpenReadme = () => {
    alert(t("explorer.readmeAlert"));
  };

  return (
    <Window
      style={{
        width: "380px",
        height: "280px",
        position: "absolute",
        left: "300px",
        top: "150px",
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
        zIndex: 12,
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
          <Win95Icon src="/icons/windows_explorer_16x16.png" alt="Explorer" size={16} />
          <span style={{ fontWeight: "bold" }}>{t("explorer.title")}</span>
        </span>
        <Button size="sm" square onClick={onClose}>
          <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>
            x
          </span>
        </Button>
      </WindowHeader>

      <WindowContent style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, padding: "10px" }}>
        <p style={{ margin: 0, fontSize: "12px" }}>
          {t("explorer.projectsPath")}
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
          {/* Readme File */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleOpenReadme}
          >
            <span style={{ fontSize: "32px", lineHeight: 1 }}>📄</span>
            <span style={{ fontSize: "11px", marginTop: "4px", textAlign: "center" }}>
              README.txt
            </span>
          </div>

          {/* Spline Room Shortcut */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => alert(t("explorer.splineAlert"))}
          >
            <span style={{ fontSize: "32px", lineHeight: 1 }}>🔗</span>
            <span style={{ fontSize: "11px", marginTop: "4px", textAlign: "center" }}>
              spline_room.lnk
            </span>
          </div>
        </Frame>
      </WindowContent>
    </Window>
  );
}
