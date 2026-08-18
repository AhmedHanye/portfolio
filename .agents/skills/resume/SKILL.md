---
name: resume
description: >
  Single source of truth and build pipeline for Ahmed Hanye's ATS-compliant resume.
  Use when viewing, updating, editing, or recompiling resume.yaml to PDF, Typst, Markdown, or HTML,
  or when auditing ATS formatting, contact details, project bullet points, education, and certifications.
---

# Resume Engineering & Management

Guidelines and toolchains for building and maintaining **Ahmed Hanye's** 100% ATS-compliant universal daily-driver resume.

---

## 1. Single Source of Truth

- **Source File**: `resume/resume.yaml` (Validated against RenderCV JSON Schema v2.8).
- **Engine**: [RenderCV](https://rendercv.com/) with **Typst 0.15** (`engineeringresumes` theme).
- **Format**: Tagged PDF 1.7 (Accessible reading order, full machine parseability).
- **Target Page Count**: Exactly **2 pages** (balanced entry spacing, zero overflow).
- **Public Distribution Asset**: `public/resume.pdf` (Synchronized for the Next.js web portfolio).

---

## 2. CLI Build Commands

### Rebuild All Formats (PDF, Typst, Markdown, HTML)
```bash
cd resume && uvx --from "rendercv[full]" rendercv render resume.yaml -o dist && cp dist/Ahmed_Hanye_Hossny_CV.pdf ../public/resume.pdf
```

### Live-Reloading Watch Mode (During Edits)
```bash
cd resume && uvx --from "rendercv[full]" rendercv render resume.yaml -o dist --watch
```

### Audit ATS Plain-Text Extraction
```bash
pdftotext -f 1 -l 2 resume/dist/Ahmed_Hanye_Hossny_CV.pdf - | head -n 40
```

---

## 3. Strict Rules & Conventions for Agents

1. **Zero Fabricated Experience**:
   - Never invent company names or corporate employment history.
   - Ahmed is a recent **B.Sc. in Computer Science graduate (July 2026, Arab Open University)**.
   - All software engineering achievements reside under `technical_projects`.

2. **Project Separation & Links**:
   - **`InterviewFlow — Production Technical Hiring SaaS Engine`** (*Nov 2025 – Present*): Proprietary SaaS in active development toward MVP (plain text title, no live URL yet).
   - **`InterviewFlow Sandbox — Graduation Project Prototype`** (*Sept 2025 – July 2026*): Academic graduation project prototype at Arab Open University (with public GitHub URL).
   - **`Retro OS & 3D Interactive Portfolio Platform`** (*Jan 2026 – July 2026*): Interactive 3D CRT monitor + simulated Windows 95 desktop OS.
   - **`Awwwards Interactive Web Experience`** (*Mar 2025 – June 2025*): 60 FPS GSAP interactive showcase.

3. **13 Individual Verified Certifications**:
   - Maintain all 13 credentials as distinct entries with their official issuers and direct verification links (GitHub, DataCamp, Meta/Coursera, Udacity, Boot.dev). Do not merge them.

4. **Page Count & Spacing Constraint**:
   - The compiled PDF must fit **strictly within 2 pages**.
   - If adjusting content, tune `design.page.top_margin`, `design.page.bottom_margin`, `design.typography.font_size.body`, or `design.sections.space_between_regular_entries` in `resume/resume.yaml` to maintain clean page distribution.

5. **Git Cleanliness**:
   - `resume/dist/` is ignored by `.gitignore`. Only commit `resume/resume.yaml`, `.agents/skills/resume/SKILL.md`, and `public/resume.pdf`.
