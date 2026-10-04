import { contact, profile } from "@/lib/content";
import { Reveal, RevealText } from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { GitHub, LinkedIn } from "@/components/ui/Icons";

export default function Contact() {
  return (
    <section
      id="contact"
      data-scene="contact"
      data-nav="contact"
      aria-labelledby="contact-title"
      className="relative flex min-h-[100svh] flex-col justify-center py-32"
    >
      <div className="shell">
        <p className="eyebrow flex items-center gap-4">
          <span className="text-signal">(10)</span>
          <span>Contact</span>
        </p>
        <RevealText as="h2" id="contact-title" text={contact.statement} className="display-xl mt-10 max-w-[12ch]" stagger={0.06} />
        <Reveal delay={0.25}>
          <p className="lead mt-10 max-w-xl text-dim">{contact.supporting}</p>
        </Reveal>

        <Reveal delay={0.35} className="mt-12">
          <div className="flex flex-wrap gap-3">
            <Button href={profile.github} variant="solid" icon={<GitHub />} cursor="Open">
              GitHub
            </Button>
            <Button href={profile.linkedin} icon={<LinkedIn />} cursor="Open">
              LinkedIn
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
