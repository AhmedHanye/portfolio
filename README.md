# Ahmed Hanye — Developer Portfolio

An immersive, high-performance developer portfolio built with **Next.js 16**, **React 19**, **Three.js / React Three Fiber**, **GSAP**, and **Tailwind CSS v4**.

The portfolio offers a dual-experience architecture: a modern retro **Windows 95-inspired landing page** and an interactive **3D CRT workspace simulation** at `/interactive-os`.

---

## ✨ Features

### 🖥️ 1. Retro-Modern Home Portfolio (`/` & `/[locale]`)
- **Retro Navigation Bar** — Windows 95 `AppBar` with smooth scrolling navigation (About, Projects, Skills, Contact), instant EN/AR locale switching, sound effects toggle, and 3D mode launcher.
- **Hero & Profile** — Retro window avatar container, resume download, professional credentials, and direct gateway to the 3D workspace.
- **Projects Showcase** — Detailed project case studies:
  - **InterviewFlow** — High-standard enterprise technical hiring SaaS.
  - **InterviewFlow (Graduation Prototype)** — Real-time collaborative candidate evaluation sandbox.
  - **Awwards** — 60 FPS GSAP-orchestrated interactive web experience.
- **Technical Skills Matrix** — Categorized overview of frontend, backend, databases, cloud, DevOps, and architectural proficiencies.
- **Contact & Communication** — Direct communication channels and social links.
- **Retro Sound Design** — Synthesized Web Audio API clicks, alerts, and navigation soundscapes.

