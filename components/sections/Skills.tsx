"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { skills } from "@/lib/content";
import { setSceneFocus } from "@/lib/scene-store";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, ease } from "@/components/ui/Reveal";

export default function Skills() {
  const [index, setIndex] = useState(1);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = skills[index];

  const choose = (i: number) => {
    setIndex(i);
    setSceneFocus(skills[i].id);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = index;
    if (e.key in keys) next = (index + keys[e.key] + skills.length) % skills.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = skills.length - 1;
    else return;
    e.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="skills" data-scene="skills" data-nav="" aria-labelledby="skills-title" className="section">
      <div className="shell">
        <SectionHeading index="08" label="Capabilities" title="The toolkit." id="skills-title" />

        <Reveal delay={0.15} className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-12">
          <div
            role="tablist"
            aria-label="Skill categories"
            aria-orientation="vertical"
            className="flex gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-line lg:pb-0"
            onKeyDown={onKey}
            onMouseLeave={() => setSceneFocus(null)}
          >
            {skills.map((cat, i) => {
              const on = i === index;
              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`${cat.id}-tab`}
                  aria-selected={on}
                  aria-controls="skills-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => choose(i)}
                  onMouseEnter={() => choose(i)}
                  className={`group flex shrink-0 items-center justify-between gap-6 rounded-full border px-4 py-2.5 text-left transition-colors duration-500 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-5 ${
                    on ? "border-fg text-fg" : "border-line text-dim hover:text-fg"
                  }`}
                >
                  <span className="text-sm font-medium tracking-[-0.01em] lg:text-xl">{cat.label}</span>
                  <span className={`eyebrow hidden lg:inline ${on ? "text-signal" : ""}`}>{String(cat.items.length).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="skills-panel"
            aria-labelledby={`${current.id}-tab`}
            tabIndex={0}
            className="panel relative min-h-[20rem] overflow-hidden p-6 md:p-10 lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.div key={current.id} initial="hidden" animate="shown" exit="exit">
                <motion.p
                  className="eyebrow"
                  variants={{ hidden: { opacity: 0 }, shown: { opacity: 1 }, exit: { opacity: 0 } }}
                  transition={{ duration: 0.4 }}
                >
                  {current.label} · {current.items.length} nodes
                </motion.p>
                <ul className="mt-8 flex flex-wrap gap-3">
                  {current.items.map((item, i) => (
                    <motion.li
                      key={item}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease, delay: i * 0.035 } },
                        exit: { opacity: 0, y: -8, transition: { duration: 0.25 } },
                      }}
                    >
                      <span className="group flex h-12 items-center gap-3 rounded-full border border-line bg-ink-3/60 pl-3 pr-5 text-[0.95rem] transition-all duration-500 hover:-translate-y-0.5 hover:border-signal/60 hover:bg-signal/[0.06] md:h-14 md:text-lg">
                        <span className="relative grid size-5 place-items-center" aria-hidden="true">
                          <span className="absolute inset-0 rounded-full border border-line-strong transition-colors duration-500 group-hover:border-signal" />
                          <span className="size-1.5 rounded-full bg-dim transition-colors duration-500 group-hover:bg-signal" />
                        </span>
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* All skills, always present for search engines and assistive tech that skip tabs. */}
        <details className="mt-8 text-dim">
          <summary className="eyebrow cursor-pointer select-none hover:text-fg">View all as a list</summary>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {skills.map((cat) => (
              <div key={cat.id}>
                <dt className="eyebrow text-fg">{cat.label}</dt>
                <dd className="body mt-2 text-sm">{cat.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}
