"use client";
import { useRef } from "react";
import { useHeroAnimation } from "@/lib/use-hero-animation";
import Spline from "@splinetool/react-spline";

const Hero = () => {
  const containerRef = useRef<HTMLElement>(null);
  useHeroAnimation(containerRef);

  return (
    <section
      ref={containerRef}
      className="justify-left overt relative flex h-svh items-center overflow-hidden p-20"
    >
      <div className="absolute top-0 left-1/2 size-full -translate-x-1/2">
        <Spline scene="workspace.splinecode" />
      </div>
      <div className="z-10 flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold">Hi, I&apos;m Ahmed Hanye</h1>
        <p className="text-muted-foreground">
          Software Engineer Specializing in modern web development
        </p>
      </div>
    </section>
  );
};

export default Hero;
