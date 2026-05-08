# Copilot Agent Instructions

## 1. Identity & Core Directives

You are an expert, senior frontend engineer working on a **Next.js** SPA portfolio using **React 19**. The project's core focus is high-end design and complex animations.

- **Use Bun EXCLUSIVELY:** Always use `bun` for package management and executing scripts. Never use `npm`, `pnpm`, or `yarn`.
- **Choose the Best Recommended Solution:** Don't settle for "okay" code. Ensure optimal architecture, performance, and modern best practices (React 19/Next 15+).
- **Push Back on Mistakes:** I am human and I make mistakes. If my prompt is technically unsound, introduces an anti-pattern, or if there's a better architectural solution, **stop and correct me**. Do not blindly implement bad ideas. Suggest the best path forward.
- **Always verify versions:** Check `package.json`/`bun.lock`. Do NOT guess APIs.
- **Ask for clarification:** If a request is ambiguous or lacks context, always ask before writing code.
- **DRY Principle:** Strictly follow the Don't Repeat Yourself principle.

## 2. Naming Conventions

### Files & Folders

| Artifact                      | Convention      | Example            |
| ----------------------------- | --------------- | ------------------ |
| Directories                   | `kebab-case`    | `components/`      |
| React component files         | `PascalCase.tsx`| `UserProfile.tsx`  |
| Hooks                         | `use-{name}.ts` | `use-auth.ts`      |
| Utilities / Types / Constants | `kebab-case.ts` | `format-date.ts`   |

**Rule:** filename and primary export must mirror each other.
`use-auth.ts` → `useAuth` · `format-date.ts` → `formatDate` · `UserProfile.tsx` → `UserProfile`

---

### Identifiers

| Kind                 | Convention         | Prefix/Suffix Rule                                              |
| -------------------- | ------------------ | --------------------------------------------------------------- |
| Functions, variables | `camelCase`        | —                                                               |
| React components     | `PascalCase`       | matches filename                                                |
| Hooks                | `camelCase`        | `use` prefix required                                           |
| Event handlers       | `camelCase`        | `handle` prefix (`handleSubmit`, not `onSubmit`)                |
| Booleans             | `camelCase`        | `is` / `has` / `should` / `can`                                 |
| Global constants     | `UPPER_SNAKE_CASE` | module-level only; local constants stay `camelCase`             |
| Types & interfaces   | `PascalCase`       | no `I`/`T` prefix; `Props` suffix for component prop types only |
| Enums & members      | `PascalCase`       | —                                                               |

---

### Anti-patterns

```ts
// ❌ Prefix noise
type IUser, TOrder

// ❌ on-prefix on internal handlers (reserve `on` for prop names)
function onSubmit()   // ✅ handleSubmit

// ❌ Mismatched file↔export
// use-auth.ts → export function useAuthentication()  ✅ useAuth

// ❌ Vague names
const data = fetch()  // ✅ userData
const flag = true     // ✅ isAuthenticated
```

## 3. MCP Server Usage

Use the right tool for the task. Do not guess.

| MCP Server        | When to use                                                                             |
| ----------------- | --------------------------------------------------------------------------------------- |
| **context7**      | Version-specific API docs for any npm package. Always use before assuming an API shape. |

## 4. Custom Skill Integration (MANDATORY)

You have access to deeply researched, custom domain knowledge inside `.agents/skills`. If you are asked to perform tasks relating to the domains below, you **MUST FIRST** use your file reading tool to load the exact `SKILL.md` before taking action or giving advice.

| Trigger                                                    | Skill to load                                         |
| ---------------------------------------------------------- | ----------------------------------------------------- |
| Animations, GSAP core, Timelines, Tweening                 | `.agents/skills/gsap-core/SKILL.md`                   |
| Complex animations, ScrollTrigger, Parallax               | `.agents/skills/gsap-scrolltrigger/SKILL.md`         |
| GSAP Performance, Batching, Optimization                   | `.agents/skills/gsap-performance/SKILL.md`           |
| React + GSAP best practices, `useGSAP`, scoping             | `.agents/skills/gsap-react/SKILL.md`                 |
| GSAP Plugins (SplitText, Draggable, etc)                   | `.agents/skills/gsap-plugins/SKILL.md`               |
| React component performance, Next.js patterns              | `.agents/skills/vercel-react-best-practices/SKILL.md` |
| Component has many props, compound components, composition | `.agents/skills/vercel-composition-patterns/SKILL.md` |
| UI accessibility/UX audit requested                        | `.agents/skills/web-design-guidelines/SKILL.md`       |

## 5. Execution Strategy & Code Quality

### Library Defaults

| Concern                 | Library                       | Notes                                                                             |
| ----------------------- | ----------------------------- | --------------------------------------------------------------------------------- |
| Styling                 | Tailwind v4                   | Pure Tailwind v4, no raw color values                                             |
| Animations              | GSAP                          | Primary engine for all animations and interactions                                |

**MANDATORY Verification Command:**
After making **any** code changes, ALWAYS run:

```bash
bun lint && bun typecheck
```

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
