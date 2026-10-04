"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import SystemScene, { type Quality } from "./SystemScene";

type Props = { quality: Quality; reducedMotion: boolean; onReady: () => void };

/** Heavy WebGL entry point — only ever loaded through a dynamic import. */
export default function SceneCanvas({ quality, reducedMotion, onReady }: Props) {
  const maxDpr = quality === "high" ? 1.75 : quality === "medium" ? 1.4 : 1;
  const [dpr, setDpr] = useState(maxDpr);

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 9], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        requestAnimationFrame(onReady);
      }}
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => setDpr((d) => Math.max(1, d - 0.35))}
        onIncline={() => setDpr((d) => Math.min(maxDpr, d + 0.2))}
        flipflops={3}
        onFallback={() => setDpr(1)}
      />
      <SystemScene quality={quality} reducedMotion={reducedMotion} />
    </Canvas>
  );
}
