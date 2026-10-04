import { profile } from "@/lib/content";
import Button from "@/components/ui/Button";
import { ArrowDown, ArrowRight, GitHub } from "@/components/ui/Icons";

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

/** Proof points visible inside the first viewport. */
const proof = [
  { href: "#cybersentinel", label: "CyberSentinel", meta: "12 agents · 9 MCP tools" },
  { href: "#intellicourse", label: "IntelliCourse AI", meta: "Hybrid retrieval · Graph" },
  { href: "#open-source", label: "Open Source", meta: "15+ merged PRs" },
];

export default function Hero() {
  return (
    <section
      id="top"
      data-scene="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col justify-end pb-8 pt-32 md:pb-10"
    >
      <div className="shell flex flex-1 flex-col justify-center">
        <div className="max-w-[56rem]">
          <p className="eyebrow hero-rise flex items-center gap-3" style={d(0.2)}>
            <span className="inline-block size-1.5 rounded-full bg-signal" aria-hidden="true" />
            {profile.role} — {profile.specialization}
          </p>

          <h1 id="hero-title" className="display-xl mt-7">
            <span className="mask-word">
              <span className="hero-mask" style={d(0.35)}>
                NAVEEN
              </span>
            </span>{" "}
            <span className="mask-word">
              <span className="hero-mask text-signal" style={d(0.45)}>
                B
              </span>
            </span>
            <span className="sr-only">
              , {profile.role}, {profile.specialization}
            </span>
          </h1>

          <p className="hero-rise mt-8 max-w-[34rem] text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium leading-[1.08] tracking-[-0.03em]" style={d(0.7)}>
            {profile.headline}
          </p>
          <p className="body hero-rise mt-5 max-w-[30rem]" style={d(0.85)}>
            {profile.supporting}
          </p>

          <div className="hero-rise mt-10 flex flex-wrap gap-3" style={d(1)}>
            <Button href="#work" variant="solid" icon={<ArrowRight />} cursor="View">
              View work
            </Button>
            <Button href={profile.github} icon={<GitHub />} cursor="Open">
              View GitHub
            </Button>
          </div>
        </div>
      </div>

      <div className="shell hero-rise mt-16" style={d(1.2)}>
        <div className="grid gap-6 border-t border-line pt-6 md:grid-cols-12 md:items-end">
          <div className="eyebrow md:col-span-3">
            <p className="text-fg">{profile.location}</p>
            <p className="mt-2">{profile.focus.join(" • ")}</p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-line sm:grid-cols-3 md:col-span-7" aria-label="Proof of work">
            {proof.map((p) => (
              <li key={p.href} className="bg-ink-2/70">
                <a href={p.href} className="group flex h-full flex-col gap-1 px-4 py-3 transition-colors duration-500 hover:bg-white/[0.04]">
                  <span className="flex items-center justify-between text-sm font-medium">
                    {p.label}
                    <ArrowRight className="opacity-40 transition-all duration-500 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </span>
                  <span className="eyebrow">{p.meta}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#intro" className="eyebrow hidden items-center justify-end gap-2 hover:text-fg md:col-span-2 md:flex">
            Scroll <ArrowDown />
          </a>
        </div>
      </div>
    </section>
  );
}
