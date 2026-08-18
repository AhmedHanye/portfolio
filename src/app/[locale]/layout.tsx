import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, Locale } from "@/i18n/routing";
import { GSAPInitializer } from "@/components/layout/GSAPInitializer";
import { SITE_CONFIG, getSiteUrl, getCanonicalUrl } from "@/lib/constants/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const siteUrl = getSiteUrl();
  const canonicalUrl = getCanonicalUrl(locale);
  const isArabic = locale === "ar";

  const title = t("title");
  const description = t("description");
  const ogTitle = t("ogTitle");
  const ogDescription = t("ogDescription");
  const keywords = t("keywords").split(", ");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description,
    keywords,
    authors: [{ name: SITE_CONFIG.fullName, url: siteUrl }],
    creator: SITE_CONFIG.fullName,
    publisher: SITE_CONFIG.fullName,
    applicationName: SITE_CONFIG.name,
    appleWebApp: {
      title: "AhmedHanye",
      statusBarStyle: "black-translucent",
      capable: true,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "Ahmed Hanye Portfolio",
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      locale: isArabic ? "ar_EG" : "en_US",
      alternateLocale: isArabic ? ["en_US"] : ["ar_EG"],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function buildJsonLd(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: SITE_CONFIG.fullName,
      alternateName: SITE_CONFIG.name,
      jobTitle: SITE_CONFIG.jobTitle,
      url: getCanonicalUrl(locale),
      sameAs: [SITE_CONFIG.links.github, SITE_CONFIG.links.linkedin],
      email: SITE_CONFIG.email,
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "Three.js",
        "GSAP",
        "Django Ninja",
        "Local-First Software Architecture",
        "WebGL",
      ],
    },
  };
}

// fallow-ignore-next-line complexity
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const jsonLd = buildJsonLd(locale);

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <GSAPInitializer />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </div>
        </div>
        {Boolean(process.env.VERCEL || process.env.NEXT_PUBLIC_VERCEL_ENV) && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
