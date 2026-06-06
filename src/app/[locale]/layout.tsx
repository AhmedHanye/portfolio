import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, Locale } from "@/i18n/routing";
import { GSAPInitializer } from "@/components/global/GSAPInitializer";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ahmed Hanye | Creative Developer & 3D Web Engineer",
  description:
    "Explore the immersive 3D interactive developer portfolio of Ahmed Hanye. Featuring high-end GSAP animations, React, Next.js, and Three.js workspace experiences.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

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

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <GSAPInitializer />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <NextIntlClientProvider messages={messages}>
              {children}
            </NextIntlClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
