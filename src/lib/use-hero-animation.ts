import { gsap, useGSAP, SplitText } from "./gsap";

/**
 * Custom hook to handle Hero component animations.
 * Animates the heading and description text using GSAP and SplitText.
 * 
 * @param scope The container ref to scope the animations
 */
export const useHeroAnimation = (scope: React.RefObject<HTMLElement | null>) => {
  useGSAP(
    () => {
      if (!scope.current) return;

      const tl = gsap.timeline();

      // Split the heading into words/chars for a premium feel
      const headingSplit = new SplitText("h1", { type: "words,chars" });
      const descriptionSplit = new SplitText("p", { type: "lines" });

      tl.from(headingSplit.chars, {
        opacity: 0,
        y: 20,
        rotateX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
      .from(descriptionSplit.lines, {
        opacity: 0,
        y: 10,
        stagger: 0.1,
        duration: 0.6,
      }, "-=0.4");
    },
    { scope }
  );
};
