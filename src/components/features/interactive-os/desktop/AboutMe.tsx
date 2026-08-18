"use client";

import React from "react";
import { WindowContent, Button, Frame, Separator } from "react95";
import { useTranslations } from "next-intl";
import { Wordpad } from "@react95/icons";
import WindowFrame from "./WindowFrame";

interface AboutMeProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
  onOpenResume?: () => void;
}

export default function AboutMe({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
  onOpenResume,
}: AboutMeProps) {
  const t = useTranslations("OS");

  if (!isOpen) return null;

  const handleOpenLink = (url: string) => {
    if (url.startsWith("https://") || url.startsWith("http://")) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:ahmedhanyehossny@gmail.com";
  };

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<Wordpad variant="16x16_4" style={{ width: "16px", height: "16px" }} />}
      title={t("notepad.title")}
      initialX={150}
      initialY={30}
      defaultWidth={620}
      defaultHeight={500}
      allowMaximize
    >
      <WindowContent
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          padding: "6px",
          gap: "8px",
        }}
      >
        <Frame
          variant="field"
          style={{
            background: "#fff",
            padding: "12px",
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minHeight: 0,
            overflowY: "auto",
            fontFamily: "ms_sans_serif, monospace, sans-serif",
          }}
        >
          <div>
            <p style={{ margin: "0 0 4px 0", fontWeight: "bold", fontSize: "15px" }}>
              {t("aboutMe.title")}
            </p>
            <p
              style={{
                margin: 0,
                color: "#000080",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              {t("aboutMe.role")}
            </p>
          </div>

          <Separator style={{ margin: "2px 0" }} />

          <p style={{ margin: "4px 0", fontSize: "12px", lineHeight: "1.5" }}>
            {t("aboutMe.bio1")}
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", lineHeight: "1.5" }}>
            {t("aboutMe.bio2")}
          </p>

          <Separator style={{ margin: "4px 0" }} />

          <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
            <p style={{ margin: "2px 0" }}>
              <strong>{t("aboutMe.education")}</strong>
            </p>
            <p style={{ margin: "2px 0" }}>
              <strong>{t("aboutMe.major")}</strong>
            </p>
            <p style={{ margin: "2px 0" }}>
              <strong>{t("aboutMe.location")}</strong>
            </p>
            <p style={{ margin: "2px 0" }}>
              <strong>{t("aboutMe.phone")}</strong>
            </p>
          </div>

          <div style={{ flexGrow: 1 }} />

          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
              flexWrap: "wrap",
              marginTop: "8px",
              paddingTop: "6px",
              borderTop: "1px solid #dfdfdf",
            }}
          >
            {onOpenResume && (
              <Button
                primary
                onClick={onOpenResume}
                style={{ fontWeight: "bold" }}
              >
                🖨️ {t("aboutMe.resume")}
              </Button>
            )}
            <Button onClick={() => handleOpenLink("https://github.com/AhmedHanye")}>
              {t("aboutMe.github")}
            </Button>
            <Button
              onClick={() =>
                handleOpenLink("https://www.linkedin.com/in/ahmed-hanye/")
              }
            >
              {t("aboutMe.linkedin")}
            </Button>
            <Button onClick={handleEmailClick}>{t("aboutMe.emailMe")}</Button>
          </div>
        </Frame>
      </WindowContent>
    </WindowFrame>
  );
}
