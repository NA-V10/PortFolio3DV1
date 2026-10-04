import { cyberSentinel, experience, intro, openSource, projects } from "@/lib/content";
import { Reveal, RevealText } from "@/components/ui/Reveal";

/** Every number is derived from content.ts, so the strip stays true as content changes. */
const agents = cyberSentinel.stats.find((s) => s.label === "Agents")?.value ?? "";
const proof = [
  { value: "15+", label: "Merged open-source PRs", detail: openSource.repos.slice(0, 2).map((r) => r.name).join(", ") + " & more" },
  { value: agents, label: "Orchestrated agents", detail: "CyberSentinel" },
  { value: String(projects.length), label: "Featured products", detail: projects.map((p) => p.title).join(" · ") },
  { value: String(experience.length), label: "Roles", detail: `${experience[0].stage} → ${experience[experience.length - 1].stage}` },
];

export default function Intro() {
  return (
    <section id="intro" data-scene="about" aria-labelledby="intro-title" className="section">
      <div className="shell">
        <p className="eyebrow flex items-center gap-4">
          <span className="text-signal">(01)</span>
          <span>Introduction</span>
          <span className="hairline hidden flex-1 sm:block" aria-hidden="true" />
        </p>

        <h2 id="intro-title" className="display-lg mt-10 max-w-[16ch]">
          <RevealText text={intro.headline[0]} className="block text-dim" />
          <RevealText text={intro.headline[1]} className="block" />
        </h2>

        <Reveal delay={0.2}>
          <p className="lead mt-10 max-w-2xl">{intro.statement}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <dl className="grid grid-cols-2 border-y border-line lg:max-w-[58rem] lg:grid-cols-4">
            {proof.map((p, i) => (
              <div
                key={p.label}
                className={`group flex flex-col py-7 pr-5 transition-colors duration-500 hover:bg-white/[0.025] ${
                  i % 2 === 1 ? "border-l border-line pl-5" : ""
                } ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:pl-5" : ""}`}
              >
                <dt className="eyebrow order-2 mt-3 text-fg">{p.label}</dt>
                <dd className="text-[clamp(2.5rem,5vw,4.25rem)] font-medium leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-signal">
                  {p.value}
                </dd>
                <dd className="eyebrow order-3 mt-1.5 normal-case tracking-[0.04em]">{p.detail}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal delay={0.15} className="mt-16 md:mt-20">
          <p className="eyebrow mb-6">Focus areas</p>
          <ul className="flex max-w-[64rem] flex-wrap gap-x-3 gap-y-1 text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.03em]">
            {intro.focus.map((f, i) => (
              <li key={f} className="flex items-center gap-3 text-dim transition-colors duration-500 hover:text-fg">
                {f}
                {i < intro.focus.length - 1 && (
                  <span className="text-[0.5em] text-faint" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
