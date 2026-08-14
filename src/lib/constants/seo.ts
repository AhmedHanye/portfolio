export const SITE_CONFIG = {
  name: "Ahmed Hanye",
  fullName: "Ahmed Hanye Hossny",
  jobTitle: "Software Engineer | Full-Stack Software Engineer",
  twitterHandle: "@ahmedhanye",
  email: "ahmedhanyehossny@gmail.com",
  links: {
    github: "https://github.com/AhmedHanye",
    linkedin: "https://linkedin.com/in/ahmedhanye",
  },
  defaultLocale: "en",
  locales: ["en", "ar"] as const,
  defaultTitle: "Ahmed Hanye | Full-Stack Software Engineer",
  defaultDescription:
    "Full-Stack Software Engineer specializing in resilient local-first web applications, distributed data synchronization, and high-performance web systems.",
};

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "https://ahmedhanye.me";
}

export function getCanonicalUrl(locale: string, path = ""): string {
  const baseUrl = getSiteUrl();
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `${baseUrl}/${locale}${cleanPath}`;
}
