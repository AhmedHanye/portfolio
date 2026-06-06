"use client";

import React from "react";
import { Frame, ProgressBar } from "react95";
import { useTranslations } from "next-intl";

interface SystemPropertiesProps {
  progress: number;
  systemLogs: string[];
}

export default function SystemProperties({
  progress,
  systemLogs,
}: SystemPropertiesProps) {
  const t = useTranslations("OS");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        height: "100%",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>
        {t("diagnostics.title")}
      </p>

      <div style={{ display: "flex", gap: "20px", flex: 1 }}>
        {/* Specifications Frame */}
        <Frame
          variant="field"
          style={{
            background: "#fff",
            padding: "12px",
            flex: 1,
            fontSize: "13px",
            lineHeight: "1.5",
          }}
        >
          <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
            {t("diagnostics.deviceSpecs")}
          </p>
          <p style={{ margin: "2px 0" }}>{t("diagnostics.os")}</p>
          <p style={{ margin: "2px 0" }}>{t("diagnostics.cpu")}</p>
          <p style={{ margin: "2px 0" }}>{t("diagnostics.ram")}</p>
          <p style={{ margin: "2px 0" }}>{t("diagnostics.graphics")}</p>
          <p style={{ margin: "2px 0" }}>{t("diagnostics.direct3d")}</p>
        </Frame>

        {/* System Log Console */}
        <Frame
          variant="field"
          dir="ltr"
          style={{
            background: "#000",
            color: "#22c55e",
            fontFamily: "monospace",
            padding: "10px",
            flex: 1,
            fontSize: "12px",
            overflowY: "auto",
            boxSizing: "border-box",
            textAlign: "left",
          }}
        >
          {systemLogs.map((log, idx) => (
            <p key={idx} style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>
              &gt; {log}
            </p>
          ))}
        </Frame>
      </div>

      {/* Loading/Calibration status */}
      <Frame
        variant="status"
        style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "5px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
          }}
        >
          <span>{t("diagnostics.calibration")}</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </Frame>
    </div>
  );
}
