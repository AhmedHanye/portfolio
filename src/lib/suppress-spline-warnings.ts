let patched = false;

/**
 * Suppresses known noisy Spline loader warnings that cannot be fixed within the library.
 * Must be called once, client-side only. Subsequent calls are no-ops.
 */
export function suppressSplineWarnings(): void {
  if (patched || typeof window === "undefined") return;
  patched = true;

  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("does not support the outline layer") ||
        args[0].includes("file is more recent than the library") ||
        args[0].includes("mergeBufferGeometries() has been renamed"))
    ) {
      return;
    }
    originalWarn(...args);
  };
}
