---
name: code-conventions
description: >
  Coding standards and best practices for the Portfolio repository. Covers Next.js 16 App Router,
  React 19, Tailwind CSS v4, GSAP (@gsap/react, useGSAP), Three.js / R3F, React95, and Bun.
  Includes naming conventions, identifier rules, anti-patterns, and component architecture.
  Use when writing, refactoring, or reviewing frontend components, animation hooks, or project layout.
---

# Code Conventions & Architecture

Coding standards, architectural patterns, and quality guidelines for the **Next.js SPA Portfolio**.

---

## 1. Stack & Tooling

- **Package Manager**: **Bun (`bun`) EXCLUSIVELY**. Never run `npm`, `yarn`, or `pnpm`.
- **Framework**: **Next.js 16** App Router + **React 19**.
- **Styling**: **Tailwind CSS v4** (utility classes) + `@base-ui/react` + `react95` styling when applicable.
- **Animations**: **GSAP** (`gsap`, `@gsap/react`) for DOM animations; `motion` for micro-interactions where appropriate.
- **3D / WebGL**: **Three.js** & **React Three Fiber (`@react-three/fiber`, `@react-three/drei`)**.

---

## 2. Naming Conventions

### Files & Folders

| Artifact                      | Convention      | Example            |
| ----------------------------- | --------------- | ------------------ |
| Directories                   | `kebab-case`    | `components/`      |
| React component files         | `PascalCase.tsx`| `UserProfile.tsx`  |
| Hooks                         | `use-{name}.ts` | `use-auth.ts`      |
| Utilities / Types / Constants | `kebab-case.ts` | `format-date.ts`   |

**Rule:** Filename and primary export must mirror each other:
`use-auth.ts` → `useAuth` · `format-date.ts` → `formatDate` · `UserProfile.tsx` → `UserProfile`

---

### Identifiers

| Kind                 | Convention         | Prefix/Suffix Rule                                              |
| -------------------- | ------------------ | --------------------------------------------------------------- |
| Functions, variables | `camelCase`        | —                                                               |
| React components     | `PascalCase`       | Matches filename                                                |
| Hooks                | `camelCase`        | `use` prefix required (`useTheme`)                              |
| Event handlers       | `camelCase`        | `handle` prefix (`handleSubmit`, not `onSubmit`)                |
| Booleans             | `camelCase`        | `is` / `has` / `should` / `can` prefix                          |
| Global constants     | `UPPER_SNAKE_CASE` | Module-level constants only; local constants stay `camelCase`   |
| Types & interfaces   | `PascalCase`       | No `I`/`T` prefix; `Props` suffix for component prop types only |
| Enums & members      | `PascalCase`       | —                                                               |

---

### Code Anti-patterns

**Prefix Noise:**
Avoid interface/type prefix noise like `IUser` or `TOrder`.
Use clean `PascalCase` names: `User`, `Order`.

**Event Handlers:**
Do not use `on` prefix on internal handler functions (reserve `on` for prop callback names).
**Wrong:** `function onSubmit()`
**Correct:** `function handleSubmit()`

**Mismatched File vs. Export:**
Avoid filename that doesn't match export name.
**Wrong:** `use-auth.ts` exporting `useAuthentication()`
**Correct:** `use-auth.ts` exporting `useAuth()`

**Vague Identifiers:**
Avoid generic variable or boolean flag names.
**Wrong:** `const data = fetch()`, `const flag = true`
**Correct:** `const userData = fetch()`, `const isAuthenticated = true`

---

## 3. Directory Layout & Architecture

```
src/
├── app/                  # Next.js App Router (layout, pages, i18n routes)
├── components/           # UI components (PascalCase filenames)
├── hooks/                # Custom React hooks (kebab-case file, camelCase use-prefix)
├── lib/                  # Utilities, helper functions, GSAP plugins setup
└── types/                # TypeScript type definitions
```

---

## 4. Component & State Guidelines

1. **Server vs. Client Components**:
   - Explicitly mark interactive or animated components with `'use client'`.
   - Keep client components modular and leaf-focused to avoid unnecessary re-renders.
2. **GSAP Animation Lifecycle**:
   - Always use `useGSAP` hook from `@gsap/react` for component animations.
   - Always provide a container `scope` ref to `useGSAP` to enable automatic cleanup and prevent memory leaks.
   - Avoid manual GSAP tween creations inside raw `useEffect` without proper cleanup.
3. **Three.js / WebGL Lifecycle**:
   - Keep Canvas elements responsive and handle resize/dispose cleanups properly.
   - Never mutate state inside frame loops (`useFrame`) in ways that trigger React re-renders. Use ref mutations for high-frequency loop changes.

---

## 5. Verification Quality Gate

After making edits in `src/`, always run:

```bash
bun lint && bun typecheck
```
