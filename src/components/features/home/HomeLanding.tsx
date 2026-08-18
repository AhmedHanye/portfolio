"use client";

import React, { useRef, useState } from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import original from "react95/dist/themes/original";
import StyledComponentsRegistry from "@/lib/registry";

// @ts-expect-error woff2 file imports need declaration
import ms_sans_serif from "react95/dist/fonts/ms_sans_serif.woff2";
// @ts-expect-error woff2 file imports need declaration
import ms_sans_serif_bold from "react95/dist/fonts/ms_sans_serif_bold.woff2";

import { useLocale } from "next-intl";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";

// Section Components
import HomeNavbar from "./HomeNavbar";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ProjectsSection from "./ProjectsSection";
import SkillsSection from "./SkillsSection";
import CertificationsSection from "./CertificationsSection";
import ContactSection from "./ContactSection";
import HomeFooter from "./HomeFooter";
import ResumeModal from "./ResumeModal";

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal;
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: 700;
    font-style: normal;
  }
  
  .win95-landing-page {
    font-family: 'ms_sans_serif', sans-serif;
    cursor: url('/cursors/Arrow.png'), auto;
  }

  .win95-landing-page button,
  .win95-landing-page a,
  .win95-landing-page [role="button"],
  .win95-landing-page .cursor-pointer {
    cursor: url('/cursors/HandPointer.png'), pointer;
  }

  .win95-landing-page input,
  .win95-landing-page textarea {
    cursor: url('/cursors/Text.png'), text;
  }

  [dir="rtl"] .win95-landing-page legend {
    left: auto;
    right: 8px;
  }
`;

export default function HomeLanding() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const mainRef = useRef<HTMLDivElement>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useGSAP(
    () => {
      // Refresh scroll triggers when layout stabilizes
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 300);
      return () => clearTimeout(timer);
    },
    { scope: mainRef }
  );

  const handleOpenResume = () => {
    setIsResumeOpen(true);
  };

  const handleCloseResume = () => {
    setIsResumeOpen(false);
  };

  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={original}>
        <GlobalStyles />
        <div
          ref={mainRef}
          className="win95-landing-page min-h-dvh flex flex-col justify-between text-neutral-900 bg-[#008080]"
          dir={isRtl ? "rtl" : "ltr"}
          style={{
            backgroundImage: "url('/windows95_bg.webp')",
            backgroundSize: "cover",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
          }}
        >
          {/* Top Sticky Navigation */}
          <HomeNavbar onOpenResume={handleOpenResume} />

          {/* Main Landing Sections */}
          <main className="flex-1 flex flex-col gap-4 py-4">
            <HeroSection />
            <AboutSection onOpenResume={handleOpenResume} />
            <ProjectsSection />
            <SkillsSection />
            <CertificationsSection />
            <ContactSection />
          </main>

          {/* Bottom Taskbar Footer */}
          <HomeFooter />

          {/* Interactive Resume & Print Modal */}
          <ResumeModal isOpen={isResumeOpen} onClose={handleCloseResume} />
        </div>
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
