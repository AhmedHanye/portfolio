let patched = false;

const IGNORED_WARNING_PATTERNS = [
  "does not support the outline layer",
  "file is more recent than the library",
  "mergeBufferGeometries() has been renamed",
];

function isIgnoredSplineWarning(firstArg: unknown): boolean {
  if (typeof firstArg !== "string") return false;
  return IGNORED_WARNING_PATTERNS.some((pattern) => firstArg.includes(pattern));
}

/**
 * Suppresses known noisy Spline loader warnings that cannot be fixed within the library.
 * Must be called once, client-side only. Subsequent calls are no-ops.
 */
export function suppressSplineWarnings(): void {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (isIgnoredSplineWarning(args[0])) return;
    originalWarn(...args);
  };
}
