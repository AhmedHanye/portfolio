"use client";

import React from "react";
import { AppBar, Toolbar, Button, Frame } from "react95";
import { Computer, MediaAudio, Mute } from "@react95/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { playFx, useSoundState } from "@/lib/sound";

function NavBrand({ brandText }: { brandText: string }) {
  return (
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
        <span>{brandText}</span>
      </button>
    </div>
  );
}

function NavLinks({
  aboutLabel,
  projectsLabel,
  skillsLabel,
  contactLabel,
  onScrollTo,
}: {
  aboutLabel: string;
  projectsLabel: string;
  skillsLabel: string;
  contactLabel: string;
  onScrollTo: (id: string) => (e: React.MouseEvent) => void;
}) {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "4px",
        flexWrap: "wrap",
      }}
      aria-label="Main Navigation"
    >
      <Button variant="menu" size="sm" onClick={onScrollTo("about")} style={{ fontSize: "11px" }}>
        {aboutLabel}
      </Button>
      <Button variant="menu" size="sm" onClick={onScrollTo("projects")} style={{ fontSize: "11px" }}>
        {projectsLabel}
      </Button>
      <Button variant="menu" size="sm" onClick={onScrollTo("skills")} style={{ fontSize: "11px" }}>
        {skillsLabel}
      </Button>
      <Button variant="menu" size="sm" onClick={onScrollTo("contact")} style={{ fontSize: "11px" }}>
        {contactLabel}
      </Button>
    </nav>
  );
}

function NavLanguageButton({
  locale,
  onLanguageToggle,
}: {
  locale: string;
  onLanguageToggle: () => void;
}) {
  const isEn = locale === "en";
  const title = isEn ? "تبديل إلى العربية" : "Switch to English";
  const label = isEn ? "AR" : "EN";

  return (
    <Button
      size="sm"
      onClick={onLanguageToggle}
      title={title}
      style={{
        height: "20px",
        padding: "0 4px",
        fontSize: "10px",
        fontWeight: "bold",
        minWidth: "24px",
        lineHeight: 1,
      }}
    >
      {label}
    </Button>
  );
}

function NavSoundButton({
  muted,
  soundMuteLabel,
  soundUnmuteLabel,
  onSoundToggle,
}: {
  muted: boolean;
  soundMuteLabel: string;
  soundUnmuteLabel: string;
  onSoundToggle: () => void;
}) {
  const label = muted ? soundUnmuteLabel : soundMuteLabel;
  const icon = muted ? (
    <Mute variant="16x16_4" style={{ width: "14px", height: "14px" }} />
  ) : (
    <MediaAudio variant="16x16_4" style={{ width: "14px", height: "14px" }} />
  );

  return (
    <button
      type="button"
      onClick={onSoundToggle}
      title={label}
      aria-label={label}
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
      {icon}
    </button>
  );
}

function NavControls({
  launch3dLabel,
  locale,
  muted,
  soundMuteLabel,
  soundUnmuteLabel,
  onLanguageToggle,
  onSoundToggle,
}: {
  launch3dLabel: string;
  locale: string;
  muted: boolean;
  soundMuteLabel: string;
  soundUnmuteLabel: string;
  onLanguageToggle: () => void;
  onSoundToggle: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
          <span>{launch3dLabel}</span>
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
        <NavLanguageButton locale={locale} onLanguageToggle={onLanguageToggle} />
        <NavSoundButton
          muted={muted}
          soundMuteLabel={soundMuteLabel}
          soundUnmuteLabel={soundUnmuteLabel}
          onSoundToggle={onSoundToggle}
        />
      </Frame>
    </div>
  );
}

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
          <NavBrand brandText={t("brand")} />
          <NavLinks
            aboutLabel={t("about")}
            projectsLabel={t("projects")}
            skillsLabel={t("skills")}
            contactLabel={t("contact")}
            onScrollTo={handleScrollTo}
          />
          <NavControls
            launch3dLabel={t("launch3d")}
            locale={locale}
            muted={muted}
            soundMuteLabel={t("soundMute")}
            soundUnmuteLabel={t("soundUnmute")}
            onLanguageToggle={handleLanguageToggle}
            onSoundToggle={handleSoundToggle}
          />
        </Toolbar>
      </AppBar>
    </header>
  );
}
