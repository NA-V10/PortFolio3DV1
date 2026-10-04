import type Lenis from "lenis";

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Smooth-scroll to an in-page anchor and keep the URL hash in sync. */
export function scrollToHash(hash: string) {
  const el = hash === "#top" ? document.body : document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (instance) {
    instance.scrollTo(hash === "#top" ? 0 : el, { duration: 1.6, offset: 0 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  history.replaceState(null, "", hash === "#top" ? window.location.pathname : hash);
  // Move keyboard focus to the destination for screen-reader & keyboard users.
  if (hash !== "#top") {
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}

/** Freeze page scrolling (e.g. while the fullscreen menu is open). */
export function lockScroll(locked: boolean) {
  if (locked) instance?.stop();
  else instance?.start();
  document.documentElement.classList.toggle("menu-open", locked);
}
