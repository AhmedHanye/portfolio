/* eslint-disable react-hooks/immutability */
import { useState, useEffect } from "react";
import * as THREE from "three";
import { useGSAP, ScrollTrigger } from "@/lib/gsap";

export function useScreenContent(
  screenMesh: THREE.Mesh | null,
  originalMaterial: THREE.Material | THREE.Material[] | null
) {
  const [activeContent, setActiveContent] = useState<"bot-face" | "os">("bot-face");

  // Set up ScrollTrigger to track scroll progress of the hero container
  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#hero-scroll-container",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Switch to OS when scroll reaches 90% or more, otherwise display bot face
        const isAtEnd = self.progress >= 0.9;
        setActiveContent(isAtEnd ? "os" : "bot-face");
      },
    });

    // Make sure we evaluate the initial scroll position
    setActiveContent(trigger.progress >= 0.9 ? "os" : "bot-face");

    return () => {
      trigger.kill();
    };
  }, []);

  // Restore the original material when switching away from bot-face or on unmount.
  useEffect(() => {
    if (activeContent === "os" && screenMesh && originalMaterial) {
      screenMesh.material = originalMaterial;
    }
  }, [activeContent, screenMesh, originalMaterial]);

  // Manage visibility of the screen mesh to prevent occlusion of the Html component.
  useEffect(() => {
    if (!screenMesh) return;
    screenMesh.visible = activeContent !== "os";
    return () => {
      screenMesh.visible = true;
    };
  }, [activeContent, screenMesh]);

  return activeContent;
}
