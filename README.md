# Ahmed Hanye — Developer Portfolio

An immersive, interactive developer portfolio built as a **Windows 95-style OS simulation** running inside a photorealistic 3D workspace scene. Built with Next.js 16, React 19, Three.js, and GSAP.

---

## ✨ Features

- **3D Workspace Scene** — Photorealistic CRT monitor, desk, lamp, and cactus rendered via Spline + `@react-three/fiber`
- **CRT Mouse-Look** — The CRT monitor tracks your cursor with a smooth quaternion slerp animation
- **Interactive Lamp** — Click the lamp head to toggle the spotlight with a premium GSAP flicker timeline
- **Scroll-Driven Camera** — GSAP ScrollTrigger animates the camera from a wide establishing shot into a close-up OS view on scroll
- **Windows 95 OS UI** — A fully functional win95 desktop (via `react95`) with:
  - `ahmed_os.exe` — Main system window with Diagnostics, About Me, Skills, and Projects tabs
  - `C:\` Drive Explorer — Simulated folder browser
  - Projects Explorer — Links to live projects & GitHub
  - Desktop icons + Start Menu with language switcher
- **Bilingual (EN / AR)** — Full RTL support via `next-intl` with instant locale switching
- **Lazy-loaded Screen Content** — The OS and BotFace components are dynamically imported to minimize the initial bundle

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (SSG, App Router) |
| UI Library | React 19 |
| 3D Engine | Three.js 0.151 + `@react-three/fiber` + `@react-three/drei` |
| 3D Scene | Spline (`@splinetool/r3f-spline`, `@splinetool/loader`) |
| Animations | GSAP 3.15 (ScrollTrigger, ScrollToPlugin, SplitText, Flip, ScrambleText) |
| OS UI | `react95` + `styled-components` |
| i18n | `next-intl` 4 (EN + AR, RTL support) |
| Styling | Tailwind CSS v4 |
| Package Manager | **Bun** (required) |
| Language | TypeScript 5 |

---

## 🚀 Getting Started

> **Requires [Bun](https://bun.sh).** Do not use `npm`, `pnpm`, or `yarn`.

```bash
# Install dependencies
bun install

# Start the development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx       # Root layout: fonts, i18n provider, GSAP initializer
│   │   └── page.tsx         # Home page — renders WorkspaceSpline
│   └── globals.css          # Tailwind v4 design tokens + base styles
├── components/
│   ├── global/
│   │   └── GSAPInitializer.tsx   # Client component that bootstraps GSAP plugins
│   ├── loaders/                  # Loading state components (Spline, OS, BotFace)
│   ├── screen/
│   │   ├── OS.tsx                # Windows 95 OS shell (window state manager)
│   │   ├── BotFace.tsx           # Animated bot-face shown before scroll
│   │   ├── CrtHtmlScreen.tsx     # R3F portal that mounts HTML onto the 3D CRT mesh
│   │   └── os/                   # Individual OS windows & desktop components
│   │       ├── AboutMe.tsx
│   │       ├── CDriveWindow.tsx
│   │       ├── DesktopIcons.tsx
│   │       ├── ExplorerWindow.tsx
│   │       ├── ProjectsDirectory.tsx
│   │       ├── SkillsExplorer.tsx
│   │       ├── SystemProperties.tsx
│   │       ├── SystemWindow.tsx
│   │       └── TaskBar.tsx
│   └── WorkspaceSpline.tsx       # Root 3D canvas + scene composition
├── hooks/
│   ├── use-canvas-texture.ts     # rAF-driven canvas → THREE.CanvasTexture
│   ├── use-crt-mouse-look.ts     # Quaternion slerp mouse-tracking for CRT
│   ├── use-crt-screen-geometry.ts # Computes HTML overlay size from mesh bounds
│   ├── use-lamp-interactivity.ts  # Lamp click/hover + GSAP flicker animation
│   ├── use-screen-content.ts      # ScrollTrigger-driven bot-face ↔ OS switch
│   ├── use-spline-scene.ts        # Spline scene loader, shadow config, interactions
│   ├── use-text-direction.ts      # Returns 'ltr' | 'rtl' based on current locale
│   ├── use-video-texture.ts       # Video element → THREE.VideoTexture
│   └── use-workspace-camera.ts    # Responsive zoom + scroll-driven camera animation
├── i18n/
│   ├── request.ts                 # next-intl server request config
│   └── routing.ts                 # Locale routing config (en, ar)
├── lib/
│   ├── gsap.ts                    # GSAP + plugin registration (client-only)
│   ├── registry.tsx               # styled-components SSR registry
│   └── utils.ts                   # cn() utility (clsx + tailwind-merge)
├── messages/
│   ├── en.json                    # English translations
│   └── ar.json                    # Arabic translations
└── proxy.ts                       # next-intl middleware (locale detection)
```

---

## 🌍 Internationalization

The site supports **English** and **Arabic** with full RTL layout. Switch languages via:
- The **Start Menu → 🌐 Language** option inside the OS UI
- The **language button** in the taskbar tray (bottom-right)

Locale routes: `/en` (default) and `/ar`.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun start` | Start production server |
| `bun lint` | Run ESLint |
| `bun typecheck` | Run TypeScript type checking (`tsc --noEmit`) |

---

## 🧑‍💻 Author

**Ahmed Hanye** — Creative Developer & 3D Web Engineer

- GitHub: [AhmedHanye](https://github.com/AhmedHanye)
- LinkedIn: [ahmed-hanye](https://www.linkedin.com/in/ahmed-hanye/)
- Email: ahmedhanyehossny@gmail.com
