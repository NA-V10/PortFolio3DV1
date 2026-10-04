/**
 * Shared state between the DOM and the persistent 3D system.
 *
 * The WebGL loop reads `sceneState` directly every frame, so pointer/scroll/
 * section changes never cause React re-renders. React components that need
 * to react to the active section subscribe through `useSceneSection`.
 */
import { useSyncExternalStore } from "react";

export type SceneMode =
  | "home"
  | "about"
  | "projects"
  | "cybersentinel"
  | "intellicourse"
  | "dailydocs"
  | "opensource"
  | "experience"
  | "skills"
  | "contact";

export type SceneState = {
  /** Mode driven by the section currently in view. */
  section: SceneMode;
  /** Nav item for the section in view (e.g. "projects"). */
  nav: string;
  /** Temporary override while hovering a project. */
  hover: SceneMode | null;
  /** Highlight key matching node groups (e.g. "oss:jenkins"). */
  focus: string | null;
  /** 0 → 1 page scroll progress. */
  scroll: number;
  /** Normalised pointer, -1 → 1. */
  pointerX: number;
  pointerY: number;
};

export const sceneState: SceneState = {
  section: "home",
  nav: "",
  hover: null,
  focus: null,
  scroll: 0,
  pointerX: 0,
  pointerY: 0,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setSceneSection(mode: SceneMode, nav = "") {
  if (sceneState.section === mode && sceneState.nav === nav) return;
  sceneState.section = mode;
  sceneState.nav = nav;
  emit();
}

export function setSceneHover(mode: SceneMode | null) {
  sceneState.hover = mode;
}

export function setSceneFocus(key: string | null) {
  sceneState.focus = key;
}

export function activeMode(): SceneMode {
  return sceneState.hover ?? sceneState.section;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSceneSection(): SceneMode {
  return useSyncExternalStore(
    subscribe,
    () => sceneState.section,
    () => "home" as SceneMode,
  );
}

export function useActiveNav(): string {
  return useSyncExternalStore(
    subscribe,
    () => sceneState.nav,
    () => "",
  );
}
