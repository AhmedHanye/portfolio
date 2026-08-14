"use client";

import { useEffect } from "react";
import "@/lib/gsap";
import { suppressSplineWarnings } from "@/lib/suppress-spline-warnings";

/**
 * GSAPInitializer — client-side bootstrap component.
 *
 * Responsibilities:
 * 1. Triggers GSAP plugin registration (via the side-effect import of @/lib/gsap).
 * 2. Patches console.warn to suppress known, unfixable Spline loader noise.
 *
 * Runs exactly once per app session. Returns null — no DOM output.
 */
export function GSAPInitializer() {
  useEffect(() => {
    suppressSplineWarnings();
  }, []);

  return null;
}
