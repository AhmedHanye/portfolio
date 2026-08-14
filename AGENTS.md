# AGENTS.md

This file gives coding agents project-specific context. Keep it short and update it when workflows change.

## Project Overview

- Primary app or package: Next.js 15 SPA Portfolio (React 19, Bun, GSAP, Tailwind v4)
- Main entry points: `src/app/[locale]/page.tsx`, `src/app/[locale]/layout.tsx`
- Important directories: `src/components`, `src/hooks`, `src/lib`

## Architecture Notes

- Module boundaries: Next.js App Router, Three.js / R3F components, Win95 OS screen simulation
- Generated or vendored code: `.next/`, `node_modules/`
- Sensitive areas: Three.js canvas & WebGL lifecycle, React Compiler compatibility

## Commands

- Install: `bun install`
- Build: `bun run build`
- Test & Audit: `bun run audit`
- React Doctor: `bun run doctor`
- Fallow Audit: `bun run fallow`
- Typecheck & Lint: `bun lint && bun typecheck`

## React Doctor & Fallow Tooling

- Use `bun run doctor` to audit React performance, anti-patterns, accessibility, and React Compiler rules.
- Use `fallow audit --format json --quiet` before committing AI-generated changes.
- Use `fallow dead-code --format json --quiet`, `fallow dupes --format json --quiet`, and `fallow health --format json --quiet` for targeted codebase checks.
- Use `fallow list --entry-points --format json --quiet` and `fallow list --boundaries --format json --quiet` to inspect project shape.
