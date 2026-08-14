export function useScreenContent() {
  // In 3D space, the CRT monitor mesh always renders the animated BotFace.
  // The full-page Windows 95 OS overlay is mounted outside the Canvas in WorkspaceSpline.
  return "bot-face" as const;
}
