"use client";

import React from "react";
import { Frame, Button, Separator } from "react95";
import { useTranslations } from "next-intl";

export default function AboutMe() {
  const t = useTranslations("OS");

  const handleOpenLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:ahmedhanyehossny@gmail.com";
  };

  return (
    <Frame
      variant="field"
      style={{
        background: "#fff",
        padding: "15px",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
          {t("aboutMe.title")}
        </p>
        <p
          style={{
            margin: 0,
            color: "#666",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {t("aboutMe.role")}
        </p>

        <p style={{ margin: "5px 0", fontSize: "12px", lineHeight: "1.4" }}>
          {t("aboutMe.bio1")}
        </p>
        <p style={{ margin: "5px 0", fontSize: "12px", lineHeight: "1.4" }}>
          {t("aboutMe.bio2")}
        </p>

        <Separator style={{ margin: "5px 0" }} />

        <div style={{ fontSize: "12px", lineHeight: "1.5" }}>
          <p style={{ margin: "2px 0" }}>
            <strong>{t("aboutMe.education")}</strong>
          </p>
          <p style={{ margin: "2px 0" }}>
            <strong>{t("aboutMe.major")}</strong>
          </p>
          <p style={{ margin: "2px 0" }}>
            <strong>{t("aboutMe.location")}</strong>
          </p>
        </div>
      </div>

      <div style={{ flexGrow: 1 }} />

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          flexWrap: "wrap",
          marginTop: "10px",
        }}
      >
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
  );
}
