---
name: agent-instructions
description: >
  Single source of truth for creating, editing, structuring, and auditing the .agents/
  configuration layer (AGENTS.md, rules, skills, workflows). Use when creating or modifying
  agent instructions; deciding where a new instruction belongs; organizing a skill into
  references, scripts, or examples; auditing for duplicates or context bloat;
  writing skill descriptions or frontmatter; or refactoring skills.
---

# Agent Instructions

Single source of truth for designing, auditing, and maintaining the agent instruction layer (`.agents/`). Use this skill to decide **where** an instruction belongs, **how** to write it, **how** to structure skill directories, and **how** to keep agent context clean, DRY, and token-efficient.

---

## Task Router

| User Goal / Action                                                     | Location                                   |
| :--------------------------------------------------------------------- | :----------------------------------------- |
| Create, edit, or structure a **Skill**                                 | `.agents/skills/<name>/SKILL.md`           |
| Create, edit, or scope a **Rule**                                      | `.agents/rules/<domain>.md`                |
| Create, edit, or define a **Workflow**                                 | `.agents/workflows/<name>.md`              |
| Update core repository identity in **AGENTS.md**                       | `.agents/AGENTS.md`                        |

---

## 1. Placement Decision & Scope

```
Is this instruction needed on EVERY request?
├── YES → Is it core identity / stack / non-negotiable constraint?
│          ├── YES → AGENTS.md  (keep total under ~50 lines)
│          └── NO  → Rule  (.agents/rules/<domain>.md)
└── NO  → Is it a multi-step procedure triggered by a command/user request?
           ├── YES → Workflow  (.agents/workflows/<name>.md)
           └── NO  → Skill  (.agents/skills/<name>/SKILL.md)
```

---

## 2. General Principles

1. **Context Window Efficiency**: Keep eager context (`AGENTS.md` & `rules/*.md`) as lean as possible. Push detailed procedures and reference material to lazy-loaded skills.
2. **Single Source of Truth**: Keep every rule or procedure in exactly one authoritative file. Never duplicate instructions across `AGENTS.md`, rules, skills, or workflows.
3. **Environment as Source of Truth**: Do not restate information that the agent can read directly from the environment (e.g. `package.json` scripts, CLI `--help` output, directory structures). Only document unwritten conventions, reasons behind choices, and non-obvious gotchas.
4. **Universal Markdown Restrictions**:
   - GFM markdown only. No MDX/JSX components (`<Callout>`, `<Steps>`) outside fenced code blocks.
   - Use repo-relative paths (`.agents/rules/codebase-info.md` or `src/components/...`). Never output machine-specific absolute paths (`/home/...` or `file:///...`).
   - Do NOT use `// ✅` or `// ❌` inside code blocks. Use prose labels (`**Correct:**`, `**Wrong:**`) above the block.
