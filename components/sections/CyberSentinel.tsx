"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { cyberSentinel, projects } from "@/lib/content";
import { setSceneFocus } from "@/lib/scene-store";
import { Reveal, RevealText, ease } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { GitHub } from "@/components/ui/Icons";

/** Which part of the 3D security graph each pipeline stage lights up. */
const stageFocus: Record<string, string | null> = {
  incident: "cs:network",
  detection: "cs:network",
  orchestration: "cs:agents",
  retrieval: null,
  investigation: "cs:tools",
  decision: "cs:llms",
  response: null,
};
const statFocus = ["cs:agents", "cs:tools", "cs:llms"];

export default function CyberSentinel() {
  const repo = projects.find((p) => p.id === "cybersentinel")?.github;
  const stages = cyberSentinel.pipeline;
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const inView = useInView(panel, { margin: "-20% 0px -20% 0px" });
  const reduced = useReducedMotion();

  // Walk the pipeline automatically while it is on screen and idle.
  useEffect(() => {
    if (!inView || hovering || reduced) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % stages.length), 2600);
    return () => window.clearInterval(id);
  }, [inView, hovering, reduced, stages.length]);

  const select = (i: number) => {
    setActive(i);
    setSceneFocus(stageFocus[stages[i].id] ?? null);
  };
  const release = () => {
    setHovering(false);
    setSceneFocus(null);
  };

  return (
    <section
      id="cybersentinel"
      data-scene="cybersentinel"
      data-nav="projects"
      aria-labelledby="cs-title"
      className="section"
    >
      <div className="shell">
        <div className="max-w-[52rem]">
          <p className="eyebrow flex items-center gap-4">
            <span className="text-signal">(03)</span>
            <span>Case study 01</span>
            <span className="rounded-full border border-line-strong px-2.5 py-1 text-fg">Flagship</span>
          </p>
          <h2 id="cs-title" className="display-lg mt-8 uppercase">
            <RevealText text={cyberSentinel.title[0]} className="block" />
            <RevealText text={cyberSentinel.title[1]} className="block text-dim" />
          </h2>
          <Reveal delay={0.15}>
            <p className="lead mt-8 max-w-xl">{cyberSentinel.subtitle}</p>
            <p className="body mt-3 max-w-xl">{projects[0].oneLiner}</p>
          </Reveal>

          <Reveal delay={0.25}>
            <dl className="mt-12 grid max-w-xl grid-cols-3 border-y border-line">
              {cyberSentinel.stats.map((s, i) => (
                <div
                  key={s.label}
                  className="group flex flex-col border-line py-6 pr-4 transition-colors duration-500 hover:bg-white/[0.03] [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-5"
                  onMouseEnter={() => setSceneFocus(statFocus[i])}
                  onMouseLeave={() => setSceneFocus(null)}
                >
                  <dt className="eyebrow order-2 mt-3">{s.label}</dt>
                  <dd className="text-[clamp(2.75rem,6vw,5rem)] font-medium leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-[#7fc8ff]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* ---------------- Architecture ---------------- */}
        <Reveal delay={0.1} className="mt-20 md:mt-28">
          <div ref={panel} className="panel max-w-[52rem] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 md:px-7">
              <p className="eyebrow text-fg">Incident response pipeline</p>
              <p className="eyebrow">{cyberSentinel.architectureNote}</p>
            </div>

            <div className="grid md:grid-cols-[1.15fr_1fr]">
              <ol
                className="relative px-5 py-6 md:px-7 md:py-8"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={release}
                aria-label="Pipeline stages"
              >
                {/* Spine with a travelling signal */}
                <span className="absolute bottom-10 left-[2.3rem] top-10 w-px bg-line md:left-[2.8rem]" aria-hidden="true">
                  <span className="pulse-down absolute left-[-1px] top-0 block h-10 w-[3px] rounded-full bg-gradient-to-b from-transparent via-[#7fc8ff] to-transparent" />
                </span>
                {stages.map((s, i) => {
                  const on = i === active;
                  const passed = i < active;
                  return (
                    <li key={s.id} className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => select(i)}
                        onFocus={() => {
                          setHovering(true);
                          select(i);
                        }}
                        onBlur={release}
                        onClick={() => select(i)}
                        aria-pressed={on}
                        className="group flex w-full items-center gap-4 rounded-lg py-2.5 text-left"
                      >
                        <span
                          className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-700 ${
                            on
                              ? "border-[#7fc8ff] bg-[#7fc8ff] text-ink"
                              : passed
                                ? "border-[#7fc8ff]/50 bg-ink-2 text-[#7fc8ff]"
                                : "border-line-strong bg-ink-2 text-faint"
                          }`}
                        >
                          <span className="font-mono text-[0.6rem]">{String(i + 1).padStart(2, "0")}</span>
                        </span>
                        <span
                          className={`text-[1.05rem] tracking-[-0.01em] transition-colors duration-500 md:text-lg ${on ? "text-fg" : "text-dim group-hover:text-fg"}`}
                        >
                          {s.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="relative flex min-h-[15rem] flex-col justify-between border-t border-line px-5 py-6 md:border-l md:border-t-0 md:px-7 md:py-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.55, ease }}
                    aria-live="polite"
                  >
                    <p className="eyebrow text-[#7fc8ff]">
                      Stage {String(active + 1).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                    </p>
                    <p className="mt-4 text-2xl font-medium tracking-[-0.025em]">{stages[active].label}</p>
                    <p className="body mt-3">{stages[active].detail}</p>
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8">
                  <p className="eyebrow mb-3">Stack</p>
                  <ul className="flex flex-wrap gap-2">
                    {cyberSentinel.stack.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Expandable capability map */}
            <div className="border-t border-line">
              <button
                type="button"
                className="group flex w-full items-center justify-between px-5 py-5 text-left md:px-7"
                aria-expanded={open}
                aria-controls="cs-capabilities"
                onClick={() => setOpen((o) => !o)}
              >
                <span className="eyebrow text-fg">Full capability map · {cyberSentinel.capabilities.length}</span>
                <span className="relative size-4" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-4 bg-fg" />
                  <span
                    className={`absolute left-1/2 top-0 h-4 w-px bg-fg transition-transform duration-500 ${open ? "scale-y-0" : ""}`}
                  />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id="cs-capabilities"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.7, ease }}
                    className="overflow-hidden"
                  >
                    <ul className="grid gap-px bg-line sm:grid-cols-2 md:grid-cols-3">
                      {cyberSentinel.capabilities.map((c, i) => (
                        <li key={c} className="flex items-baseline gap-3 bg-ink-2 px-5 py-4 md:px-7">
                          <span className="font-mono text-[0.65rem] text-faint">{String(i + 1).padStart(2, "0")}</span>
                          <span className="text-[0.95rem]">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {repo && (
          <Reveal delay={0.1} className="mt-10">
            <Button href={repo} icon={<GitHub />} cursor="Open">
              Source on GitHub
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
