import { RevealText } from "./Reveal";

type Props = {
  index: string;
  label: string;
  title?: string;
  id?: string;
  className?: string;
};

/** Mono index + hairline + large display title, used to open every section. */
export default function SectionHeading({ index, label, title, id, className = "" }: Props) {
  return (
    <header className={className}>
      <p className="eyebrow flex items-center gap-4">
        <span className="text-signal">({index})</span>
        <span>{label}</span>
        <span className="hairline hidden flex-1 sm:block" aria-hidden="true" />
      </p>
      {title && <RevealText as="h2" text={title} className="display-lg mt-6" id={id} />}
    </header>
  );
}
