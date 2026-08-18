"use client";

import React, { useState, type ReactNode } from "react";
import { Window, WindowHeader, Button } from "react95";
import { useLocale } from "next-intl";
import { useCompactViewport } from "@/hooks/use-compact-viewport";
import { useDraggableWindow } from "@/hooks/use-draggable-window";

interface WindowFrameProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  onOpenNewTab?: () => void;
  newTabTitle?: string;
  isMinimized: boolean;
  isActive: boolean;
  onFocus: () => void;
  zIndex: number;
  icon: ReactNode;
  title: string;
  initialX: number;
  initialY: number;
  defaultWidth?: number;
  defaultHeight?: number;
  allowMaximize?: boolean;
  children: ReactNode;
}

function computeWindowDimensions(
  effectiveMaximized: boolean,
  isCompact: boolean,
  defaultWidth: number,
  defaultHeight: number,
): { width: string; height: string } {
  if (effectiveMaximized) {
    return { width: "100%", height: "100%" };
  }
  if (isCompact) {
    return { width: "calc(100% - 16px)", height: "calc(100% - 20px)" };
  }
  return {
    width: `min(${defaultWidth}px, calc(100% - 30px))`,
    height: `min(${defaultHeight}px, calc(100% - 30px))`,
  };
}

function WindowNewTabButton({
  onOpenNewTab,
  title = "Open in New Tab",
}: {
  onOpenNewTab?: () => void;
  title?: string;
}) {
  if (!onOpenNewTab) return null;
  return (
    <Button
      size="sm"
      square
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onOpenNewTab();
      }}
      title={title}
      aria-label={title}
    >
      <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>↗</span>
    </Button>
  );
}

function WindowMinimizeButton({ onMinimize }: { onMinimize?: () => void }) {
  if (!onMinimize) return null;
  return (
    <Button
      size="sm"
      square
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onMinimize();
      }}
      title="Minimize"
    >
      <span style={{ fontWeight: "bold", transform: "translateY(-2px)" }}>_</span>
    </Button>
  );
}

function WindowMaximizeButton({
  show,
  effectiveMaximized,
  onToggleMaximize,
}: {
  show: boolean;
  effectiveMaximized: boolean;
  onToggleMaximize: () => void;
}) {
  if (!show) return null;
  return (
    <Button
      size="sm"
      square
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onToggleMaximize();
      }}
      title={effectiveMaximized ? "Restore" : "Maximize"}
    >
      <span style={{ fontWeight: "bold" }}>{effectiveMaximized ? "❐" : "□"}</span>
    </Button>
  );
}

function WindowCloseButton({ onClose }: { onClose: () => void }) {
  return (
    <Button
      size="sm"
      square
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      title="Close"
    >
      <span style={{ fontWeight: "bold", transform: "translateY(-1px)" }}>✕</span>
    </Button>
  );
}

interface WindowHeaderButtonsProps {
  onOpenNewTab?: () => void;
  newTabTitle?: string;
  onMinimize?: () => void;
  allowMaximize: boolean;
  isCompact: boolean;
  effectiveMaximized: boolean;
  onToggleMaximize: () => void;
  onClose: () => void;
}

function WindowHeaderButtons({
  onOpenNewTab,
  newTabTitle,
  onMinimize,
  allowMaximize,
  isCompact,
  effectiveMaximized,
  onToggleMaximize,
  onClose,
}: WindowHeaderButtonsProps) {
  const showMaximize = allowMaximize && !isCompact;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
      <WindowNewTabButton onOpenNewTab={onOpenNewTab} title={newTabTitle} />
      <WindowMinimizeButton onMinimize={onMinimize} />
      <WindowMaximizeButton
        show={showMaximize}
        effectiveMaximized={effectiveMaximized}
        onToggleMaximize={onToggleMaximize}
      />
      <WindowCloseButton onClose={onClose} />
    </div>
  );
}

function WindowFrameTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontSize: "12px",
        fontWeight: "bold",
      }}
    >
      {icon}
      <span>{title}</span>
    </span>
  );
}

// fallow-ignore-next-line complexity
function WindowFrame({
  isOpen,
  onClose,
  onMinimize,
  onOpenNewTab,
  newTabTitle,
  isMinimized,
  isActive,
  onFocus,
  zIndex,
  icon,
  title,
  initialX,
  initialY,
  defaultWidth = 600,
  defaultHeight = 500,
  allowMaximize = true,
  children,
}: WindowFrameProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { isCompact } = useCompactViewport();
  const [isMaximized, setIsMaximized] = useState(false);

  const effectiveMaximized = allowMaximize && (isMaximized || isCompact);
  const toggleMaximize = () => setIsMaximized((prev) => !prev);

  const { windowRef, headerProps, style: dragStyle } = useDraggableWindow({
    initialX,
    initialY,
    defaultWidth,
    isRtl,
    isMaximized: effectiveMaximized,
    isCompact,
    onFocus,
    onToggleMaximize: allowMaximize ? toggleMaximize : undefined,
  });

  if (!isOpen) return null;

  const { width, height } = computeWindowDimensions(
    effectiveMaximized,
    isCompact,
    defaultWidth,
    defaultHeight,
  );

  return (
    <Window
      ref={windowRef}
      onClick={onFocus}
      style={{
        ...dragStyle,
        width,
        height,
        display: isMinimized ? "none" : "flex",
        flexDirection: "column",
        zIndex,
        boxSizing: "border-box",
      }}
    >
      <WindowHeader
        active={isActive}
        {...headerProps}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          userSelect: "none",
          ...headerProps.style,
        }}
      >
        <WindowFrameTitle icon={icon} title={title} />
        <WindowHeaderButtons
          onOpenNewTab={onOpenNewTab}
          newTabTitle={newTabTitle}
          onMinimize={onMinimize}
          allowMaximize={allowMaximize}
          isCompact={isCompact}
          effectiveMaximized={effectiveMaximized}
          onToggleMaximize={toggleMaximize}
          onClose={onClose}
        />
      </WindowHeader>
      {children}
    </Window>
  );
}

export default WindowFrame;
