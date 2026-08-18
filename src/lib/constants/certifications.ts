export type CertificateCategory =
  | "all"
  | "ai"
  | "devops"
  | "backend"
  | "fullstack"
  | "database";

export type CertificateIssuer =
  | "Udacity"
  | "GitHub"
  | "DataCamp"
  | "Meta"
  | "Boot.dev";

export type CertificateIssuerKey =
  | "udacity"
  | "github"
  | "datacamp"
  | "meta"
  | "bootdev";

export interface Certification {
  id: string;
  titleKey: string;
  issuer: CertificateIssuer;
  issuerKey: CertificateIssuerKey;
  category: "ai" | "devops" | "backend" | "fullstack" | "database";
  verificationUrl: string;
  pdfPath: string;
  badgeImage?: string;
  skills: string[];
}

export const ISSUER_THEMES: Record<
  CertificateIssuerKey,
  { bg: string; text: string; label: string }
> = {
  meta: { bg: "#0866ff", text: "#fff", label: "META" },
  github: { bg: "#24292e", text: "#fff", label: "GITHUB" },
  datacamp: { bg: "#05192d", text: "#03ef62", label: "DATACAMP" },
  udacity: { bg: "#01b3e3", text: "#fff", label: "UDACITY" },
  bootdev: { bg: "#da532c", text: "#fff", label: "BOOT.DEV" },
};

