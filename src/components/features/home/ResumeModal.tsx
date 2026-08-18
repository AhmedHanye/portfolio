"use client";

import React, { useRef, useEffect } from "react";
import {
  Window,
  WindowHeader,
  Button,
} from "react95";
import { Printer } from "@react95/icons";
import { useTranslations } from "next-intl";
import { playFx } from "@/lib/sound";
import { openResumeInNewTab } from "@/lib/print-resume";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ModalHeader({
  title,
  onClose,
  closeLabel,
  onOpenNewTab,
  newTabLabel,
}: {
  title: string;
  onClose: () => void;
  closeLabel: string;
  onOpenNewTab: () => void;
  newTabLabel: string;
}) {
  return (
    <WindowHeader
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 6px",
        userSelect: "none",
      }}
    >
      <span
        id="resume-modal-title"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontWeight: "bold",
          fontSize: "12px",
        }}
      >
        <Printer variant="16x16_4" style={{ width: "16px", height: "16px" }} />
        <span>{title}</span>
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Button
          size="sm"
          square
          onClick={onOpenNewTab}
          title={newTabLabel}
          aria-label={newTabLabel}
        >
          <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>↗</span>
        </Button>
        <Button
          size="sm"
          square
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
        >
          <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>✕</span>
        </Button>
      </div>
    </WindowHeader>
  );
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const t = useTranslations("HomePage.resumeModal");
  const containerRef = useRef<HTMLDialogElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        playFx("close");
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useGSAP(
    () => {
      if (isOpen && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { scale: 0.94, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }
        );
      }
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  if (!isOpen) return null;

  const handleClose = () => {
    playFx("close");
    onCloseRef.current();
  };

  const handleOpenNewTab = () => {
    playFx("click");
    openResumeInNewTab();
  };

  return (
    <dialog
      ref={containerRef}
      open={isOpen}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-transparent w-full h-full max-w-none max-h-none border-0 m-0"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-xs w-full h-full border-0 cursor-default"
        onClick={handleClose}
        aria-label={t("btnClose")}
        tabIndex={-1}
      />
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-4xl h-[92vh] max-h-[900px] flex flex-col"
        style={{ height: "92vh" }}
      >
        <Window
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            padding: "3px",
          }}
          className="shadow-2xl"
        >
          <ModalHeader
            title={t("windowTitle")}
            onClose={handleClose}
            closeLabel={t("btnClose")}
            onOpenNewTab={handleOpenNewTab}
            newTabLabel={t("btnNewTab")}
          />

          <div
            style={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "4px",
              boxSizing: "border-box",
            }}
          >
            <iframe
              src="/resume.pdf#toolbar=1&navpanes=0"
              title="resume.pdf"
              style={{
                width: "100%",
                height: "100%",
                flex: 1,
                border: "1px solid #777",
                backgroundColor: "#525659",
                display: "block",
              }}
            />
          </div>
        </Window>
      </div>
    </dialog>
  );
}
