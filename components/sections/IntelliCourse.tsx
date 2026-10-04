"use client";

import { useState } from "react";
import { intelliCourse } from "@/lib/content";
import { setSceneFocus } from "@/lib/scene-store";
import { Reveal, RevealText } from "@/components/ui/Reveal";

const GRAPH = "#b3a3ff";

/** Hybrid retrieval: two inputs fuse, then flow through re-ranking to streaming. */
function RetrievalDiagram() {
  const { inputs, stages } = intelliCourse.retrieval;
  return (
    <figure className="panel overflow-hidden">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 md:px-7">
        <span className="eyebrow text-fg">Hybrid retrieval architecture</span>
        <span className="eyebrow">Query → answer</span>
      </figcaption>
      <div className="px-5 py-7 md:px-7">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {inputs.map((input, i) => (
            <div key={input} className={`rounded-xl border border-line bg-ink-3/70 px-4 py-4 text-center ${i === 1 ? "col-start-3" : ""}`}>
              <p className="eyebrow">Signal {String(i + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-medium tracking-[-0.01em]">{input}</p>
            </div>
          ))}
          <span className="col-start-2 row-start-1 font-mono text-xl text-graph" aria-hidden="true">
            +
          </span>
        </div>

        <svg viewBox="0 0 400 56" className="my-1 h-14 w-full" aria-hidden="true" preserveAspectRatio="none">
          <path d="M 80 0 C 80 34, 200 22, 200 56" fill="none" stroke={GRAPH} strokeOpacity="0.55" className="flow-line" vectorEffect="non-scaling-stroke" />
          <path d="M 320 0 C 320 34, 200 22, 200 56" fill="none" stroke={GRAPH} strokeOpacity="0.55" className="flow-line" vectorEffect="non-scaling-stroke" />
        </svg>

        <ol className="flex flex-col items-center">
          {stages.map((stage, i) => (
            <li key={stage} className="flex w-full flex-col items-center">
              <div
                className={`w-full max-w-sm rounded-xl border px-4 py-4 text-center transition-colors duration-500 ${
                  i === stages.length - 1 ? "border-graph/50 bg-graph/[0.08]" : "border-line bg-ink-3/70 hover:border-line-strong"
                }`}
              >
                <p className="eyebrow">Stage {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 font-medium tracking-[-0.01em]">{stage}</p>
              </div>
              {i < stages.length - 1 && (
                <svg viewBox="0 0 2 40" className="h-10 w-0.5" aria-hidden="true">
                  <line x1="1" y1="0" x2="1" y2="40" stroke={GRAPH} strokeOpacity="0.6" strokeWidth="2" className="flow-line" />
                </svg>
              )}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/** Decorative: one present diverging into several projected futures. */
function TimelineGlyph() {
  const paths = ["M 20 70 C 120 70, 160 22, 300 18", "M 20 70 C 120 70, 170 70, 300 70", "M 20 70 C 120 70, 160 118, 300 122"];
  return (
    <svg viewBox="0 0 320 140" className="h-auto w-full max-w-[22rem]" aria-hidden="true">
      {paths.map((d, i) => (
        <g key={d}>
          <path d={d} fill="none" stroke={GRAPH} strokeOpacity={0.18} />
          <path d={d} fill="none" stroke={GRAPH} strokeOpacity={0.75} className="flow-line" style={{ animationDelay: `${i * 0.4}s` }} />
        </g>
      ))}
      <circle cx="20" cy="70" r="5" fill="#ecebe6" />
      {[18, 70, 122].map((y, i) => (
        <g key={y}>
          <circle cx="300" cy={y} r="4" fill={GRAPH} />
          <text x="300" y={y - 10} textAnchor="end" className="fill-[#9196a0] font-mono text-[9px] tracking-[0.12em]">
            T{i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function IntelliCourse() {
  const [entity, setEntity] = useState<string | null>(null);
  const focus = (id: string | null) => {
    setEntity(id);
    setSceneFocus(id);
  };

  return (
    <section id="intellicourse" data-scene="intellicourse" data-nav="projects" aria-labelledby="ic-title" className="section">
      <div className="shell">
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-4">
              <span className="text-graph">(04)</span>
              <span>Case study 02</span>
            </p>
            <RevealText as="h2" id="ic-title" text={intelliCourse.title} className="display-lg mt-8 uppercase" />
            <Reveal delay={0.15}>
              <p className="lead mt-8 max-w-xl">{intelliCourse.subtitle}</p>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Technology">
                {intelliCourse.stack.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="mt-16 max-w-xl">
              <RetrievalDiagram />
            </Reveal>

            {/* Knowledge graph entities — drive the 3D graph */}
            <Reveal delay={0.2} className="mt-14">
              <p className="eyebrow mb-4">Neo4j knowledge graph · entities</p>
              <div className="flex flex-wrap items-center gap-2" onMouseLeave={() => focus(null)}>
                {intelliCourse.graphEntities.map((e, i) => (
                  <span key={e.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-pressed={entity === e.id}
                      onMouseEnter={() => focus(e.id)}
                      onFocus={() => focus(e.id)}
                      onBlur={() => focus(null)}
                      onClick={() => focus(entity === e.id ? null : e.id)}
                      className={`flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-all duration-500 ${
                        entity === e.id ? "border-graph bg-graph/15 text-fg" : "border-line text-dim hover:text-fg"
                      }`}
                    >
                      <span className="size-1.5 rounded-full bg-graph" aria-hidden="true" />
                      {e.label}
                    </button>
                    {i < intelliCourse.graphEntities.length - 1 && (
                      <span className="text-faint" aria-hidden="true">
                        →
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </Reveal>

            {/* FuturePath */}
            <Reveal delay={0.1} className="mt-20">
              <div className="border-t border-line pt-10">
                <p className="eyebrow text-graph">Feature</p>
                <h3 className="display-md mt-4">{intelliCourse.futurePath.name}</h3>
                <div className="mt-8 grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
                  <p className="lead text-dim">{intelliCourse.futurePath.description}</p>
                  <TimelineGlyph />
                </div>
              </div>
            </Reveal>
          </div>

        </div>

        <Reveal delay={0.1} className="mt-20">
          <p className="eyebrow mb-6">Engineering highlights</p>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {intelliCourse.highlights.map((h, i) => (
              <li key={h} className="group bg-ink-2/90 px-6 py-7 transition-colors duration-500 hover:bg-ink-3">
                <span className="font-mono text-[0.65rem] text-faint transition-colors group-hover:text-graph">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-6 text-xl font-medium tracking-[-0.02em]">{h}</p>
              </li>
            ))}
          </ul>
          {/* PLACEHOLDER: add a repository or live link here once one is public. */}
        </Reveal>
      </div>
    </section>
  );
}