### 🌐 2. Interactive 3D OS Workspace (`/interactive-os`)
- **3D Workspace Scene** — Photorealistic CRT monitor, desk, lamp, and room rendered with Three.js, `@react-three/fiber`, and Spline.
- **CRT Mouse-Look Tracking** — CRT monitor smoothly tracks the cursor with quaternion slerp calculations.
- **Interactive Desk Lamp** — Clickable lamp head toggling spotlight illumination with custom GSAP flicker sequence.
- **Simulated Windows 95 Desktop OS** — Rendered directly into the CRT display with full window management:
  - Multi-window management (Draggable, Minimizable, Maximizable, Focus-aware, Z-index stack).
  - System Properties — Deep-dive technical architecture case studies.
  - Skills Explorer — Interactive categorized tech stack tree.
  - Projects Directory — Live project previews, tech stack badges, and GitHub repository links.
  - `C:\` Drive & File Explorer — Windows 95 filesystem browsing simulation.
  - Start Menu & Taskbar — System controls, desktop icons, audio toggles, and locale switcher.
- **Responsive Mobile & Fallback Views** — Device orientation prompts, WebGL support detection, and compact viewport handling.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|---|---|---|
| **Framework** | **Next.js 16** | App Router, static generation, server & client components |
| **Runtime & PM** | **Bun** | Ultra-fast JavaScript runtime and exclusive package manager |
| **UI Library** | **React 19** | Modern React with React Compiler optimizations |
| **3D & WebGL** | **Three.js (0.151)** + **R3F** | `@react-three/fiber`, `@react-three/drei`, `@splinetool/loader` |
| **Animations** | **GSAP 3.15** + **@gsap/react** | ScrollTrigger, timelines, transforms, and UI motion |
| **Styling** | **Tailwind CSS v4** | Modern utility-first CSS engine + `@tailwindcss/postcss` |
| **Retro UI System** | **React95** + **styled-components** | Windows 95 components, icons, and theme registry |
| **i18n & RTL** | **next-intl 4** | Full English & Arabic internationalization with RTL support |
| **Audio** | **Web Audio API** | Procedural sound generation and interface sound effects |
| **Quality & Audit** | **ESLint 9**, **TypeScript 6**, **React Doctor**, **Fallow** | Static analysis, dead-code detection, and architecture audits |

---

## 🚀 Getting Started

### Prerequisites

This project **requires [Bun](https://bun.sh)**. Do not use `npm`, `pnpm`, or `yarn`.

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── interactive-os/
│   │   │   └── page.tsx             # Dedicated 3D Interactive OS route
│   │   ├── layout.tsx               # Root layout: fonts, i18n, metadata, styled registry
│   │   ├── opengraph-image.tsx      # Dynamic OpenGraph card
│   │   ├── page.tsx                 # Home portfolio landing page
│   │   └── twitter-image.tsx        # Dynamic Twitter card
│   ├── globals.css                  # Tailwind v4 theme configuration & global styles
│   └── manifest.json                # Web App Manifest
├── components/
│   ├── features/
│   │   ├── home/                    # Home portfolio components
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── HomeFooter.tsx
│   │   │   ├── HomeLanding.tsx
│   │   │   ├── HomeNavbar.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   └── SkillsSection.tsx
│   │   └── interactive-os/          # 3D scene & OS simulation components
│   │       ├── BotFace.tsx
│   │       ├── RotatePrompt.tsx
│   │       ├── WebGLErrorBoundary.tsx
│   │       ├── WebglPrompt.tsx
│   │       ├── WorkspaceSpline.tsx
│   │       ├── desktop/             # Desktop OS windows, icons & taskbar
│   │       │   ├── AboutMe.tsx
│   │       │   ├── CDriveWindow.tsx
│   │       │   ├── DesktopIcons.tsx
│   │       │   ├── OS.tsx
│   │       │   ├── ProjectsDirectory.tsx
│   │       │   ├── SkillsExplorer.tsx
│   │       │   ├── SystemProperties.tsx
│   │       │   ├── TaskBar.tsx
│   │       │   └── WindowFrame.tsx
│   │       └── loaders/             # Suspense & progress loaders
│   │           ├── BotFaceLoading.tsx
│   │           ├── OsLoader.tsx
│   │           └── SplineProgressIndicator.tsx
│   └── layout/
│       └── GSAPInitializer.tsx      # Client GSAP plugin registration
├── hooks/                           # Custom React hooks (3D, camera, audio, windowing)
│   ├── use-canvas-texture.ts
│   ├── use-compact-viewport.ts
│   ├── use-crt-mouse-look.ts
│   ├── use-draggable-window.ts
│   ├── use-lamp-interactivity.ts
│   ├── use-screen-content.ts
│   ├── use-spline-scene.ts
│   ├── use-text-direction.ts
│   ├── use-video-texture.ts
│   ├── use-webgl-support.ts
│   ├── use-window-manager.ts
│   └── use-workspace-camera.ts
├── i18n/                            # next-intl configuration & routing
│   ├── request.ts
│   └── routing.ts
├── lib/                             # Utilities, sound synthesizers, GSAP setup
│   ├── constants/
│   │   └── seo.ts
│   ├── gsap.ts
│   ├── registry.tsx
│   ├── sound.ts
│   └── suppress-spline-warnings.ts
├── messages/                        # Translation dictionaries
│   ├── ar.json                      # Arabic translations (RTL)
│   └── en.json                      # English translations (LTR)
└── proxy.ts                         # Locale detection middleware
```

---

## 🌍 Internationalization & RTL

The portfolio provides first-class support for **English (`en`)** and **Arabic (`ar`)** with complete RTL layout adaptation:
- Automatic document direction switching (`dir="ltr"` / `dir="rtl"`).
- Synchronized translation dictionaries in `src/messages/`.
- Instant language toggle directly from the navigation bar, Windows 95 Start Menu, and Taskbar tray.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start development server with Turbopack / Next.js |
| `bun build` | Create optimized production build |
| `bun start` | Start production server |
| `bun lint` | Run ESLint across the codebase |
| `bun typecheck` | Run TypeScript compiler typecheck (`tsc --noEmit`) |
| `bun run doctor` | Run React Doctor to audit performance, rules & accessibility |
| `bun run fallow` | Run Fallow codebase intelligence (dead code, architecture boundaries) |
| `bun run audit` | Run combined quality gate audit (`doctor` + `fallow`) |

---

## 🧑‍💻 Author

**Ahmed Hanye** — Creative Developer & 3D Web Engineer

- GitHub: [AhmedHanye](https://github.com/AhmedHanye)
- LinkedIn: [ahmed-hanye](https://www.linkedin.com/in/ahmed-hanye/)
- Email: ahmedhanyehossny@gmail.com
