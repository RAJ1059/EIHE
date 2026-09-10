"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const baseItem: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Fades + slides a single block in as it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: baseItem.hidden,
        visible: {
          ...(baseItem.visible as object),
          transition: { duration: 0.7, ease: EASE, delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a list/grid container; children should be <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  id,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** One staggered item inside a <RevealGroup>. */
export function RevealItem({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <motion.div id={id} className={className} variants={baseItem}>
      {children}
    </motion.div>
  );
}
