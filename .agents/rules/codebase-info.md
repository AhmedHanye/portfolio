---
trigger: always_on
description: Policy for codebase research sources and keeping internal knowledge updated.
---

# Codebase Research & Truth Rules

## 1. Search Precedence & Truth Hierarchy

1. **Source Code as Ultimate Truth**: TypeScript definitions, component props, and source code under `src/` are the authoritative source of truth. Always verify types and signatures against actual source files before writing code or assuming package capabilities.
2. **Targeted Code Base Queries**: Rely on targeted searches (`grep_search`, `view_file` with precise line ranges) to locate definitions quickly without unnecessary token bloat.

## 2. Quality Gate & Clean State Maintenance

- After modifying code in `src/`, autonomously run the quality gate command (`bun lint && bun typecheck`).
- Ensure no broken imports or unverified type assertions are introduced.
