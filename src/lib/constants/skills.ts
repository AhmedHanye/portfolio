export interface SkillItem {
  name: string;
  url: string;
  category: "languages" | "frameworks" | "tools" | "additional";
}

export const LANGUAGES_SKILLS: SkillItem[] = [
  {
    name: "TypeScript",
    url: "https://www.typescriptlang.org/",
    category: "languages",
  },
  {
    name: "JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    category: "languages",
  },
  {
    name: "Python",
    url: "https://www.python.org/",
    category: "languages",
  },
  {
    name: "SQL",
    url: "https://en.wikipedia.org/wiki/SQL",
    category: "languages",
  },
  {
    name: "HTML5 & CSS3",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    category: "languages",
  },
];

export const FRAMEWORKS_SKILLS: SkillItem[] = [
  {
    name: "Next.js",
    url: "https://nextjs.org/",
    category: "frameworks",
  },
  {
    name: "React",
    url: "https://react.dev/",
    category: "frameworks",
  },
  {
    name: "Django",
    url: "https://www.djangoproject.com/",
    category: "frameworks",
  },
  {
    name: "Django Ninja",
    url: "https://django-ninja.dev/",
    category: "frameworks",
  },
  {
    name: "Celery",
    url: "https://docs.celeryq.dev/",
    category: "frameworks",
  },
  {
    name: "PowerSync",
    url: "https://www.powersync.com/",
    category: "frameworks",
  },
  {
    name: "TanStack DB",
    url: "https://tanstack.com/db",
    category: "frameworks",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/",
    category: "frameworks",
  },
  {
    name: "Fumadocs",
    url: "https://fumadocs.dev/",
    category: "frameworks",
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com/",
    category: "frameworks",
  },
  {
    name: "@base-ui/react",
    url: "https://base-ui.com/",
    category: "frameworks",
  },
  {
    name: "TanStack Query",
    url: "https://tanstack.com/query/latest",
    category: "frameworks",
  },
  {
    name: "TanStack Form",
    url: "https://tanstack.com/form/latest",
    category: "frameworks",
  },
  {
    name: "Zod",
    url: "https://zod.dev/",
    category: "frameworks",
  },
  {
    name: "next-intl",
    url: "https://next-intl.dev/",
    category: "frameworks",
  },
  {
    name: "Three.js / R3F",
    url: "https://threejs.org/",
    category: "frameworks",
  },
  {
    name: "GSAP",
    url: "https://gsap.com/",
    category: "frameworks",
  },
];

export const TOOLS_AND_DBS_SKILLS: SkillItem[] = [
  {
    name: "Bun",
    url: "https://bun.sh/",
    category: "tools",
  },
  {
    name: "uv",
    url: "https://docs.astral.sh/uv/",
    category: "tools",
  },
  {
    name: "PostgreSQL",
    url: "https://www.postgresql.org/",
    category: "tools",
  },
  {
    name: "SQLite (wa-sqlite)",
    url: "https://sqlite.org/",
    category: "tools",
  },
  {
    name: "Redis",
    url: "https://redis.io/",
    category: "tools",
  },
  {
    name: "Docker & Compose",
    url: "https://www.docker.com/",
    category: "tools",
  },
  {
    name: "Storybook",
    url: "https://storybook.js.org/",
    category: "tools",
  },
  {
    name: "Playwright",
    url: "https://playwright.dev/",
    category: "tools",
  },
  {
    name: "Vitest",
    url: "https://vitest.dev/",
    category: "tools",
  },
  {
    name: "React Doctor",
    url: "https://github.com/millionco/react-doctor",
    category: "tools",
  },
  {
    name: "Fallow",
    url: "https://github.com/fallow-rs/fallow",
    category: "tools",
  },
  {
    name: "Ruff",
    url: "https://docs.astral.sh/ruff/",
    category: "tools",
  },
  {
    name: "ESLint / Prettier",
    url: "https://eslint.org/",
    category: "tools",
  },
  {
    name: "Husky",
    url: "https://typicode.github.io/husky/",
    category: "tools",
  },
  {
    name: "Steiger (FSD)",
    url: "https://github.com/feature-sliced/steiger",
    category: "tools",
  },
];

/**
 * Extended dictionary of all known technologies and competencies across certificates,
 * projects, and developer background with official links.
 */
