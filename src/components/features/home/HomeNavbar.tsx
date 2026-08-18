"use client";

import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Button, Frame, Separator } from "react95";
import {
  Computer,
  Folder,
  FileText,
  Globe,
  MediaAudio,
  Mute,
  Printer,
  Progman11,
  Wordpad,
} from "@react95/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { playFx, useSoundState } from "@/lib/sound";

function NavBrand({ brandText }: { brandText: string }) {
  return (
    <Button
      size="sm"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        playFx("click");
      }}
      style={{
        fontWeight: "bold",
        fontSize: "12px",
        fontFamily: "ms_sans_serif, sans-serif",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: "26px",
        padding: "0 8px",
      }}
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <Computer variant="16x16_4" style={{ width: "16px", height: "16px" }} />
      <span>{brandText}</span>
    </Button>
  );
}

interface NavLinksProps {
  aboutLabel: string;
  projectsLabel: string;
  skillsLabel: string;
  certificationsLabel: string;
  contactLabel: string;
  activeSection: string | null;
  onScrollTo: (id: string) => (e: React.MouseEvent) => void;
}

function NavLinks({
  aboutLabel,
  projectsLabel,
  skillsLabel,
  certificationsLabel,
  contactLabel,
  activeSection,
  onScrollTo,
}: NavLinksProps) {
  const links = [
    {
      id: "about",
      label: aboutLabel,
      icon: <Wordpad variant="16x16_4" style={{ width: "14px", height: "14px" }} />,
    },
    {
      id: "projects",
      label: projectsLabel,
      icon: <Folder variant="16x16_4" style={{ width: "14px", height: "14px" }} />,
    },
    {
      id: "skills",
      label: skillsLabel,
      icon: <Progman11 variant="32x32_4" style={{ width: "14px", height: "14px" }} />,
    },
    {
      id: "certifications",
      label: certificationsLabel,
      icon: <FileText variant="16x16_4" style={{ width: "14px", height: "14px" }} />,
    },
    {
      id: "contact",
      label: contactLabel,
      icon: <Globe variant="16x16_4" style={{ width: "14px", height: "14px" }} />,
    },
  ];

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3px",
        flexWrap: "wrap",
      }}
      aria-label="Main Navigation"
    >
      {links.map((link) => (
        <Button
          key={link.id}
          variant="menu"
          size="sm"
          active={activeSection === link.id}
          onClick={onScrollTo(link.id)}
          style={{
            fontSize: "12px",
            padding: "0 7px",
            height: "26px",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {link.icon}
          <span>{link.label}</span>
        </Button>
      ))}
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
  resumeLabel,
  locale,
  muted,
  time,
  soundMuteLabel,
  soundUnmuteLabel,
  onLanguageToggle,
  onSoundToggle,
  onOpenResume,
}: {
  launch3dLabel: string;
  resumeLabel: string;
  locale: string;
  muted: boolean;
  time: string;
  soundMuteLabel: string;
  soundUnmuteLabel: string;
  onLanguageToggle: () => void;
  onSoundToggle: () => void;
  onOpenResume?: () => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {onOpenResume && (
        <Button
          size="sm"
          onClick={() => {
            playFx("click");
            onOpenResume();
          }}
          style={{
            fontWeight: "bold",
            fontSize: "11px",
            color: "#000080",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            height: "26px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Printer variant="16x16_4" style={{ width: "14px", height: "14px" }} />
          <span>{resumeLabel}</span>
        </Button>
      )}

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
            height: "26px",
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
        {time && (
          <span
            style={{
              fontSize: "11px",
              fontFamily: "ms_sans_serif, sans-serif",
              lineHeight: 1,
              color: "#000",
              paddingLeft: "2px",
              paddingRight: "2px",
              userSelect: "none",
            }}
          >
            {time}
          </span>
        )}
      </Frame>
    </div>
  );
}

const SECTION_IDS = ["about", "projects", "skills", "certifications", "contact"] as const;

function isElementActive(id: string, scrollPos: number): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const top = el.offsetTop;
  return scrollPos >= top && scrollPos < top + el.offsetHeight;
}

function getActiveSection(scrollPos: number): string | null {
  return SECTION_IDS.find((id) => isElementActive(id, scrollPos)) ?? null;
}

interface HomeNavbarProps {
  onOpenResume?: () => void;
}

export default function HomeNavbar({ onOpenResume }: HomeNavbarProps) {
  const t = useTranslations("HomePage.nav");
  const tHero = useTranslations("HomePage.hero");
  const locale = useLocale();
  const router = useRouter();
  const { muted, toggle: toggleSound } = useSoundState();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        setActiveSection(getActiveSection(window.scrollY + 100));
        rafId = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

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
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 46;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
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
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            <NavBrand brandText={t("brand")} />
            <Separator orientation="vertical" size="20px" />
            <NavLinks
              aboutLabel={t("about")}
              projectsLabel={t("projects")}
              skillsLabel={t("skills")}
              certificationsLabel={t("certifications")}
              contactLabel={t("contact")}
              activeSection={activeSection}
              onScrollTo={handleScrollTo}
            />
          </div>
          <NavControls
            launch3dLabel={t("launch3d")}
            resumeLabel={tHero("btnResume")}
            locale={locale}
            muted={muted}
            time={time}
            soundMuteLabel={t("soundMute")}
            soundUnmuteLabel={t("soundUnmute")}
            onLanguageToggle={handleLanguageToggle}
            onSoundToggle={handleSoundToggle}
            onOpenResume={onOpenResume}
          />
        </Toolbar>
      </AppBar>
    </header>
  );
}
