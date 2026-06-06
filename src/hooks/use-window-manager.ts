"use client";

import { useState, useCallback } from "react";

export type WindowId = "system" | "cDrive" | "explorer";

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
}

type WindowsState = Record<WindowId, WindowState>;

interface WindowManager {
  windows: WindowsState;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  toggleMinimize: (id: WindowId) => void;
}

const INITIAL_WINDOWS: WindowsState = {
  system: { isOpen: true, isMinimized: false },
  cDrive: { isOpen: false, isMinimized: false },
  explorer: { isOpen: false, isMinimized: false },
};

export function useWindowManager(): WindowManager {
  const [windows, setWindows] = useState<WindowsState>(INITIAL_WINDOWS);

  const openWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { isOpen: true, isMinimized: false },
    }));
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: false },
    }));
  }, []);

  const toggleMinimize = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], isMinimized: !prev[id].isMinimized },
    }));
  }, []);

  return { windows, openWindow, closeWindow, toggleMinimize };
}
