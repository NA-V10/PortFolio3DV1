"use client";

import { useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { SystemEngine, type Quality } from "./engine";

export type { Quality };

/**
 * React boundary for the persistent 3D system. All per-frame work lives in
 * SystemEngine so the render loop never touches React state.
 */
export default function SystemScene({ quality, reducedMotion }: { quality: Quality; reducedMotion: boolean }) {
  const [engine] = useState(() => new SystemEngine({ quality, reducedMotion }));

  useEffect(() => () => engine.dispose(), [engine]);

  useFrame((state, delta) => {
    engine.update(state.camera, state.size, state.clock.elapsedTime, delta);
  });

  return <primitive object={engine.root} />;
}
