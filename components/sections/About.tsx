import { about, certifications, education } from "@/lib/content";
import { Reveal, RevealText } from "@/components/ui/Reveal";

export default function About() {
  return (
    <section id="about" data-scene="about" data-nav="about" aria-labelledby="about-title" className="section">
      <div className="shell">
        <p className="eyebrow flex items-center gap-4">
          <span className="text-signal">(09)</span>
          <span id="about-title">About</span>
          <span className="hairline hidden flex-1 sm:block" aria-hidden="true" />
        </p>

        <div className="mt-10 max-w-[64rem]">
          <RevealText
            as="p"
            text={about.statement}
            className="text-[clamp(2rem,4.6vw,4.25rem)] font-medium leading-[1.02] tracking-[-0.038em]"
            stagger={0.03}
          />
        </div>

        <Reveal delay={0.15} className="mt-14">
          <ul className="flex flex-wrap gap-2">
            {about.pillars.map((p) => (
              <li key={p} className="rounded-full border border-line-strong px-5 py-2.5 text-[0.95rem] transition-colors duration-500 hover:border-fg">
                {p}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-24 grid gap-4 md:grid-cols-2 lg:max-w-[78rem] lg:grid-cols-3">
          <Reveal delay={0.05}>
            <article className="panel group relative h-full overflow-hidden p-6 md:p-8">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Education</p>
                <span className="size-3 rotate-45 rounded-[2px] border border-signal" aria-hidden="true" />
              </div>
              <h3 className="mt-10 text-2xl font-medium tracking-[-0.025em]">{education.school}</h3>
              <p className="body mt-1">{education.location}</p>
              <p className="mt-6 text-[0.95rem]">{education.degree}</p>
              <p className="eyebrow mt-2">{education.period}</p>
            </article>
          </Reveal>
          {certifications.map((cert, i) => (
            <Reveal key={cert.name} delay={0.12 + i * 0.07}>
              <article className="panel group relative h-full overflow-hidden p-6 md:p-8">
                <div className="flex items-center justify-between">
                  <p className="eyebrow">Certification</p>
                  <span className="grid size-5 place-items-center rounded-full border border-signal" aria-hidden="true">
                    <span className="size-1.5 rounded-full bg-signal" />
                  </span>
                </div>
                <h3 className="mt-10 text-2xl font-medium tracking-[-0.025em]">{cert.name}</h3>
                <p className="body mt-1">{cert.issuer}</p>
                {(cert.code || cert.date) && (
                  <p className="eyebrow mt-6">
                    {[cert.code, cert.date && `Issued ${cert.date}`].filter(Boolean).join(" · ")}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
