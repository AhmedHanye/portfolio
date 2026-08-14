"use client";

import { useState, useRef, useEffect, type CSSProperties, type PointerEvent, type MouseEvent, type RefObject } from "react";

interface UseDraggableWindowOptions {
  initialX: number;
  initialY: number;
  isRtl?: boolean;
  isMaximized?: boolean;
  isCompact?: boolean;
  onFocus?: () => void;
  onToggleMaximize?: () => void;
  defaultWidth?: number;
}

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  containerWidth: number;
  containerHeight: number;
  winWidth: number;
}

export interface UseDraggableWindowReturn {
  position: { x: number; y: number };
  isDragging: boolean;
  windowRef: RefObject<HTMLDivElement | null>;
  headerProps: {
    onPointerDown: (e: PointerEvent<HTMLElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLElement>) => void;
    onPointerUp: (e: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (e: PointerEvent<HTMLElement>) => void;
    onDoubleClick: (e: MouseEvent<HTMLElement>) => void;
    style: CSSProperties;
  };
  style: CSSProperties;
  resetPosition: () => void;
}

export function useDraggableWindow({
  initialX,
  initialY,
  isRtl = false,
  isMaximized = false,
  isCompact = false,
  onFocus,
  onToggleMaximize,
  defaultWidth = 600,
}: UseDraggableWindowOptions): UseDraggableWindowReturn {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>(() => ({
    x: initialX,
    y: initialY,
  }));

  const effectiveMaximized = isMaximized || isCompact;

  // Initialize position for RTL when container width is known on mount
  useEffect(() => {
    if (isRtl && typeof window !== "undefined") {
      const container = windowRef.current?.parentElement;
      const containerWidth = container?.clientWidth || window.innerWidth;
      const winWidth = windowRef.current?.clientWidth || defaultWidth;
      const rtlX = Math.max(10, containerWidth - winWidth - initialX);
      setPosition({ x: rtlX, y: initialY });
    }
  }, [isRtl, initialX, initialY, defaultWidth]);

  const resetPosition = () => {
    if (isRtl && typeof window !== "undefined") {
      const container = windowRef.current?.parentElement;
      const containerWidth = container?.clientWidth || window.innerWidth;
      const winWidth = windowRef.current?.clientWidth || defaultWidth;
      const rtlX = Math.max(10, containerWidth - winWidth - initialX);
      setPosition({ x: rtlX, y: initialY });
    } else {
      setPosition({ x: initialX, y: initialY });
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    // Only drag on primary mouse button or touch
    if (e.button !== 0 || effectiveMaximized) return;

    const target = e.target as HTMLElement;
    if (target.closest("button, input, select, textarea, a, [role='button']")) {
      return;
    }

    onFocus?.();

    const currentHeader = e.currentTarget;
    try {
      currentHeader.setPointerCapture(e.pointerId);
    } catch {
      // Safe fallback if setPointerCapture is unsupported
    }

    const container =
      currentHeader.closest(".win95-screen-container") ||
      currentHeader.parentElement?.parentElement;
    const containerRect = container?.getBoundingClientRect();
    const winEl = windowRef.current || currentHeader.parentElement;
    const winRect = winEl?.getBoundingClientRect();

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
      containerWidth: containerRect?.width || window.innerWidth,
      containerHeight: containerRect?.height || window.innerHeight,
      winWidth: winRect?.width || defaultWidth,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const {
      startX,
      startY,
      origX,
      origY,
      containerWidth,
      containerHeight,
      winWidth,
    } = dragRef.current;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let nextX = origX + dx;
    let nextY = origY + dy;

    // Clamping logic:
    // Top: header cannot go above top bounds (0)
    // Bottom: ensure header (35px) remains reachable above bottom taskbar
    const maxY = Math.max(0, containerHeight - 35);
    nextY = Math.max(0, Math.min(nextY, maxY));

    // Horizontal: ensure at least 80px remains reachable on screen
    const minX = -winWidth + 80;
    const maxX = Math.max(0, containerWidth - 80);
    nextX = Math.max(minX, Math.min(nextX, maxX));

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  const handleDoubleClick = (e: MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, input, select, textarea, a, [role='button']")) {
      return;
    }
    if (!isCompact && onToggleMaximize) {
      onToggleMaximize();
    }
  };

  const windowStyle: CSSProperties = effectiveMaximized
    ? {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      }
    : {
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: "auto",
        bottom: "auto",
      };

  return {
    position,
    isDragging,
    windowRef,
    headerProps: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerUp,
      onDoubleClick: handleDoubleClick,
      style: {
        cursor: effectiveMaximized ? "default" : isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      },
    },
    style: windowStyle,
    resetPosition,
  };
}
