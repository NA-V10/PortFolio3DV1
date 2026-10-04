"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sceneState } from "@/lib/scene-store";
import type { Quality } from "./SystemScene";
import StaticCore from "./StaticCore";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

type Capability = { quality: Quality; reducedMotion: boolean } | "none";

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

function detect(): Capability {
  if (!hasWebGL()) return "none";
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return "none";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  let quality: Quality = "high";
  if (width < 768) quality = "low";
  else if (width < 1200 || cores <= 4) quality = "medium";
  return { quality, reducedMotion };
}

/**
 * Persistent background for the whole page. A CSS core paints immediately;
 * the WebGL system mounts once the browser is idle and fades in over it.
 */
export default function SceneLoader() {
  const [cap, setCap] = useState<Capability | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setCap(detect());
    const hasIdle = "requestIdleCallback" in window;
    const id = hasIdle ? window.requestIdleCallback(run, { timeout: 1200 }) : window.setTimeout(run, 200);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      sceneState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      sceneState.pointerY = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      if (hasIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  const show3D = cap !== null && cap !== "none";

  return (
    <div className="scene-layer" aria-hidden="true">
      <div className={`scene-fallback ${ready ? "is-hidden" : ""}`}>
        <StaticCore />
      </div>
      {show3D && (
        <div className={`scene-canvas ${ready ? "is-ready" : ""}`}>
          <SceneCanvas quality={cap.quality} reducedMotion={cap.reducedMotion} onReady={() => setReady(true)} />
        </div>
      )}
      <div className="scene-vignette" />
    </div>
  );
}
