"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerLenis, scrollToHash } from "@/lib/scroll";
import { sceneState } from "@/lib/scene-store";

/** Lenis smooth scrolling (skipped for reduced motion) + scroll progress + anchor routing. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduced ? null : new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
    registerLenis(lenis);

    let raf = 0;
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      sceneState.scroll = max > 0 ? window.scrollY / max : 0;
    };
    const loop = (time: number) => {
      lenis?.raf(time);
      updateProgress();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Intercept in-page anchor clicks so every link uses the same smooth path.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash === "#") return;
      e.preventDefault();
      scrollToHash(hash);
    };
    document.addEventListener("click", onClick);

    // Deep links: honour a hash on first load once layout has settled.
    if (window.location.hash) {
      const hash = window.location.hash;
      window.setTimeout(() => {
        const el = document.querySelector(hash);
        if (el && lenis) lenis.scrollTo(el as HTMLElement, { immediate: true });
      }, 60);
    }

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick);
      lenis?.destroy();
      registerLenis(null);
    };
  }, []);

  return null;
}
