"use client";

import React from "react";
import { AppBar, Toolbar, Button, Frame } from "react95";
import { Computer, MediaAudio, Mute } from "@react95/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { playFx, useSoundState } from "@/lib/sound";

export default function HomeNavbar() {
  const t = useTranslations("HomePage.nav");
  const locale = useLocale();
  const router = useRouter();
  const { muted, toggle: toggleSound } = useSoundState();

  const handleSoundToggle = () => {
    toggleSound();
    playFx("click");
  };

  const handleLanguageToggle = () => {
    playFx("click");
    const nextLocale = locale === "en" ? "ar" : "en";
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname.replace(/^\/(en|ar)/, "") || "/"
        : "/";
    router.replace(currentPath, { locale: nextLocale });
  };

  const handleScrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    playFx("click");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      <AppBar
        style={{
          position: "static",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          width: "100%",
        }}
      >
        <Toolbar
          style={{
            justifyContent: "space-between",
            padding: "3px 8px",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "6px",
          }}
        >
          {/* Brand / Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Computer variant="16x16_4" style={{ width: "18px", height: "18px" }} />
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                playFx("click");
              }}
              className="cursor-pointer bg-transparent border-0 p-0"
              style={{
                textDecoration: "none",
                color: "#000",
                fontWeight: "bold",
                fontSize: "13px",
                fontFamily: "ms_sans_serif, sans-serif",
                letterSpacing: "0.5px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>{t("brand")}</span>
            </button>
          </div>

          {/* Quick Anchor Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flexWrap: "wrap",
            }}
            aria-label="Main Navigation"
          >
            <Button
              variant="menu"
              size="sm"
              onClick={handleScrollTo("about")}
              style={{ fontSize: "11px" }}
            >
              {t("about")}
            </Button>
            <Button
              variant="menu"
              size="sm"
              onClick={handleScrollTo("projects")}
              style={{ fontSize: "11px" }}
            >
              {t("projects")}
            </Button>
            <Button
              variant="menu"
              size="sm"
              onClick={handleScrollTo("skills")}
              style={{ fontSize: "11px" }}
            >
              {t("skills")}
            </Button>
            <Button
              variant="menu"
              size="sm"
              onClick={handleScrollTo("contact")}
              style={{ fontSize: "11px" }}
            >
              {t("contact")}
            </Button>
          </nav>

          {/* Controls & 3D Launcher Shortcut */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* 3D OS Shortcut Button */}
            <Link href="/interactive-os" prefetch={false} style={{ textDecoration: "none" }}>
              <Button
                size="sm"
                style={{
                  fontWeight: "bold",
                  fontSize: "11px",
                  color: "#000080",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "#ffffdf",
                }}
              >
                <span>⚡</span>
                <span>{t("launch3d")}</span>
              </Button>
            </Link>

            <Frame
              variant="well"
              style={{
                padding: "2px 6px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                height: "26px",
                boxSizing: "border-box",
              }}
            >
              {/* Language Switcher */}
              <Button
                size="sm"
                onClick={handleLanguageToggle}
                title={locale === "en" ? "تبديل إلى العربية" : "Switch to English"}
                style={{
                  height: "20px",
                  padding: "0 4px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  minWidth: "24px",
                  lineHeight: 1,
                }}
              >
                {locale === "en" ? "AR" : "EN"}
              </Button>

              {/* Mute / Unmute Sound */}
              <button
                type="button"
                onClick={handleSoundToggle}
                title={muted ? t("soundUnmute") : t("soundMute")}
                aria-label={muted ? t("soundUnmute") : t("soundMute")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  cursor: "pointer",
                }}
              >
                {muted ? (
                  <Mute variant="16x16_4" style={{ width: "14px", height: "14px" }} />
                ) : (
                  <MediaAudio variant="16x16_4" style={{ width: "14px", height: "14px" }} />
                )}
              </button>
            </Frame>
          </div>
        </Toolbar>
      </AppBar>
    </header>
  );
}
