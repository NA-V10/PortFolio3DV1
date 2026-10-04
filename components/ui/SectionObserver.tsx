"use client";

import { useEffect } from "react";
import { setSceneSection, type SceneMode } from "@/lib/scene-store";

/**
 * Watches every element with `data-scene` and reports whichever one crosses
 * the middle of the viewport. That single signal drives the 3D system and
 * the navigation indicator.
 */
export default function SectionObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          setSceneSection(el.dataset.scene as SceneMode, el.dataset.nav ?? "");
          // Lets CSS recede the 3D layer behind full-width sections.
          document.documentElement.dataset.scene = el.dataset.scene;
        }
      },
      { rootMargin: "-48% 0px -48% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
