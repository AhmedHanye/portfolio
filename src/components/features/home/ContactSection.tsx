"use client";

import React, { useRef, useState } from "react";
import {
  Window,
  WindowHeader,
  WindowContent,
  Button,
  Frame,
  GroupBox,
  Separator,
} from "react95";
import { Wordpad, Computer } from "@react95/icons";
import { useTranslations } from "next-intl";
import { playFx } from "@/lib/sound";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface ContactFieldProps {
  label: string;
  displayValue: React.ReactNode;
  copyValue: string;
  copyLabel: string;
  copiedToast: string;
  actionLabel: string;
  actionIcon: string;
  onAction: () => void;
}

function ContactField({
  label,
  displayValue,
  copyValue,
  copyLabel,
  copiedToast,
  actionLabel,
  actionIcon,
  onAction,
}: ContactFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playFx("open");
    navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 3500);
  };

  return (
    <GroupBox label={label} style={{ backgroundColor: "#fafafa" }}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
        <Frame
          variant="field"
          className="w-full sm:flex-1 p-2 bg-white text-xs sm:text-sm font-mono font-bold text-[#000080]"
        >
          {displayValue}
        </Frame>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={handleCopy}
            style={{ fontWeight: "bold", fontSize: "12px", minWidth: "100px" }}
          >
            {copied ? "✓ Copied!" : copyLabel}
          </Button>

          <Button
            primary
            onClick={onAction}
            style={{ fontWeight: "bold", fontSize: "12px" }}
          >
            {actionIcon} {actionLabel}
          </Button>
        </div>
      </div>

      {copied && (
        <div className="px-2 pb-1 text-xs text-emerald-700 font-bold animate-fade-in">
          {copiedToast}
        </div>
      )}
    </GroupBox>
  );
}

function OnlineProfiles({
  label,
  githubLabel,
  linkedinLabel,
  onOpenLink,
}: {
  label: string;
  githubLabel: string;
  linkedinLabel: string;
  onOpenLink: (url: string) => void;
}) {
  return (
    <GroupBox label={`🌐 ${label}`}>
      <div className="flex flex-col gap-2 p-1">
        <Button
          onClick={() => onOpenLink("https://github.com/AhmedHanye")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "flex-start",
            fontSize: "12px",
            padding: "6px 12px",
          }}
        >
          <Computer variant="16x16_4" style={{ width: "16px", height: "16px" }} />
          <span className="font-bold">{githubLabel}</span>
        </Button>

        <Button
          onClick={() => onOpenLink("https://www.linkedin.com/in/ahmed-hanye/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            justifyContent: "flex-start",
            fontSize: "12px",
            padding: "6px 12px",
          }}
        >
          <Wordpad variant="16x16_4" style={{ width: "16px", height: "16px" }} />
          <span className="font-bold">{linkedinLabel}</span>
        </Button>
      </div>
    </GroupBox>
  );
}

function ResponseSlaBox({
  label,
  activelyInterviewing,
  responseNote,
  location,
}: {
  label: string;
  activelyInterviewing: string;
  responseNote: string;
  location: string;
}) {
  return (
    <GroupBox label={`⚡ ${label}`}>
      <div className="space-y-2 p-1 text-xs sm:text-sm text-neutral-800">
        <div className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-neutral-900">{activelyInterviewing}</span>
        </div>
        <p className="text-xs text-neutral-700 m-0 leading-relaxed">
          {responseNote}
        </p>
        <Separator style={{ margin: "6px 0" }} />
        <p className="text-[11px] text-neutral-700 m-0">
          {location}
        </p>
      </div>
    </GroupBox>
  );
}

export default function ContactSection() {
  const t = useTranslations("HomePage.contact");
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".contact-window", {
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

  const handleSendEmail = () => {
    playFx("click");
    window.location.href = "mailto:ahmedhanyehossny@gmail.com";
  };

  const handleCallPhone = () => {
    playFx("click");
    window.location.href = "tel:+201012362894";
  };

  const handleOpenLink = (url: string) => {
    playFx("click");
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className="w-full max-w-5xl mx-auto px-4 py-8"
      aria-label="Contact and Social Connect"
    >
      <Window className="contact-window w-full shadow-2xl">
        <WindowHeader
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
            <Wordpad variant="16x16_4" style={{ width: "16px", height: "16px" }} />
            <span>{t("windowTitle")}</span>
          </span>
        </WindowHeader>

        <WindowContent style={{ padding: "16px" }}>
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-xs font-bold text-[#000080] bg-blue-100 px-2 py-0.5 border border-blue-300">
                {t("badge")}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mt-2 mb-1">
                {t("heading")}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600">
                {t("subheading")}
              </p>
            </div>

            <ContactField
              label={`📧 ${t("emailLabel")}`}
              displayValue="ahmedhanyehossny@gmail.com"
              copyValue="ahmedhanyehossny@gmail.com"
              copyLabel={t("copyEmail")}
              copiedToast={t("copiedToast")}
              actionLabel={t("sendEmail")}
              actionIcon="✉"
              onAction={handleSendEmail}
            />

            <ContactField
              label={`📱 ${t("phoneLabel")}`}
              displayValue={<bdi dir="ltr">+20 101 236 2894</bdi>}
              copyValue="+201012362894"
              copyLabel={t("copyPhone")}
              copiedToast={t("copiedPhoneToast")}
              actionLabel={t("callPhone")}
              actionIcon="📞"
              onAction={handleCallPhone}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <OnlineProfiles
                label={t("onlineProfiles")}
                githubLabel={t("github")}
                linkedinLabel={t("linkedin")}
                onOpenLink={handleOpenLink}
              />

              <ResponseSlaBox
                label={t("responseSla")}
                activelyInterviewing={t("activelyInterviewing")}
                responseNote={t("responseNote")}
                location={t("location")}
              />
            </div>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
