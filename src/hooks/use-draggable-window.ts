"use client";

import { useState, useRef, type CSSProperties, type PointerEvent, type MouseEvent, type RefObject } from "react";

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

interface DragBounds {
  containerWidth: number;
  containerHeight: number;
  winWidth: number;
}

function calculateRtlPosition(
  container: HTMLElement | null | undefined,
  winEl: HTMLElement | null,
  defaultWidth: number,
  initialX: number,
): number {
  if (typeof window === "undefined") return initialX;
  const containerWidth = container ? container.clientWidth : window.innerWidth;
  const winWidth = winEl ? winEl.clientWidth : defaultWidth;
  return Math.max(10, containerWidth - winWidth - initialX);
}

function isInteractiveTarget(target: HTMLElement): boolean {
  return Boolean(target.closest("button, input, select, textarea, a, [role='button']"));
}

function getContainerElement(header: HTMLElement): HTMLElement | null {
  return (
    (header.closest(".win95-screen-container") as HTMLElement | null) ||
    header.parentElement?.parentElement ||
    null
  );
}

function extractDragBounds(
  header: HTMLElement,
  winEl: HTMLElement | null,
  defaultWidth: number,
): DragBounds {
  const container = getContainerElement(header);
  const containerRect = container?.getBoundingClientRect();
  const winRect = winEl?.getBoundingClientRect();

  return {
    containerWidth: containerRect ? containerRect.width : 1024,
    containerHeight: containerRect ? containerRect.height : 768,
    winWidth: winRect ? winRect.width : defaultWidth,
  };
}

function clampPosition(
  origX: number,
  origY: number,
  dx: number,
  dy: number,
  bounds: DragBounds,
): { x: number; y: number } {
  let nextX = origX + dx;
  let nextY = origY + dy;

  const maxY = Math.max(0, bounds.containerHeight - 35);
  nextY = Math.max(0, Math.min(nextY, maxY));

  const minX = -bounds.winWidth + 80;
  const maxX = Math.max(0, bounds.containerWidth - 80);
  nextX = Math.max(minX, Math.min(nextX, maxX));

  return { x: nextX, y: nextY };
}

function canStartDrag(e: PointerEvent<HTMLElement>, isMaximized: boolean): boolean {
  if (e.button !== 0 || isMaximized) return false;
  return !isInteractiveTarget(e.target as HTMLElement);
}

function capturePointerSafe(element: HTMLElement, pointerId: number): void {
  try {
    element.setPointerCapture(pointerId);
  } catch {
    // Safe fallback
  }
}

function releasePointerSafe(element: HTMLElement, pointerId: number): void {
  try {
    element.releasePointerCapture(pointerId);
  } catch {
    // Safe fallback
  }
}

// fallow-ignore-next-line complexity
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
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (isRtl && typeof window !== "undefined") {
      const containerWidth = window.innerWidth;
      const rtlX = Math.max(10, containerWidth - defaultWidth - initialX);
      return { x: rtlX, y: initialY };
    }
    return { x: initialX, y: initialY };
  });

  const effectiveMaximized = isMaximized || isCompact;

  const resetPosition = () => {
    if (isRtl && typeof window !== "undefined") {
      const rtlX = calculateRtlPosition(
        windowRef.current?.parentElement,
        windowRef.current,
        defaultWidth,
        initialX,
      );
      setPosition({ x: rtlX, y: initialY });
    } else {
      setPosition({ x: initialX, y: initialY });
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!canStartDrag(e, effectiveMaximized)) return;

    onFocus?.();
    const currentHeader = e.currentTarget;
    capturePointerSafe(currentHeader, e.pointerId);

    const bounds = extractDragBounds(
      currentHeader,
      windowRef.current || currentHeader.parentElement,
      defaultWidth,
    );

    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: position.x,
      origY: position.y,
      ...bounds,
    };

    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return;

    const { startX, startY, origX, origY, ...bounds } = dragRef.current;
    const nextPos = clampPosition(
      origX,
      origY,
      e.clientX - startX,
      e.clientY - startY,
      bounds,
    );
    setPosition(nextPos);
  };

  const handlePointerUp = (e: PointerEvent<HTMLElement>) => {
    if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
      releasePointerSafe(e.currentTarget, e.pointerId);
      dragRef.current = null;
      setIsDragging(false);
    }
  };

  const handleDoubleClick = (e: MouseEvent<HTMLElement>) => {
    if (isInteractiveTarget(e.target as HTMLElement)) return;
    if (!isCompact && onToggleMaximize) {
      onToggleMaximize();
    }
  };

  const windowStyle: CSSProperties = effectiveMaximized
    ? { position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }
    : { position: "absolute", left: `${position.x}px`, top: `${position.y}px`, right: "auto", bottom: "auto" };

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
