"use client";

import React, { useState } from "react";
import {
  WindowContent,
  Button,
  Tabs,
  Tab,
  TabBody,
  GroupBox,
} from "react95";
import { useTranslations } from "next-intl";
import { Computer } from "@react95/icons";
import WindowFrame from "./WindowFrame";

interface SystemPropertiesProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
}

export default function SystemProperties({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
}: SystemPropertiesProps) {
  const t = useTranslations("OS");
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen) return null;

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<Computer variant="16x16_4" style={{ width: "16px", height: "16px" }} />}
      title={t("systemProperties.title")}
      initialX={120}
      initialY={40}
      defaultWidth={460}
      defaultHeight={460}
      allowMaximize={false}
    >
      <WindowContent
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
          minHeight: 0,
          padding: "8px",
        }}
      >
        <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
          <Tab value={0}>{t("systemProperties.tabGeneral")}</Tab>
          <Tab value={1}>{t("systemProperties.tabPerformance")}</Tab>
        </Tabs>

        <TabBody
          style={{
            background: "#ced0d0",
            flex: 1,
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {activeTab === 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "12px" }}>
              {/* System Info Section */}
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Computer variant="32x32_4" style={{ width: "42px", height: "42px" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <strong>{t("systemProperties.systemLabel")}</strong>
                  <span style={{ marginInlineStart: "8px" }}>{t("systemProperties.systemName")}</span>
                  <span style={{ marginInlineStart: "8px", color: "#444" }}>
                    {t("systemProperties.systemVersion")}
                  </span>
                </div>
              </div>

              <hr style={{ borderColor: "#808080", borderStyle: "solid", borderWidth: "1px 0 0 0", margin: "4px 0" }} />

              {/* Registered To Section */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginInlineStart: "32px" }}>
                <strong>{t("systemProperties.registeredLabel")}</strong>
                <span style={{ marginInlineStart: "8px" }}>{t("systemProperties.registeredUser")}</span>
                <span style={{ marginInlineStart: "8px", color: "#444" }}>
                  {t("systemProperties.registeredOrg")}
                </span>
              </div>

              <hr style={{ borderColor: "#808080", borderStyle: "solid", borderWidth: "1px 0 0 0", margin: "4px 0" }} />

              {/* Computer Stack Section */}
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginInlineStart: "32px" }}>
                <strong>{t("systemProperties.computerLabel")}</strong>
                <div style={{ marginInlineStart: "8px", whiteSpace: "pre-line", lineHeight: "1.4" }}>
                  {t("systemProperties.computerSpecs")}
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
              <GroupBox label={t("systemProperties.perfTitle")}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "6px 0", fontSize: "11px" }}>
                  <p style={{ margin: "2px 0" }}>{t("systemProperties.perf60fps")}</p>
                  <p style={{ margin: "2px 0" }}>{t("systemProperties.perfMemory")}</p>
                  <p style={{ margin: "2px 0" }}>{t("systemProperties.perfOffline")}</p>
                  <p style={{ margin: "2px 0" }}>{t("systemProperties.perfCompiler")}</p>
                </div>
              </GroupBox>
            </div>
          )}
        </TabBody>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
          <Button onClick={onClose} style={{ minWidth: "70px" }}>
            {t("systemProperties.btnOk")}
          </Button>
          <Button onClick={onClose} style={{ minWidth: "70px" }}>
            {t("systemProperties.btnCancel")}
          </Button>
        </div>
      </WindowContent>
    </WindowFrame>
  );
}