const ALL_SKILLS_MAP: Record<string, string> = {
  // Languages
  TypeScript: "https://www.typescriptlang.org/",
  JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  Python: "https://www.python.org/",
  SQL: "https://en.wikipedia.org/wiki/SQL",
  "HTML5 & CSS3": "https://developer.mozilla.org/en-US/docs/Web/HTML",
  "Linux CLI": "https://www.kernel.org/",
  "Bash & Shell Scripting": "https://www.gnu.org/software/bash/",

  // Frameworks & Libraries
  "Next.js": "https://nextjs.org/",
  "Next.js 16+": "https://nextjs.org/",
  "Next.js 16": "https://nextjs.org/",
  React: "https://react.dev/",
  "React 19": "https://react.dev/",
  Django: "https://www.djangoproject.com/",
  "Django 6.0+": "https://www.djangoproject.com/",
  "Django 6+": "https://www.djangoproject.com/",
  "Django Ninja": "https://django-ninja.dev/",
  "Django Web Framework": "https://www.djangoproject.com/",
  "Django REST Framework": "https://www.django-rest-framework.org/",
  Celery: "https://docs.celeryq.dev/",
  PowerSync: "https://www.powersync.com/",
  "TanStack DB": "https://tanstack.com/db",
  "Tailwind CSS": "https://tailwindcss.com/",
  "Tailwind CSS v4": "https://tailwindcss.com/",
  Fumadocs: "https://fumadocs.dev/",
  "shadcn/ui": "https://ui.shadcn.com/",
  "@base-ui/react": "https://base-ui.com/",
  "TanStack Query": "https://tanstack.com/query/latest",
  "TanStack Query v5": "https://tanstack.com/query/latest",
  "TanStack Form": "https://tanstack.com/form/latest",
  Zod: "https://zod.dev/",
  "Zod v4": "https://zod.dev/",
  "next-intl": "https://next-intl.dev/",
  "Three.js / R3F": "https://threejs.org/",
  GSAP: "https://gsap.com/",
  "GSAP 3.15": "https://gsap.com/",
  React95: "https://react95.io/",
  FSD: "https://feature-sliced.design/",
  "FSD v2.1": "https://feature-sliced.design/",

  // AI & ML
  LangChain: "https://www.langchain.com/",
  "OpenAI APIs": "https://platform.openai.com/",
  "LLM APIs": "https://platform.openai.com/",
  "Vector Embeddings": "https://en.wikipedia.org/wiki/Word_embedding",
  "Prompt Engineering": "https://www.promptingguide.ai/",
  "AI Integrations": "https://platform.openai.com/",

  // Databases, Tools, DevOps
  Bun: "https://bun.sh/",
  uv: "https://docs.astral.sh/uv/",
  PostgreSQL: "https://www.postgresql.org/",
  "PostgreSQL 18": "https://www.postgresql.org/",
  "SQLite (wa-sqlite)": "https://sqlite.org/",
  MySQL: "https://www.mysql.com/",
  Redis: "https://redis.io/",
  "Docker & Compose": "https://www.docker.com/",
  Docker: "https://www.docker.com/",
  "Docker Compose": "https://docs.docker.com/compose/",
  Kubernetes: "https://kubernetes.io/",
  Git: "https://git-scm.com/",
  "Git Internals": "https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain",
  "Git Rebase": "https://git-scm.com/docs/git-rebase",
  "GitHub Actions": "https://github.com/features/actions",
  Storybook: "https://storybook.js.org/",
  "Storybook 10": "https://storybook.js.org/",
  Playwright: "https://playwright.dev/",
  Vitest: "https://vitest.dev/",
  pytest: "https://docs.pytest.org/",
  "Unit Testing (pytest)": "https://docs.pytest.org/",
  "React Doctor": "https://github.com/millionco/react-doctor",
  Fallow: "https://github.com/fallow-rs/fallow",
  Ruff: "https://docs.astral.sh/ruff/",
  "ESLint / Prettier": "https://eslint.org/",
  Husky: "https://typicode.github.io/husky/",
  "Steiger (FSD)": "https://github.com/feature-sliced/steiger",
};

export function getSkillUrl(skillName: string): string | undefined {
  return ALL_SKILLS_MAP[skillName];
}
