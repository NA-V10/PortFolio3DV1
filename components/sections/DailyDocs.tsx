"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { dailyDocs, projects } from "@/lib/content";
import { Reveal, RevealText, ease } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { GitHub } from "@/components/ui/Icons";

function Page({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`relative rounded-md border border-paper/30 bg-paper/[0.06] transition-all duration-1000 ${compact ? "h-14 w-11" : "h-[4.5rem] w-14"}`}
      aria-hidden="true"
    >
      <span className="absolute right-0 top-0 size-3 rounded-bl-md border-b border-l border-paper/30 bg-ink" />
      <span className="absolute inset-x-2 top-5 grid gap-1.5">
        {[0, 1, 2].map((l) => (
          <span key={l} className="h-px bg-paper/40" style={{ width: `${100 - l * 22}%` }} />
        ))}
      </span>
    </div>
  );
}

/** Upload → in-memory processing → packaged for a portal preset. Nothing is stored. */
function ProcessingStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduced = useReducedMotion();
  const [preset, setPreset] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setPreset((p) => (p + 1) % dailyDocs.presets.length), 2800);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="panel overflow-hidden" role="img" aria-label="Animation: a document is processed in memory and packaged for a government portal preset, with nothing stored on a server.">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <span className="eyebrow text-fg">Processing</span>
        <span className="eyebrow flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-oss" aria-hidden="true" /> Stored on server: none
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-3 px-5 py-8 sm:gap-5">
        <div className="flex flex-col items-center gap-3">
          <Page />
          <span className="eyebrow">Upload</span>
        </div>
        <span className="relative h-px bg-line" aria-hidden="true">
          <span className="flow-line absolute inset-0 border-t border-dashed border-paper/40" />
        </span>
        <div className="flex flex-col items-center gap-3">
          <div className="relative grid size-[4.5rem] place-items-center overflow-hidden rounded-full border border-paper/30">
            <span className="absolute inset-x-0 top-0 h-px bg-paper/70 [animation:scan_2.8s_var(--ease-premium)_infinite] [--scan:4.4rem]" />
            <span className="font-mono text-[0.6rem] tracking-[0.16em] text-dim">RAM</span>
          </div>
          <span className="eyebrow">In-memory</span>
        </div>
        <span className="relative h-px bg-line" aria-hidden="true">
          <span className="flow-line absolute inset-0 border-t border-dashed border-paper/40" />
        </span>
        <div className="flex flex-col items-center gap-3">
          <Page compact />
          <span className="eyebrow relative h-4 w-24 overflow-hidden text-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={preset}
                className="absolute inset-0 text-paper"
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.6, ease }}
              >
                {dailyDocs.presets[preset]}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DailyDocs() {
  const repo = projects.find((p) => p.id === "dailydocs")?.github;
  return (
    <section id="dailydocs" data-scene="dailydocs" data-nav="projects" aria-labelledby="dd-title" className="section">
      <div className="shell grid lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="eyebrow flex items-center gap-4">
            <span className="text-paper">(05)</span>
            <span>Case study 03</span>
          </p>
          <RevealText as="h2" id="dd-title" text={dailyDocs.title} className="display-lg mt-8 uppercase" />
          <Reveal delay={0.15}>
            <p className="lead mt-8">{dailyDocs.subtitle}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology">
              {dailyDocs.stack.map((t) => (
                <li key={t} className="tag">
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2} className="mt-12">
            <p className="text-[clamp(1.6rem,3vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.03em]">
              {dailyDocs.differentiator.map((line, i) => (
                <span key={line} className={`block ${i === 0 ? "" : "text-dim"}`}>
                  {line}
                </span>
              ))}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <ProcessingStrip />
          </Reveal>

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <Reveal delay={0.1}>
              <p className="eyebrow mb-4">Capabilities</p>
              <ul className="divide-y divide-line border-y border-line">
                {dailyDocs.capabilities.map((c) => (
                  <li key={c} className="py-3 text-[0.95rem]">
                    {c}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="eyebrow mb-4">Portal-specific presets</p>
              <ul className="flex flex-wrap gap-2">
                {dailyDocs.presets.map((p) => (
                  <li key={p} className="tag border-paper/25 text-paper">
                    {p}
                  </li>
                ))}
              </ul>
              <p className="body mt-5">{dailyDocs.presetNote}</p>
            </Reveal>
          </div>

          {repo && (
            <Reveal delay={0.1} className="mt-12">
              <Button href={repo} icon={<GitHub />} cursor="Open">
                Source on GitHub
              </Button>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
