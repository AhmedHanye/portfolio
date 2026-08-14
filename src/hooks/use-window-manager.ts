"use client";

import { useReducer } from "react";
import { playFx } from "@/lib/sound";

export type WindowId = "system" | "about" | "skills" | "projects" | "cDrive" | "explorer";

export interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

export type WindowsState = Record<WindowId, WindowState>;

interface WindowManagerState {
  windows: WindowsState;
  activeWindowId: WindowId | null;
  topZIndex: number;
}

type WindowAction =
  | { type: "OPEN_WINDOW"; id: WindowId }
  | { type: "CLOSE_WINDOW"; id: WindowId }
  | { type: "FOCUS_WINDOW"; id: WindowId }
  | { type: "TOGGLE_MINIMIZE"; id: WindowId };

export interface WindowManager {
  windows: WindowsState;
  activeWindowId: WindowId | null;
  openWindow: (id: WindowId) => void;
  closeWindow: (id: WindowId) => void;
  toggleMinimize: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
}

const INITIAL_WINDOWS: WindowsState = {
  system: { isOpen: false, isMinimized: false, zIndex: 10 },
  about: { isOpen: false, isMinimized: false, zIndex: 10 },
  skills: { isOpen: false, isMinimized: false, zIndex: 10 },
  projects: { isOpen: false, isMinimized: false, zIndex: 10 },
  cDrive: { isOpen: false, isMinimized: false, zIndex: 10 },
  explorer: { isOpen: false, isMinimized: false, zIndex: 10 },
};

const INITIAL_STATE: WindowManagerState = {
  windows: INITIAL_WINDOWS,
  activeWindowId: null,
  topZIndex: 10,
};

function windowManagerReducer(
  state: WindowManagerState,
  action: WindowAction,
): WindowManagerState {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const nextZ = state.topZIndex + 1;
      return {
        topZIndex: nextZ,
        activeWindowId: action.id,
        windows: {
          ...state.windows,
          [action.id]: { isOpen: true, isMinimized: false, zIndex: nextZ },
        },
      };
    }

    case "FOCUS_WINDOW": {
      const nextZ = state.topZIndex + 1;
      return {
        topZIndex: nextZ,
        activeWindowId: action.id,
        windows: {
          ...state.windows,
          [action.id]: {
            ...state.windows[action.id],
            isMinimized: false,
            zIndex: nextZ,
          },
        },
      };
    }

    case "CLOSE_WINDOW": {
      const updatedWindows = {
        ...state.windows,
        [action.id]: { ...state.windows[action.id], isOpen: false },
      };

      const openIds = (Object.keys(updatedWindows) as WindowId[]).filter(
        (key) =>
          updatedWindows[key].isOpen &&
          !updatedWindows[key].isMinimized &&
          key !== action.id,
      );

      let nextActive: WindowId | null = null;
      if (openIds.length > 0) {
        openIds.sort((a, b) => updatedWindows[b].zIndex - updatedWindows[a].zIndex);
        nextActive = openIds[0];
      }

      return {
        ...state,
        windows: updatedWindows,
        activeWindowId: nextActive,
      };
    }

    case "TOGGLE_MINIMIZE": {
      const target = state.windows[action.id];
      if (target.isMinimized) {
        const nextZ = state.topZIndex + 1;
        return {
          topZIndex: nextZ,
          activeWindowId: action.id,
          windows: {
            ...state.windows,
            [action.id]: { ...target, isMinimized: false, zIndex: nextZ },
          },
        };
      }

      if (state.activeWindowId === action.id) {
        const updatedWindows = {
          ...state.windows,
          [action.id]: { ...target, isMinimized: true },
        };

        const openIds = (Object.keys(updatedWindows) as WindowId[]).filter(
          (key) => updatedWindows[key].isOpen && !updatedWindows[key].isMinimized,
        );

        let nextActive: WindowId | null = null;
        if (openIds.length > 0) {
          openIds.sort((a, b) => updatedWindows[b].zIndex - updatedWindows[a].zIndex);
          nextActive = openIds[0];
        }

        return {
          ...state,
          windows: updatedWindows,
          activeWindowId: nextActive,
        };
      }

      // Open in background -> bring to front
      const nextZ = state.topZIndex + 1;
      return {
        topZIndex: nextZ,
        activeWindowId: action.id,
        windows: {
          ...state.windows,
          [action.id]: { ...target, isMinimized: false, zIndex: nextZ },
        },
      };
    }

    default:
      return state;
  }
}

export function useWindowManager(): WindowManager {
  const [state, dispatch] = useReducer(windowManagerReducer, INITIAL_STATE);

  const focusWindow = (id: WindowId) => {
    dispatch({ type: "FOCUS_WINDOW", id });
  };

  const openWindow = (id: WindowId) => {
    playFx("open");
    dispatch({ type: "OPEN_WINDOW", id });
  };

  const closeWindow = (id: WindowId) => {
    playFx("close");
    dispatch({ type: "CLOSE_WINDOW", id });
  };

  const toggleMinimize = (id: WindowId) => {
    const win = state.windows[id];
    if (win.isMinimized) {
      playFx("open");
    } else if (state.activeWindowId === id) {
      playFx("minimize");
    }
    dispatch({ type: "TOGGLE_MINIMIZE", id });
  };

  return {
    windows: state.windows,
    activeWindowId: state.activeWindowId,
    openWindow,
    closeWindow,
    toggleMinimize,
    focusWindow,
  };
}
