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

function WindowFrame({
  isOpen,
  onClose,
  onMinimize,
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

  const { windowRef, headerProps, style: dragStyle } = useDraggableWindow({
    initialX,
    initialY,
    defaultWidth,
    isRtl,
    isMaximized: effectiveMaximized,
    isCompact,
    onFocus,
    onToggleMaximize: allowMaximize ? () => setIsMaximized((prev) => !prev) : undefined,
  });

  if (!isOpen) return null;

  return (
    <Window
      ref={windowRef}
      onClick={onFocus}
      style={{
        ...dragStyle,
        width: effectiveMaximized
          ? "100%"
          : isCompact
            ? "calc(100% - 16px)"
            : `min(${defaultWidth}px, calc(100% - 30px))`,
        height: effectiveMaximized
          ? "100%"
          : isCompact
            ? "calc(100% - 20px)"
            : `min(${defaultHeight}px, calc(100% - 30px))`,
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
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "bold",
            fontSize: "12px",
          }}
        >
          {icon}
          <span>{title}</span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {onMinimize && (
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
          )}
          {allowMaximize && !isCompact && (
            <Button
              size="sm"
              square
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIsMaximized((prev) => !prev);
              }}
              title={effectiveMaximized ? "Restore" : "Maximize"}
            >
              <span style={{ fontWeight: "bold" }}>{effectiveMaximized ? "❐" : "□"}</span>
            </Button>
          )}
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
        </div>
      </WindowHeader>
      {children}
    </Window>
  );
}

export default WindowFrame;
