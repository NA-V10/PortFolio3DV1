"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, profile } from "@/lib/content";
import { useActiveNav } from "@/lib/scene-store";
import { lockScroll } from "@/lib/scroll";
import { ease } from "./ui/Reveal";

export default function Nav() {
  const active = useActiveNav();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    lockScroll(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  const activeLabel = nav.find((n) => n.href === `#${active}`)?.label;

  return (
    <>
      <a
        href="#main"
        className="eyebrow fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-fg px-4 py-2 text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`shell flex items-center justify-between transition-[padding] duration-700 ${scrolled ? "py-4" : "py-6 md:py-8"}`}
        >
          <a href="#top" className="group flex items-center gap-3" aria-label="Naveen B, back to top">
            <span className="relative grid size-7 place-items-center" aria-hidden="true">
              <span className="absolute inset-0 rotate-45 rounded-[4px] border border-line-strong transition-transform duration-700 group-hover:rotate-[135deg]" />
              <span className="size-1.5 rounded-full bg-signal" />
            </span>
            <span className="text-[0.95rem] font-medium tracking-[-0.01em]">NAVEEN B</span>
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full border border-line bg-ink/70 px-2 py-1.5 backdrop-blur-md">
              {nav.map((item) => {
                const isActive = item.href === `#${active}`;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={`eyebrow relative isolate block rounded-full px-3.5 py-2 transition-colors duration-500 hover:text-fg ${isActive ? "text-fg" : ""}`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                          transition={{ duration: 0.7, ease }}
                        />
                      )}
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            {/* Small indicator of where you are inside the system. */}
            <p className="eyebrow hidden items-center gap-2 md:flex lg:hidden xl:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-signal" aria-hidden="true" />
              <span className="min-w-[7rem]">{activeLabel ?? "Index"}</span>
            </p>
            <button
              ref={toggle}
              type="button"
              className="eyebrow flex h-10 items-center gap-3 rounded-full border border-line-strong bg-ink/60 px-4 text-fg lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span>{open ? "Close" : "Menu"}</span>
              <span className="relative block h-2 w-4" aria-hidden="true">
                <span
                  className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${open ? "top-1 rotate-45" : "top-0"}`}
                />
                <span
                  className={`absolute left-0 h-px w-4 bg-current transition-all duration-500 ${open ? "top-1 -rotate-45" : "top-2"}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-5 pb-10 pt-28"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="flex flex-col">
                {nav.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-line py-4 text-[2.25rem] font-medium leading-none tracking-[-0.03em]"
                    >
                      <span className="eyebrow w-6">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="eyebrow flex flex-wrap gap-x-6 gap-y-3">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