export const CERTIFICATE_CATEGORIES: Array<{
  id: CertificateCategory;
  labelKey: string;
  icon: string;
}> = [
  { id: "all", labelKey: "catAll", icon: "📜" },
  { id: "ai", labelKey: "catAi", icon: "🤖" },
  { id: "devops", labelKey: "catDevops", icon: "🐳" },
  { id: "backend", labelKey: "catBackend", icon: "⚡" },
  { id: "fullstack", labelKey: "catFullstack", icon: "🌐" },
  { id: "database", labelKey: "catDatabase", icon: "💾" },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "udacity-frontend",
    titleKey: "frontendWebDev",
    issuer: "Udacity",
    issuerKey: "udacity",
    category: "fullstack",
    verificationUrl: "https://confirm.udacity.com/ZSPSSPFP",
    pdfPath: "/certifications/b018bdca-2c06-4279-89e3-ca123b7f97c6.pdf",
    badgeImage: "/certifications/udacity-com-logo.png",
    skills: [
      "HTML5 & CSS3",
      "JavaScript",
      "DOM Manipulation",
      "Web APIs",
      "Responsive UI",
    ],
  },
  {
    id: "github-foundations",
    titleKey: "githubFoundations",
    issuer: "GitHub",
    issuerKey: "github",
    category: "devops",
    verificationUrl:
      "https://www.credly.com/badges/4ce2fa7e-90ff-4d7f-9d34-f04056defe0d/public_url",
    pdfPath: "/certifications/GitHubFoundations_Badge20260818-21-901hbp.pdf",
    badgeImage: "/certifications/github-foundations.png",
    skills: [
      "Git",
      "GitHub Actions",
      "Version Control",
      "Repository Management",
      "Collaboration",
      "Code Review",
    ],
  },
  {
    id: "datacamp-containerization",
    titleKey: "containerizationVirtualization",
    issuer: "DataCamp",
    issuerKey: "datacamp",
    category: "devops",
    verificationUrl:
      "https://www.datacamp.com/completed/statement-of-accomplishment/track/91a0f13bbb41ff496ba2f1373fc32c8c758aaafd",
    pdfPath: "/certifications/Containerization-virtualization.pdf",
    badgeImage: "/certifications/datacamp-logo.svg",
    skills: [
      "Docker",
      "Kubernetes",
      "Docker Compose",
      "Multi-Stage Builds",
      "Containerization",
      "Virtualization",
    ],
  },
  {
    id: "datacamp-python-developer",
    titleKey: "pythonDeveloper",
    issuer: "DataCamp",
    issuerKey: "datacamp",
    category: "backend",
    verificationUrl:
      "https://www.datacamp.com/completed/statement-of-accomplishment/track/78ff9dbee31fd136c2d1f30220d42b16548172d6",
    pdfPath: "/certifications/python-developer.pdf",
    badgeImage: "/certifications/datacamp-logo.svg",
    skills: [
      "Python",
      "OOP",
      "Data Structures & Algorithms",
      "Package Development",
      "Unit Testing (pytest)",
      "Web Scraping",
    ],
  },
  {
    id: "datacamp-sql-associate",
    titleKey: "sqlAssociate",
    issuer: "DataCamp",
    issuerKey: "datacamp",
    category: "database",
    verificationUrl: "https://www.datacamp.com/certificate/SQA0019339139750",
    pdfPath: "/certifications/SQA0019339139750.pdf",
    badgeImage: "/certifications/SQL Associate - badge with outline.png",
    skills: [
      "SQL",
      "PostgreSQL",
      "Data Aggregation",
      "Data Cleaning & Transformation",
      "Multi-Table Joins",
      "Relational Data Analysis",
    ],
  },
  {
    id: "datacamp-ai-engineer-associate",
    titleKey: "aiEngineerAssociate",
    issuer: "DataCamp",
    issuerKey: "datacamp",
    category: "ai",
    verificationUrl: "https://www.datacamp.com/certificate/AIEDA0013770502757",
    pdfPath: "/certifications/AIEDA0013770502757.pdf",
    badgeImage:
      "/certifications/certification-ai-engineer-for-developers-associate-badge.png",
    skills: [
      "LLM APIs",
      "LangChain",
      "Prompt Engineering",
      "OpenAI APIs",
      "Vector Embeddings",
      "AI Integrations",
    ],
  },
  {
    id: "coursera-meta-full-stack",
    titleKey: "theFullStack",
    issuer: "Meta",
    issuerKey: "meta",
    category: "fullstack",
    verificationUrl:
      "https://www.coursera.org/account/accomplishments/verify/VUNTB7X4RB3B",
    pdfPath: "/certifications/Coursera VUNTB7X4RB3B.pdf",
    badgeImage: "/certifications/meta-logo.svg",
    skills: [
      "Full-Stack Web Development",
      "Django",
      "REST APIs",
      "Backend Integration",
      "Responsive Design",
    ],
  },
  {
    id: "coursera-meta-apis",
    titleKey: "metaApis",
    issuer: "Meta",
    issuerKey: "meta",
    category: "backend",
    verificationUrl:
      "https://www.coursera.org/account/accomplishments/verify/6KL22ZWVDRHQ",
    pdfPath: "/certifications/Coursera 6KL22ZWVDRHQ.pdf",
    badgeImage: "/certifications/meta-logo.svg",
    skills: [
      "RESTful APIs",
      "API Design",
      "Django REST Framework",
      "Authentication & Authorization",
      "API Testing",
    ],
  },
  {
    id: "coursera-meta-django",
    titleKey: "metaDjango",
    issuer: "Meta",
    issuerKey: "meta",
    category: "backend",
    verificationUrl:
      "https://www.coursera.org/account/accomplishments/verify/K8KHTEKNC8W4",
    pdfPath: "/certifications/Coursera K8KHTEKNC8W4.pdf",
    badgeImage: "/certifications/meta-logo.svg",
    skills: [
      "Django",
      "ORM & Models",
      "MVT Pattern",
      "Data Migrations",
      "Views & Routing",
      "Admin Interface",
    ],
  },
  {
    id: "coursera-meta-backend-capstone",
    titleKey: "metaBackendCapstone",
    issuer: "Meta",
    issuerKey: "meta",
    category: "backend",
    verificationUrl:
      "https://www.coursera.org/account/accomplishments/verify/9QWUKSWZ5ZJQ",
    pdfPath: "/certifications/Coursera 9QWUKSWZ5ZJQ.pdf",
    badgeImage: "/certifications/meta-logo.svg",
    skills: [
      "Django Web Framework",
      "Django REST Framework",
      "MySQL",
      "API Endpoints",
      "User Authentication",
      "Unit Testing",
    ],
  },
  {
    id: "coursera-meta-intro-databases",
    titleKey: "metaIntroDatabases",
    issuer: "Meta",
    issuerKey: "meta",
    category: "database",
    verificationUrl:
      "https://www.coursera.org/account/accomplishments/verify/TAK9AF6NTQZU",
    pdfPath: "/certifications/Coursera TAK9AF6NTQZU.pdf",
    badgeImage: "/certifications/meta-logo.svg",
    skills: [
      "Relational Databases",
      "SQL Queries",
      "Schema Design",
      "Data Integrity",
      "MySQL",
      "Table Relationships",
    ],
  },
  {
    id: "bootdev-linux",
    titleKey: "bootdevLinux",
    issuer: "Boot.dev",
    issuerKey: "bootdev",
    category: "devops",
    verificationUrl:
      "https://www.boot.dev/certificates/823982bd-c76a-4445-bc41-4d82fe1423a5",
    pdfPath: "/certifications/bootdev_certificate-linux.png",
    badgeImage: "/certifications/bootdev.png",
    skills: [
      "Linux CLI",
      "Bash & Shell Scripting",
      "Process Management",
      "File Permissions",
      "Package Managers",
      "I/O Redirection & Pipes",
    ],
  },
  {
    id: "bootdev-git",
    titleKey: "bootdevGit",
    issuer: "Boot.dev",
    issuerKey: "bootdev",
    category: "devops",
    verificationUrl:
      "https://www.boot.dev/certificates/c71c32ae-378a-469e-9cc3-40640bb04721",
    pdfPath: "/certifications/bootdev_certificate_git.png",
    badgeImage: "/certifications/bootdev.png",
    skills: [
      "Git Internals",
      "Branching & Merging",
      "Git Rebase",
      "Plumbing Commands",
      "Remote Repositories",
      "Conflict Resolution",
    ],
  },
];
