"use client";

import { motion } from "framer-motion";
import { projects, type Project } from "@/lib/content";
import { setSceneHover } from "@/lib/scene-store";
import SectionHeading from "@/components/ui/SectionHeading";
import { Stagger, staggerItem } from "@/components/ui/Reveal";
import { ArrowRight } from "@/components/ui/Icons";

const accent: Record<Project["id"], string> = {
  cybersentinel: "group-hover:text-[#7fc8ff]",
  intellicourse: "group-hover:text-graph",
  dailydocs: "group-hover:text-paper",
};

export default function Work() {
  return (
    <section id="work" data-scene="projects" data-nav="work" aria-labelledby="work-title" className="section">
      <div className="shell">
        <SectionHeading index="02" label="Selected work" title="The proof." id="work-title" />
        <p className="body mt-6 max-w-md">
          Three products, three architectures. Hover to load each one into the system; select to open the case study.
        </p>

        <Stagger className="mt-16 border-t border-line md:mt-24" stagger={0.1}>
          {projects.map((p) => {
            const flagship = p.id === "cybersentinel";
            return (
              <motion.article key={p.id} variants={staggerItem} className="border-b border-line">
                <a
                  href={`#${p.id}`}
                  data-cursor="Explore"
                  onMouseEnter={() => setSceneHover(p.id)}
                  onMouseLeave={() => setSceneHover(null)}
                  onFocus={() => setSceneHover(p.id)}
                  onBlur={() => setSceneHover(null)}
                  className="group relative grid gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-14"
                  aria-label={`${p.fullTitle}: ${p.oneLiner} Explore case study.`}
                >
                  <span
                    className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-white/[0.035] to-transparent transition-transform duration-1000 ease-[var(--ease-premium)] group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between md:col-span-1 md:block">
                    <span className="eyebrow text-signal">{p.index}</span>
                    {flagship && <span className="eyebrow mt-3 hidden text-fg md:block">Flagship</span>}
                  </div>

                  <div className="md:col-span-8 lg:col-span-7">
                    <h3
                      className={`font-medium uppercase leading-[0.9] tracking-[-0.045em] transition-colors duration-700 ${accent[p.id]} ${
                        flagship ? "text-[clamp(2.75rem,7vw,6.5rem)]" : "text-[clamp(2.25rem,5vw,4.5rem)]"
                      }`}
                    >
                      {p.title}
                    </h3>
                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                      {p.metrics.map((m) => (
                        <div key={m.label} className="flex items-baseline gap-2.5">
                          <dt className="eyebrow order-2 max-w-[8rem]">{m.label}</dt>
                          <dd
                            className={`${flagship ? "text-[clamp(2rem,3.4vw,3rem)]" : "text-[clamp(1.6rem,2.6vw,2.25rem)]"} font-medium leading-none tracking-[-0.04em]`}
                          >
                            {m.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="lead mt-6 max-w-lg text-dim">{p.oneLiner}</p>
                    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technology">
                      {p.stack.map((s) => (
                        <li key={s} className="tag">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-end md:col-span-3 md:justify-end lg:col-span-4">
                    <span className="eyebrow inline-flex items-center gap-3 text-fg">
                      Explore
                      <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-all duration-700 group-hover:border-fg group-hover:bg-fg group-hover:text-ink">
                        <ArrowRight />
                      </span>
                    </span>
                  </div>
                </a>
              </motion.article>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
