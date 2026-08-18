"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Button, Frame } from "react95";
import { Printer } from "@react95/icons";
import { downloadResume, openResumeInNewTab, printResume } from "@/lib/print-resume";
import WindowFrame from "./WindowFrame";

interface ResumeWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
}

export default function ResumeWindow({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
}: ResumeWindowProps) {
  const t = useTranslations("OS.resumeWindow");

  if (!isOpen) return null;

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      onMinimize={undefined}
      onOpenNewTab={openResumeInNewTab}
      newTabTitle={t("btnNewTab")}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<Printer variant="16x16_4" style={{ width: "16px", height: "16px" }} />}
      title={t("title")}
      initialX={80}
      initialY={25}
      defaultWidth={760}
      defaultHeight={600}
      allowMaximize
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          padding: "4px 6px 6px 6px",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <Frame
            variant="field"
            style={{
              padding: "2px 6px",
              fontSize: "11px",
              fontFamily: "ms_sans_serif, sans-serif",
              backgroundColor: "#fff",
              flex: 1,
              minWidth: "140px",
            }}
          >
            {t("address")}
          </Frame>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Button
              size="sm"
              onClick={downloadResume}
              style={{ fontSize: "11px", fontWeight: "bold" }}
            >
              💾 {t("btnDownload")}
            </Button>
            <Button
              size="sm"
              onClick={printResume}
              style={{ fontSize: "11px", fontWeight: "bold" }}
            >
              🖨️ {t("btnPrint")}
            </Button>
          </div>
        </div>

        <iframe
          src="/resume.pdf#toolbar=1&navpanes=0"
          title="resume.pdf"
          style={{
            width: "100%",
            height: "100%",
            flex: 1,
            border: "1px solid #777",
            backgroundColor: "#525659",
            display: "block",
          }}
        />
      </div>
    </WindowFrame>
  );
}
