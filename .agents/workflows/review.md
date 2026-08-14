---
description: Perform an expert code review of changes or current branch.
---

# Perform Expert Code Review

## Context Discovery & Scope

1. **Determine Scope:**
   - Determine scope from prompt (file/folder, staged `git diff --staged`, commit `HEAD~1`, or PR).
   - **Default Scope:** If unspecified, review current branch against `main` (`git diff main...HEAD`).
2. **Verify Ref:** Ensure target diff is captured (`git diff main...HEAD`).

---

## Steps

### 1. Automated Diagnostics & Validation Suite (MANDATORY)

Execute automated quality gates and delegate to diagnostic tools:

1. **Standard Quality Gate**:
   ```bash
   bun lint && bun typecheck
   ```
2. **Deep Codebase & Static Analysis**: Consult [`fallow`](.agents/skills/fallow/SKILL.md) to audit changed-code risk, dead code, duplication, complexity hotspots, and boundary violations (`fallow audit`).
3. **React Diagnostics & Health**: Consult [`react-doctor`](.agents/skills/react-doctor/SKILL.md) to run React 19 rules, hooks health, security, and performance diagnostics (`bun run doctor`).

Stop and report errors immediately if any automated check fails.

---

### 2. Code Standards & Integrity Review

Inspect target diff against specialized skill domains and code smell baselines:

- **Best Practices & Conventions**: Enforce guidelines in [`code-conventions`](.agents/skills/code-conventions/SKILL.md), [`gsap-performance`](.agents/skills/gsap-performance/SKILL.md), [`vercel-react-best-practices`](.agents/skills/vercel-react-best-practices/SKILL.md), and [`web-design-guidelines`](.agents/skills/web-design-guidelines/SKILL.md).
- **Animation & WebGL Lifecycle**: Verify GSAP tweens use `useGSAP` with proper container scoping, and WebGL/R3F loops avoid unnecessary React re-renders.
- **Logical Correctness**: Rigorously inspect logic for bugs, unhandled nulls/promises, race conditions, edge-case flaws, and state leaks.
- **Code Smell Baseline**: Flag Mysterious Names, Duplicated Code, Feature Envy, Primitive Obsession, and Speculative Generality.

---

## Output Delivery & Artifact Policy

Do **NOT** write the full review report directly in the chat response.

1. **Session Artifact**: Create a session artifact named `review.md` (written to `<appDataDir>/brain/<conversation-id>/review.md` via `write_to_file` with `ArtifactMetadata`) containing the full detailed review report using the format below.
2. **Chat Response**: Provide **only** a brief 2-sentence executive summary in the chat response pointing the user to `review.md`.

### Session Artifact (`review.md`) Format

```markdown
# Code Review Report

## Executive Summary & Verdict

- **Verdict**: 🔴 Changes Requested | 🟡 Approved with Nits | 🟢 Approved
- **Standards Axis**: Pass / Fail (X issues)
- **Automated Gate**: `bun lint` ✅ | `bun typecheck` ✅ | `fallow` ✅ | `react-doctor` ✅

---

## 1. Standards & Integrity 🛡️

### Critical Issues 🔴

#### 1. <Issue Title>

- **File**: [<file.tsx:L12-L20>](file://path/to/file.tsx#L12-L20)
- **Violation**: <Rule or logic flaw explanation>
- **Impact**: <Consequence on build, performance, or runtime>
- **Fix**:
  ```diff
  - <old code>
  + <new code>
  ```

### Suggestions 🟡

#### 1. <Issue Title>

- **File**: [<file.ts:L30>](file://path/to/file.ts#L30)
- **Recommendation**: <Refactoring, performance, or convention suggestion>

### Nits 🟢

- [<file.tsx:L14>](file://path/to/file.tsx#L14): <Minor style or cosmetic tweak>
```
