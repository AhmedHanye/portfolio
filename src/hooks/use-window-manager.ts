"use client";

import { useReducer } from "react";
import { playFx } from "@/lib/sound";

export type WindowId =
  | "system"
  | "about"
  | "skills"
  | "projects"
  | "certifications"
  | "cDrive"
  | "explorer"
  | "resume";

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
  certifications: { isOpen: false, isMinimized: false, zIndex: 10 },
  cDrive: { isOpen: false, isMinimized: false, zIndex: 10 },
  explorer: { isOpen: false, isMinimized: false, zIndex: 10 },
  resume: { isOpen: false, isMinimized: false, zIndex: 10 },
};

const INITIAL_STATE: WindowManagerState = {
  windows: INITIAL_WINDOWS,
  activeWindowId: null,
  topZIndex: 10,
};

function findTopmostWindowId(
  windows: WindowsState,
  excludeId?: WindowId,
): WindowId | null {
  const openIds = (Object.keys(windows) as WindowId[]).filter(
    (key) => windows[key].isOpen && !windows[key].isMinimized && key !== excludeId,
  );
  if (openIds.length === 0) return null;
  openIds.sort((a, b) => windows[b].zIndex - windows[a].zIndex);
  return openIds[0];
}

function reduceOpenWindow(state: WindowManagerState, id: WindowId): WindowManagerState {
  const nextZ = state.topZIndex + 1;
  return {
    topZIndex: nextZ,
    activeWindowId: id,
    windows: {
      ...state.windows,
      [id]: { isOpen: true, isMinimized: false, zIndex: nextZ },
    },
  };
}

function reduceFocusWindow(state: WindowManagerState, id: WindowId): WindowManagerState {
  const nextZ = state.topZIndex + 1;
  return {
    topZIndex: nextZ,
    activeWindowId: id,
    windows: {
      ...state.windows,
      [id]: {
        ...state.windows[id],
        isMinimized: false,
        zIndex: nextZ,
      },
    },
  };
}

function reduceCloseWindow(state: WindowManagerState, id: WindowId): WindowManagerState {
  const updatedWindows = {
    ...state.windows,
    [id]: { ...state.windows[id], isOpen: false },
  };
  return {
    ...state,
    windows: updatedWindows,
    activeWindowId: findTopmostWindowId(updatedWindows, id),
  };
}

function reduceToggleMinimize(state: WindowManagerState, id: WindowId): WindowManagerState {
  const target = state.windows[id];
  if (target.isMinimized) {
    return reduceFocusWindow(state, id);
  }

  if (state.activeWindowId === id) {
    const updatedWindows = {
      ...state.windows,
      [id]: { ...target, isMinimized: true },
    };
    return {
      ...state,
      windows: updatedWindows,
      activeWindowId: findTopmostWindowId(updatedWindows),
    };
  }

  return reduceFocusWindow(state, id);
}

const ACTION_REDUCERS: {
  [K in WindowAction["type"]]: (
    state: WindowManagerState,
    action: Extract<WindowAction, { type: K }>,
  ) => WindowManagerState;
} = {
  OPEN_WINDOW: (state, action) => reduceOpenWindow(state, action.id),
  FOCUS_WINDOW: (state, action) => reduceFocusWindow(state, action.id),
  CLOSE_WINDOW: (state, action) => reduceCloseWindow(state, action.id),
  TOGGLE_MINIMIZE: (state, action) => reduceToggleMinimize(state, action.id),
};

function windowManagerReducer(
  state: WindowManagerState,
  action: WindowAction,
): WindowManagerState {
  const handler = ACTION_REDUCERS[action.type] as (
    state: WindowManagerState,
    action: WindowAction,
  ) => WindowManagerState;
  return handler ? handler(state, action) : state;
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
