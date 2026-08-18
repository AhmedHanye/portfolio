"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  WindowContent,
  Button,
  ScrollView,
  GroupBox,
  Separator,
  Frame,
} from "react95";
import { useTranslations } from "next-intl";
import { FileText } from "@react95/icons";
import { playFx } from "@/lib/sound";
import WindowFrame from "./WindowFrame";
import {
  CERTIFICATIONS,
  CERTIFICATE_CATEGORIES,
  ISSUER_THEMES,
  type CertificateCategory,
  type Certification,
} from "@/lib/constants/certifications";
import { getSkillUrl } from "@/lib/constants/skills";

function openExternalLink(url: string): void {
  playFx("click");
  window.open(url, "_blank", "noopener,noreferrer");
}

function IssuerEmblem({ cert }: { cert: Certification }) {
  if (cert.badgeImage) {
    return (
      <div
        style={{
          width: "48px",
          height: "48px",
          backgroundColor: "#fff",
          border: "1px solid #999",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Image
          src={cert.badgeImage}
          alt={cert.issuer}
          width={42}
          height={42}
          style={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%" }}
          unoptimized
        />
      </div>
    );
  }

  const theme = ISSUER_THEMES[cert.issuerKey] ?? { bg: "#000080", text: "#fff", label: "CERT" };

  return (
    <div
      style={{
        width: "48px",
        height: "48px",
        backgroundColor: theme.bg,
        color: theme.text,
        border: "1px solid #777",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "8px",
        fontWeight: "bold",
        lineHeight: "1.1",
        letterSpacing: "0.5px",
        flexShrink: 0,
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "14px" }}>📜</span>
      <span>{theme.label}</span>
    </div>
  );
}

function CertificateRow({ cert }: { cert: Certification }) {
  const tHome = useTranslations("HomePage.certificationsSection");
  const tOs = useTranslations("OS.certificates");

  const title = tHome(`items.${cert.titleKey}.title`);
  const description = tHome(`items.${cert.titleKey}.description`);
  const issuerName = tHome(`issuers.${cert.issuerKey}`);

  return (
    <GroupBox
      label={`🎖️ ${cert.issuer} // ${cert.category.toUpperCase()}`}
      style={{ marginBottom: "10px", background: "#f8f8f8" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "2px 0" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <IssuerEmblem cert={cert} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                margin: "0 0 2px 0",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#000080",
                fontFamily: "ms_sans_serif, sans-serif",
              }}
            >
              {title}
            </h4>
            <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "#555", fontWeight: "bold" }}>
              {tOs("issuer")} {issuerName}
            </p>
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.4", color: "#222" }}>
              {description}
            </p>
          </div>
        </div>

        {/* Skill Tags */}
        {cert.skills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "2px" }}>
            {cert.skills.map((skill) => {
              const url = getSkillUrl(skill);
              const badge = (
                <Frame
                  variant="well"
                  style={{
                    padding: "1px 5px",
                    fontSize: "9px",
                    fontWeight: "bold",
                    background: "#ffffff",
                    fontFamily: "ms_sans_serif, sans-serif",
                    cursor: url ? "pointer" : "default",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                  className={url ? "hover:bg-neutral-200" : ""}
                >
                  <bdi dir="ltr">{skill}</bdi>
                </Frame>
              );

              if (url) {
                return (
                  <a
                    key={skill}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`Visit official ${skill} website`}
                    onClick={() => playFx("click")}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {badge}
                  </a>
                );
              }

              return <React.Fragment key={skill}>{badge}</React.Fragment>;
            })}
          </div>
        )}

        <Separator style={{ margin: "2px 0" }} />

        {/* Actions */}
        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end", alignItems: "center" }}>
          <Button size="sm" onClick={() => openExternalLink(cert.pdfPath)} style={{ fontSize: "10px" }}>
            📄 {tOs("openPdf")}
          </Button>
          <Button
            size="sm"
            primary
            onClick={() => openExternalLink(cert.verificationUrl)}
            style={{ fontSize: "10px", fontWeight: "bold" }}
          >
            🔗 {tOs("verifyOnline")} ↗
          </Button>
        </div>
      </div>
    </GroupBox>
  );
}

interface CertificatesWindowProps {
  isOpen: boolean;
  onClose: () => void;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
}

export default function CertificatesWindow({
  isOpen,
  onClose,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
}: CertificatesWindowProps) {
  const t = useTranslations("OS");
  const tHome = useTranslations("HomePage.certificationsSection");
  const [activeCategory, setActiveCategory] = useState<CertificateCategory>("all");

  if (!isOpen) return null;

  const filteredCertificates =
    activeCategory === "all"
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.category === activeCategory);

  const handleCategoryClick = (catId: CertificateCategory) => {
    playFx("click");
    setActiveCategory(catId);
  };

  return (
    <WindowFrame
      isOpen={isOpen}
      onClose={onClose}
      isMinimized={isMinimized}
      isActive={isActive}
      onFocus={onFocus}
      zIndex={zIndex}
      icon={<FileText variant="16x16_4" style={{ width: "16px", height: "16px" }} />}
      title={t("certificates.windowTitle")}
      initialX={125}
      initialY={45}
      defaultWidth={680}
      defaultHeight={520}
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
          {t("certificates.address")}
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
          <FileText variant="16x16_4" style={{ width: "16px", height: "16px", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", fontWeight: "bold", fontFamily: "ms_sans_serif, sans-serif" }}>
            {t("certificates.title")}
          </span>
        </Frame>
      </div>

      <Separator style={{ margin: 0 }} />

      {/* Category Filter Bar */}
      <div
        style={{
          padding: "4px 6px",
          display: "flex",
          gap: "4px",
          flexWrap: "wrap",
          background: "#ece9d8",
          alignItems: "center",
        }}
      >
        {CERTIFICATE_CATEGORIES.map((cat) => {
          const isActiveTab = activeCategory === cat.id;
          const count =
            cat.id === "all"
              ? CERTIFICATIONS.length
              : CERTIFICATIONS.filter((c) => c.category === cat.id).length;

          return (
            <Button
              key={cat.id}
              size="sm"
              active={isActiveTab}
              onClick={() => handleCategoryClick(cat.id)}
              style={{
                fontSize: "10px",
                fontWeight: isActiveTab ? "bold" : "normal",
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <span>{cat.icon}</span>
              <span>
                {cat.id === "all"
                  ? `${t("certificates.filterAll")} (${count})`
                  : `${tHome(cat.labelKey)} (${count})`}
              </span>
            </Button>
          );
        })}
      </div>

      <WindowContent
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          padding: "6px",
        }}
      >
        <ScrollView
          style={{
            background: "#fff",
            height: "100%",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            {filteredCertificates.map((cert) => (
              <CertificateRow key={cert.id} cert={cert} />
            ))}
          </div>
        </ScrollView>
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
          {t("certificates.itemsCount", { count: filteredCertificates.length })}
        </Frame>
        <Frame
          variant="well"
          style={{
            width: "110px",
            padding: "2px 6px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#000080",
          }}
        >
          {t("certificates.statusVerified")}
        </Frame>
      </div>
    </WindowFrame>
  );
}
