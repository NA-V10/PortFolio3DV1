"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { openSource, ossNodeCount, profile } from "@/lib/content";
import type { GitHubStats } from "@/lib/github";
import { setSceneFocus } from "@/lib/scene-store";
import { Reveal, RevealText, ease } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { ArrowUpRight, GitHub } from "@/components/ui/Icons";

const OSS = "#7ee2b8";
const repos = openSource.repos;
const CX = 320;
const CY = 230;

/** Round SVG coordinates so server (Node) and browser render identical strings. */
const r2 = (v: number) => Math.round(v * 100) / 100;

const placed = repos.map((repo, i) => {
  const a = (i / repos.length) * Math.PI * 2 - Math.PI / 2;
  const n = ossNodeCount(repo);
  return { repo, n, x: r2(CX + Math.cos(a) * 225), y: r2(CY + Math.sin(a) * 160), r: r2(13 + n * 2.6) };
});

function Constellation({ active, onHover }: { active: string | null; onHover: (id: string | null) => void }) {
  return (
    <svg viewBox="0 0 640 470" className="h-auto w-full" aria-hidden="true" onMouseLeave={() => onHover(null)}>
      <defs>
        <radialGradient id="oss-glow">
          <stop offset="0%" stopColor={OSS} stopOpacity="0.25" />
          <stop offset="100%" stopColor={OSS} stopOpacity="0" />
        </radialGradient>
      </defs>
      {placed.map(({ repo, x, y }) => (
        <line
          key={`l-${repo.id}`}
          x1={CX}
          y1={CY}
          x2={x}
          y2={y}
          stroke={OSS}
          strokeOpacity={active === null || active === repo.id ? 0.45 : 0.1}
          className="flow-line transition-[stroke-opacity] duration-700"
        />
      ))}
      <circle cx={CX} cy={CY} r="70" fill="url(#oss-glow)" />
      <circle cx={CX} cy={CY} r="20" fill="#0b0d11" stroke="#ecebe6" strokeOpacity="0.5" />
      <text x={CX} y={CY + 4} textAnchor="middle" className="fill-[#ecebe6] font-mono text-[9px] tracking-[0.1em]">
        {profile.githubHandle}
      </text>

      {placed.map(({ repo, n, x, y, r }) => {
        const on = active === repo.id;
        const dim = active !== null && !on;
        return (
          <g
            key={repo.id}
            onMouseEnter={() => onHover(repo.id)}
            className="cursor-pointer transition-opacity duration-700"
            style={{ opacity: dim ? 0.3 : 1 }}
          >
            <circle cx={x} cy={y} r={r + 26} fill="transparent" />
            <circle cx={x} cy={y} r={r + 16} fill="none" stroke={OSS} strokeOpacity={on ? 0.35 : 0.12} strokeDasharray="2 4" />
            <g className="orbit" style={{ transformOrigin: `${x}px ${y}px`, animationDuration: `${10 + n * 2}s` }}>
              {Array.from({ length: n }, (_, k) => {
                const a = (k / n) * Math.PI * 2;
                return <circle key={k} cx={r2(x + Math.cos(a) * (r + 16))} cy={r2(y + Math.sin(a) * (r + 16))} r={on ? 4.5 : 3.5} fill={OSS} />;
              })}
            </g>
            <circle
              cx={x}
              cy={y}
              r={r}
              fill={on ? OSS : "#0b0d11"}
              stroke={OSS}
              strokeOpacity={on ? 1 : 0.6}
              className="transition-[fill] duration-500"
            />
            <text x={x} y={y + r + 42} textAnchor="middle" className="fill-[#ecebe6] font-mono text-[10px] uppercase tracking-[0.14em]">
              {repo.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function GitHubPanel({ stats }: { stats: GitHubStats | null }) {
  const nf = new Intl.NumberFormat("en-IN");
  const items = stats
    ? [
        { label: "Public repositories", value: nf.format(stats.publicRepos) },
        { label: "Original repositories", value: nf.format(stats.ownRepos) },
        { label: "Stars on original work", value: nf.format(stats.stars) },
        { label: "Followers", value: nf.format(stats.followers) },
      ]
    : [];
  return (
    <div className="panel overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 md:px-7">
        <p className="eyebrow flex items-center gap-2 text-fg">
          <GitHub /> github.com/{profile.githubHandle}
        </p>
        <p className="eyebrow">{stats ? "Live · public API" : "Live data unavailable"}</p>
      </div>
      {stats ? (
        <div className="grid gap-px bg-line md:grid-cols-[1fr_1.1fr]">
          <dl className="grid grid-cols-2 gap-px">
            {items.map((it) => (
              <div key={it.label} className="flex flex-col bg-ink-2 px-5 py-6 md:px-7">
                <dt className="eyebrow order-2 mt-2">{it.label}</dt>
                <dd className="text-3xl font-medium tracking-[-0.035em]">{it.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col justify-between gap-6 bg-ink-2 px-5 py-6 md:px-7">
            {stats.languages.length > 0 && (
              <div>
                <p className="eyebrow mb-4">Languages · original repositories</p>
                <div className="flex h-1.5 overflow-hidden rounded-full bg-ink-3" aria-hidden="true">
                  {stats.languages.map((l, i) => (
                    <span key={l.name} style={{ width: `${l.share * 100}%`, background: OSS, opacity: 1 - i * 0.17 }} />
                  ))}
                </div>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                  {stats.languages.map((l) => (
                    <li key={l.name} className="font-mono text-xs text-dim">
                      <span className="text-fg">{l.name}</span> {Math.round(l.share * 100)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stats.lastPush && (
              <p className="body text-sm">
                Latest push:{" "}
                <a href={stats.lastPush.url} target="_blank" rel="noopener noreferrer" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg">
                  {stats.lastPush.repo}
                </a>{" "}
                ·{" "}
                {stats.lastPush.label}
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="body px-5 py-6 md:px-7">Repositories, contributions and activity are available on GitHub.</p>
      )}
    </div>
  );
}

export default function OpenSource({ stats }: { stats: GitHubStats | null }) {
  const [active, setActive] = useState<string | null>(null);
  const hover = (id: string | null) => {
    setActive(id);
    setSceneFocus(id);
  };
  const current = repos.find((r) => r.id === active) ?? null;

  return (
    <section id="open-source" data-scene="opensource" data-nav="open-source" aria-labelledby="oss-title" className="section">
      <div className="shell">
        <p className="eyebrow flex items-center gap-4">
          <span className="text-oss">(06)</span>
          <span>Open source</span>
          <span className="hairline hidden flex-1 sm:block" aria-hidden="true" />
        </p>

        <div className="mt-10 grid items-end gap-8 lg:grid-cols-12">
          <h2 id="oss-title" className="lg:col-span-7">
            <span className="block text-[clamp(6rem,20vw,17rem)] font-medium leading-[0.8] tracking-[-0.06em] text-oss">
              <RevealText text="15+" />
            </span>
            <span className="display-md mt-6 block max-w-2xl">
              <RevealText text="merged pull requests across major engineering projects." stagger={0.03} />
            </span>
          </h2>
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="body max-w-sm">
              Each repository is a node. Each highlighted merged PR orbits it. Hover a repository to read the contribution.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5" delay={0.1}>
            <ul className="border-t border-line" onMouseLeave={() => hover(null)}>
              {repos.map((r) => {
                const on = active === r.id;
                return (
                  <li key={r.id} className="border-b border-line">
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`${r.id}-detail`}
                      onMouseEnter={() => hover(r.id)}
                      onFocus={() => hover(r.id)}
                      onClick={() => hover(on ? null : r.id)}
                      className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <span className={`text-xl font-medium tracking-[-0.02em] transition-colors duration-500 md:text-2xl ${on ? "text-oss" : "group-hover:text-fg"}`}>
                        {r.name}
                      </span>
                      <span className="eyebrow shrink-0">{r.prs ? `${r.prs} merged PRs` : "Merged contribution"}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.div
                          id={`${r.id}-detail`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.6, ease }}
                          className="overflow-hidden"
                        >
                          <div className="pb-6">
                            <p className="body">{r.summary}</p>
                            {r.topics && (
                              <ul className="mt-4 flex flex-wrap gap-2">
                                {r.topics.map((t) => (
                                  <li key={t} className="tag border-oss/25 text-oss">
                                    {t}
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
            </ul>
          </Reveal>

          <Reveal className="relative lg:col-span-7" delay={0.2}>
            <Constellation active={active} onHover={hover} />
            <p className="eyebrow pointer-events-none absolute bottom-0 left-0 h-4" aria-hidden="true">
              {current ? current.name : "Contribution constellation"}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-20">
          <GitHubPanel stats={stats} />
          <div className="mt-8">
            <Button href={profile.github} variant="solid" icon={<ArrowUpRight />} cursor="Open">
              Explore GitHub
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
