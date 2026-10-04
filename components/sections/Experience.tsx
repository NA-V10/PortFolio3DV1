"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { education, experience, progression } from "@/lib/content";
import { setSceneFocus } from "@/lib/scene-store";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, ease } from "@/components/ui/Reveal";

type Stop = {
  id: string;
  stage: string;
  title: string;
  org: string;
  /** Employment type / location line; may be empty. */
  meta: string;
  period: string;
  current?: boolean;
  summary?: string;
  points: string[];
  kind: "education" | "role";
};

const stops: Stop[] = [
  {
    id: "xp:vit",
    stage: "Foundation",
    title: education.degree,
    org: education.school,
    meta: education.location,
    period: education.period,
    points: [],
    kind: "education",
  },
  ...experience.map(
    (x): Stop => ({
      id: x.id,
      stage: x.stage,
      title: x.role,
      org: x.company,
      meta: [x.type, x.location].filter(Boolean).join(" · "),
      period: x.period,
      current: x.current,
      summary: x.summary,
      points: x.points,
      kind: "role",
    }),
  ),
];

function Detail({ stop }: { stop: Stop }) {
  return (
    <motion.div
      key={stop.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease }}
      className="grid gap-8 md:grid-cols-12"
    >
      <div className="md:col-span-5">
        <p className="eyebrow flex items-center gap-3 text-signal">
          {stop.kind === "education" ? "Education" : stop.stage}
          {stop.current && (
            <span className="flex items-center gap-1.5 rounded-full border border-signal/40 px-2 py-0.5 text-fg">
              <span className="size-1.5 animate-pulse rounded-full bg-signal" aria-hidden="true" />
              Current
            </span>
          )}
        </p>
        <h3 className="mt-4 text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.03em]">{stop.title}</h3>
        <p className="lead mt-3 text-dim">{stop.org}</p>
        <p className="eyebrow mt-5">{[stop.meta, stop.period].filter(Boolean).join(" · ")}</p>
      </div>
      <div className="md:col-span-7">
        {stop.summary && <p className="lead">{stop.summary}</p>}
        {stop.points.length > 0 && (
          <ul className={`flex flex-wrap gap-2 ${stop.summary ? "mt-6" : ""}`}>
            {stop.points.map((p) => (
              <li key={p} className="tag text-fg">
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}

export default function Experience() {
  const [activeId, setActiveId] = useState(stops[stops.length - 1].id);
  const activeIndex = stops.findIndex((s) => s.id === activeId);
  const active = stops[activeIndex];

  const select = (id: string) => {
    setActiveId(id);
    setSceneFocus(id);
  };

  return (
    <section id="experience" data-scene="experience" data-nav="experience" aria-labelledby="xp-title" className="section">
      <div className="shell">
        <SectionHeading index="07" label="Experience" title="A career, compiled." id="xp-title" />

        <Reveal delay={0.15}>
          <p className="eyebrow mt-10 flex flex-wrap items-center gap-x-3 gap-y-2" aria-label={`Progression: ${progression.join(", ")}`}>
            {progression.map((p, i) => (
              <span key={p} className="flex items-center gap-3" aria-hidden="true">
                <span className={i === progression.length - 1 ? "text-fg" : ""}>{p}</span>
                {i < progression.length - 1 && <span className="text-faint">→</span>}
              </span>
            ))}
          </p>
        </Reveal>

        {/* ---------- Desktop: horizontal spatial track ---------- */}
        <Reveal delay={0.2} className="mt-20 hidden md:block">
          <div className="relative" onMouseLeave={() => setSceneFocus(null)}>
            <div className="absolute left-0 right-0 top-[3.375rem] h-px bg-line" aria-hidden="true">
              <motion.div
                className="absolute inset-y-0 left-0 origin-left bg-signal"
                style={{ width: "100%" }}
                animate={{ scaleX: (activeIndex + 0.5) / (stops.length + 1) }}
                transition={{ duration: 1.1, ease }}
              />
            </div>
            <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${stops.length + 1}, minmax(0, 1fr))` }}>
              {stops.map((s, i) => {
                const on = s.id === activeId;
                const passed = i <= activeIndex;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      aria-controls="xp-detail"
                      onMouseEnter={() => select(s.id)}
                      onFocus={() => select(s.id)}
                      onClick={() => select(s.id)}
                      className="group flex w-full flex-col items-start pr-3 text-left"
                    >
                      <span className={`eyebrow flex h-8 items-end transition-colors duration-500 ${on ? "text-fg" : ""}`}>{s.stage}</span>
                      <span className="relative mt-3 grid size-5 place-items-center">
                        <span
                          className={`absolute inset-0 rounded-full border transition-all duration-700 ${
                            on ? "scale-150 border-signal" : passed ? "border-signal/60" : "border-line-strong"
                          } ${s.kind === "education" ? "rounded-[3px] rotate-45" : ""}`}
                        />
                        <span className={`size-2 rounded-full transition-colors duration-500 ${passed ? "bg-signal" : "bg-faint"}`} />
                      </span>
                      <span className={`mt-6 text-base font-medium leading-tight lg:text-lg tracking-[-0.02em] transition-colors duration-500 ${on ? "text-fg" : "text-dim group-hover:text-fg"}`}>
                        {s.org}
                      </span>
                      <span className="eyebrow mt-2">{s.period.replace(/ – /, " — ")}</span>
                    </button>
                  </li>
                );
              })}
              <li aria-hidden="true" className="flex flex-col items-start">
                <span className="eyebrow flex h-8 items-end text-fg">Agentic Systems</span>
                <span className="relative mt-3 grid size-5 place-items-center">
                  <span className="absolute inset-[-6px] animate-ping rounded-full border border-signal/30 [animation-duration:3s]" />
                  <span className="size-3 rounded-full bg-fg" />
                </span>
                <span className="mt-6 text-base font-medium tracking-[-0.02em] lg:text-lg">Focus</span>
                <span className="eyebrow mt-2">Direction</span>
              </li>
            </ol>
          </div>

          <div id="xp-detail" className="panel mt-14 min-h-[15rem] p-7 lg:p-10" aria-live="polite">
            <AnimatePresence mode="wait">
              <Detail key={active.id} stop={active} />
            </AnimatePresence>
          </div>
        </Reveal>

        {/* ---------- Mobile: vertical track with inline detail ---------- */}
        <ol className="relative mt-14 md:hidden">
          <span className="absolute bottom-2 left-[0.6rem] top-2 w-px bg-line" aria-hidden="true" />
          {stops.map((s) => {
            const on = s.id === activeId;
            return (
              <li key={s.id} className="relative pb-2 pl-10">
                <span
                  className={`absolute left-[0.3rem] top-[1.45rem] size-[0.6rem] rounded-full border transition-colors ${on ? "border-signal bg-signal" : "border-line-strong bg-ink"}`}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`${s.id}-m`}
                  onClick={() => select(s.id)}
                  className="w-full py-4 text-left"
                >
                  <span className="eyebrow block">
                    {s.stage} · {s.period}
                  </span>
                  <span className={`mt-1 block text-xl font-medium tracking-[-0.02em] ${on ? "text-fg" : "text-dim"}`}>{s.org}</span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`${s.id}-m`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6">
                        <p className="font-medium">{s.title}</p>
                        {s.meta && <p className="eyebrow mt-1">{s.meta}</p>}
                        {s.summary && <p className="body mt-4">{s.summary}</p>}
                        {s.points.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-2">
                            {s.points.map((p) => (
                              <li key={p} className="tag">
                                {p}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
          <li className="relative pl-10 pt-4" aria-hidden="true">
            <span className="absolute left-[0.25rem] top-[1.35rem] size-3 rounded-full bg-fg" />
            <span className="eyebrow text-fg">Agentic Systems · Focus</span>
          </li>
        </ol>
      </div>
    </section>
  );
}
