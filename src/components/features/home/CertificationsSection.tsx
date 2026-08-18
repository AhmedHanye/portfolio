"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Frame,
  GroupBox,
  Separator,
} from "react95";
import { FileText } from "@react95/icons";
import { useTranslations } from "next-intl";
import { playFx } from "@/lib/sound";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import {
  CERTIFICATIONS,
  CERTIFICATE_CATEGORIES,
  ISSUER_THEMES,
  type CertificateCategory,
  type Certification,
} from "@/lib/constants/certifications";
import { getSkillUrl } from "@/lib/constants/skills";

function IssuerLogoBadge({ cert }: { cert: Certification }) {
  if (cert.badgeImage) {
    return (
      <div
        className="relative shrink-0 flex items-center justify-center p-1 bg-white border border-neutral-300 shadow-inner"
        style={{ width: "56px", height: "56px" }}
      >
        <Image
          src={cert.badgeImage}
          alt={cert.issuer}
          width={48}
          height={48}
          className="object-contain max-h-full max-w-full"
          unoptimized
        />
      </div>
    );
  }

  const theme = ISSUER_THEMES[cert.issuerKey] ?? { bg: "#000080", text: "#fff", label: "CERT" };

  return (
    <div
      className="shrink-0 flex flex-col items-center justify-center p-1 border border-neutral-400 font-bold shadow-inner text-center"
      style={{
        width: "56px",
        height: "56px",
        backgroundColor: theme.bg,
        color: theme.text,
        fontSize: "9px",
        lineHeight: "1.1",
        letterSpacing: "0.5px",
      }}
    >
      <span className="text-base mb-0.5">📜</span>
      <span>{theme.label}</span>
    </div>
  );
}

function CertificateCard({ cert }: { cert: Certification }) {
  const t = useTranslations("HomePage.certificationsSection");

  const handleOpenExternal = (url: string) => {
    playFx("click");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const title = t(`items.${cert.titleKey}.title`);
  const description = t(`items.${cert.titleKey}.description`);
  const issuerName = t(`issuers.${cert.issuerKey}`);

  return (
    <GroupBox
      label={`🎖️ ${cert.issuer} // ${cert.category.toUpperCase()}`}
      style={{
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="flex flex-col justify-between h-full gap-3 p-1">
        <div className="flex items-start gap-3">
          <IssuerLogoBadge cert={cert} />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#000080] leading-snug m-0">
              {title}
            </h3>
            <p className="text-xs text-neutral-600 font-semibold mt-0.5 mb-1">
              <span className="text-neutral-500">{t("issuerLabel")}</span> {issuerName}
            </p>
            <p className="text-xs text-neutral-800 leading-relaxed m-0">
              {description}
            </p>
          </div>
        </div>

        {/* Skill Tags */}
        {cert.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {cert.skills.map((skill) => {
              const url = getSkillUrl(skill);
              const badge = (
                <Frame
                  variant="well"
                  style={{
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    backgroundColor: "#ffffff",
                    color: "#333",
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

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 flex-wrap pt-1">
          <Button
            size="sm"
            onClick={() => handleOpenExternal(cert.pdfPath)}
            style={{ fontSize: "11px", fontWeight: "bold" }}
          >
            📄 {t("viewPdf")}
          </Button>

          <Button
            size="sm"
            primary
            onClick={() => handleOpenExternal(cert.verificationUrl)}
            style={{ fontSize: "11px", fontWeight: "bold" }}
          >
            🔗 {t("verifyOnline")} ↗
          </Button>
        </div>
      </div>
    </GroupBox>
  );
}

export default function CertificationsSection() {
  const t = useTranslations("HomePage.certificationsSection");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<CertificateCategory>("all");

  useGSAP(
    () => {
      gsap.from(".certifications-window", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  const filteredCertifications =
    activeCategory === "all"
      ? CERTIFICATIONS
      : CERTIFICATIONS.filter((c) => c.category === activeCategory);

  const handleCategorySelect = (cat: CertificateCategory) => {
    playFx("click");
    setActiveCategory(cat);
  };

  return (
    <section
      ref={containerRef}
      id="certifications"
      className="w-full max-w-5xl mx-auto px-4 py-8"
      aria-label="Professional Certifications & Accreditations"
    >
      <Window className="certifications-window w-full shadow-2xl border-2 border-neutral-700">
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
            color: "#fff",
            padding: "3px 6px",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            <FileText variant="32x32_4" style={{ width: "16px", height: "16px" }} />
            <span>{t("windowTitle")}</span>
          </span>
        </WindowHeader>

        <WindowContent style={{ padding: "16px" }}>
          <div className="flex flex-col gap-6">
            {/* Section Heading & Subheading */}
            <div>
              <span className="text-xs font-bold text-[#000080] bg-blue-100 px-2 py-0.5 border border-blue-300">
                {t("badge")}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2 mb-1">
                {t("heading")}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-700 m-0 leading-relaxed">
                {t("subheading")}
              </p>
            </div>

            {/* Category Filter Toolbar */}
            <Frame
              variant="field"
              style={{
                backgroundColor: "#f0f0f0",
                padding: "8px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                alignItems: "center",
              }}
            >
              <span className="text-xs font-bold text-neutral-700 me-2 flex items-center gap-1">
                🔍 <span>{t("filterLabel")}</span>
              </span>

              {CERTIFICATE_CATEGORIES.map((cat) => {
                const count =
                  cat.id === "all"
                    ? CERTIFICATIONS.length
                    : CERTIFICATIONS.filter((c) => c.category === cat.id).length;
                const isActive = activeCategory === cat.id;

                return (
                  <Button
                    key={cat.id}
                    size="sm"
                    active={isActive}
                    onClick={() => handleCategorySelect(cat.id)}
                    style={{
                      fontSize: "11px",
                      fontWeight: isActive ? "bold" : "normal",
                      padding: "2px 8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>
                      {cat.id === "all"
                        ? t("catAll", { count })
                        : `${t(cat.labelKey)} (${count})`}
                    </span>
                  </Button>
                );
              })}
            </Frame>

            {/* Certifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCertifications.map((cert) => (
                <CertificateCard key={cert.id} cert={cert} />
              ))}
            </div>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
