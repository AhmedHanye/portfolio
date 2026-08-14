---
description: Generate atomic commits following project standards. Presents a plan for user approval before executing.
---

# Generate Commit Message

## Phase 1 — Context Discovery

Gather context in this order:

1. `git status` — identify all changed, staged, and untracked files.
2. `git diff HEAD` — read the full diff to understand _what_ changed and _why_.
3. `git log --oneline -10` — calibrate message tone and scope against recent commits.
4. If the intent or goal of the changes is ambiguous, ask the user to clarify before proceeding.

---

## Phase 2 — Commit Planning

Analyze all changes and split them into **atomic logical units**. Each commit must represent one coherent change that could be reverted independently.

### Splitting Rules

- **Split** when files belong to different domains: e.g. agent config changes ≠ UI component changes ≠ dependency bumps.
- **Split** when changes serve different purposes even within the same domain.
- **Do not split** when files are tightly coupled: e.g. a component and its associated hook/styles.

### Writing the Subject Line

The subject is the single most important line. It must answer: **"What does this commit do?"**

Rules:

- Format: `type(scope): imperative description`
- Max **72 chars** (keeps it readable in `git log --oneline`).
- **Scope** = the specific affected domain: e.g. `agent`, `deps`, `hero`, `3d`, `ui`.
- The description must be **specific and self-contained**.
- ❌ Avoid vague verbs: `update`, `refactor`, `clean up`, `fix`, `add`.
- ✅ Use precise verbs + object: `extract`, `replace`, `delete`, `introduce`, `migrate`, `enforce`.

**Good examples**:

```
chore(agent): introduce code-conventions and agent-instructions skills
chore(agent): upgrade commit, pr, and review workflows
feat(hero): animate interactive 3D hero canvas on scroll
fix(ui): resolve layout shift in navigation header on mobile
```

### Commit Type Classification (first match wins)

| Type       | When to use                                                               |
| ---------- | ------------------------------------------------------------------------- |
| `feat`     | New user-visible functionality or component                               |
| `fix`      | Corrects a bug in user-facing behavior or layout                          |
| `perf`     | Runtime performance or animation optimization                             |
| `refactor` | Code restructure with no behavior change                                  |
| `style`    | Formatting or CSS tweak only                                              |
| `test`     | Test or story changes                                                     |
| `build`    | Build system or dependency changes (Next.js config, Tailwind, lock files) |
| `chore`    | Agent tooling, dev config, skills, workflows                              |

---

## Phase 3 — Present Plan for Approval

⚠️ **STOP. Do NOT run any git commands yet.**

Present the commit plan as a structured markdown list and wait for explicit approval:

```markdown
## Commit Plan

**1/2** `chore(agent): introduce code-conventions and agent-instructions skills`
- New skills provide structured guidelines for agent instructions and portfolio code conventions.

Files: `.agents/skills/agent-instructions/`, `.agents/skills/code-conventions/`

---

**2/2** `chore(agent): upgrade commit, pr, and review workflows`
- Replaces broken prompt references with self-contained workflows tailored for portfolio.

Files: `.agents/workflows/commit.md`, `.agents/workflows/pr.md`, `.agents/workflows/review.md`
```

Say: **"Approve to proceed, or let me know what to change."**

---

## Phase 4 — Execution (after approval)

### Quality Gate

Run first, before any commit:

```bash
bun lint && bun typecheck
```

If any check fails → **stop**, report errors, help the user fix them. Do not commit.

### Partial Commit Strategy

- Stage files precisely with `git add <paths>`.
- Commit with clear multi-line message containing subject line and bulleted body.
