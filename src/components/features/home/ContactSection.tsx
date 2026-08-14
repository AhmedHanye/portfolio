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

export default function ContactSection() {
  const t = useTranslations("HomePage.contact");
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopyEmail = () => {
    playFx("open");
    navigator.clipboard.writeText("ahmedhanyehossny@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 3500);
  };

  const handleSendEmail = () => {
    playFx("click");
    window.location.href = "mailto:ahmedhanyehossny@gmail.com";
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
            {/* Header badge & title */}
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

            {/* Email Box */}
            <GroupBox label={`📧 ${t("emailLabel")}`} style={{ backgroundColor: "#fafafa" }}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2">
                <Frame
                  variant="field"
                  className="w-full sm:flex-1 p-2 bg-white text-xs sm:text-sm font-mono font-bold text-[#000080]"
                >
                  ahmedhanyehossny@gmail.com
                </Frame>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    onClick={handleCopyEmail}
                    style={{ fontWeight: "bold", fontSize: "12px", minWidth: "100px" }}
                  >
                    {copied ? "✓ Copied!" : t("copyEmail")}
                  </Button>

                  <Button
                    primary
                    onClick={handleSendEmail}
                    style={{ fontWeight: "bold", fontSize: "12px" }}
                  >
                    ✉ {t("sendEmail")}
                  </Button>
                </div>
              </div>

              {copied && (
                <div className="px-2 pb-1 text-xs text-emerald-700 font-bold animate-fade-in">
                  {t("copiedToast")}
                </div>
              )}
            </GroupBox>

            {/* Social Links and Career Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <GroupBox label={`🌐 ${t("onlineProfiles")}`}>
                <div className="flex flex-col gap-2 p-1">
                  <Button
                    onClick={() => handleOpenLink("https://github.com/AhmedHanye")}
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
                    <span className="font-bold">{t("github")}</span>
                  </Button>

                  <Button
                    onClick={() => handleOpenLink("https://www.linkedin.com/in/ahmed-hanye/")}
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
                    <span className="font-bold">{t("linkedin")}</span>
                  </Button>
                </div>
              </GroupBox>

              <GroupBox label={`⚡ ${t("responseSla")}`}>
                <div className="space-y-2 p-1 text-xs sm:text-sm text-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-neutral-900">{t("activelyInterviewing")}</span>
                  </div>
                  <p className="text-xs text-neutral-700 m-0 leading-relaxed">
                    {t("responseNote")}
                  </p>
                  <Separator style={{ margin: "6px 0" }} />
                  <p className="text-[11px] text-neutral-700 m-0">
                    {t("location")}
                  </p>
                </div>
              </GroupBox>
            </div>
          </div>
        </WindowContent>
      </Window>
    </section>
  );
}
