"use client";

import { motion, type Variants } from "framer-motion";
import { Fragment, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

/** Fade + rise into view, once. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 1.1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

const container: Variants = {
  hidden: {},
  shown: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};
const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p, span: motion.span };

const word: Variants = {
  hidden: { y: "108%" },
  shown: { y: "0%", transition: { duration: 1.05, ease } },
};

/** Masked, word-by-word text reveal. The full string stays in the DOM for SEO / AT. */
export function RevealText({
  text,
  as = "span",
  className,
  stagger = 0.045,
  id,
}: {
  text: string;
  as?: keyof typeof tags;
  className?: string;
  stagger?: number;
  id?: string;
}) {
  const Tag = tags[as];
  const words = text.split(" ");
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={container}
      custom={stagger}
    >
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span aria-hidden="true" className="mask-word">
            <motion.span className="inline-block will-change-transform" variants={word}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Staggered children list. */
export function Stagger({ children, className, stagger = 0.06 }: { children: ReactNode; className?: string; stagger?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={container}
      custom={stagger}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};
