"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { type WindowId } from "@/hooks/use-window-manager";

interface DesktopIconProps {
  src: string;
  alt: string;
  label: string;
  onClick: () => void;
}

function DesktopIcon({ src, alt, label, onClick }: DesktopIconProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "90px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        style={{ pointerEvents: "none" }}
      />
      <span
        style={{
          color: "#fff",
          fontSize: "12px",
          marginTop: "4px",
          textShadow: "1px 1px #000",
          textAlign: "center",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {label}
      </span>
    </div>
  );
}

interface DesktopIconsProps {
  setActiveTab: (tab: number) => void;
  openWindow: (id: WindowId) => void;
}

export default function DesktopIcons({ setActiveTab, openWindow }: DesktopIconsProps) {
  const t = useTranslations("OS");
  const locale = useLocale();
  const isRtl = locale === "ar";

  /**
   * Factory that opens the system window on a specific tab.
   * Replaces 4 near-identical handler functions.
   */
  const handleOpenTab = (tab: number) => () => {
    setActiveTab(tab);
    openWindow("system");
  };

  return (
    <div
      style={{
        position: "absolute",
        left: isRtl ? "auto" : "10px",
        right: isRtl ? "10px" : "auto",
        top: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        zIndex: 1,
      }}
    >
      <DesktopIcon
        src="/icons/computer_32x32.png"
        alt={t("desktop.myComputer")}
        label={t("desktop.myComputer")}
        onClick={handleOpenTab(0)}
      />

      <DesktopIcon
        src="/icons/reader_closed_32x32.png"
        alt={t("desktop.cDrive")}
        label={t("desktop.cDrive")}
        onClick={() => openWindow("cDrive")}
      />

      <DesktopIcon
        src="/icons/mail_32x32.png"
        alt={t("desktop.aboutMe")}
        label={t("desktop.aboutMe")}
        onClick={handleOpenTab(1)}
      />

      <DesktopIcon
        src="/icons/windows_explorer_32x32.png"
        alt={t("desktop.mySkills")}
        label={t("desktop.mySkills")}
        onClick={handleOpenTab(2)}
      />

      <DesktopIcon
        src="/icons/folder_32x32.png"
        alt={t("desktop.myProjects")}
        label={t("desktop.myProjects")}
        onClick={handleOpenTab(3)}
      />
    </div>
  );
}
