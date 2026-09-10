"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import type { ComponentProps } from "react";
import { ArrowIcon } from "@/components/ui/icons";

type Variant = "primary" | "inverse" | "ghost";

type CommonProps = {
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentProps<typeof Link>,
    | "href"
    | "className"
    | "children"
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
  >;

const MotionLink = motion.create(Link);

const base =
  "inline-flex items-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap transition-shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal";

const variants: Record<Variant, string> = {
  primary: "bg-teal px-5 py-3.5 text-white shadow-md hover:shadow-lg",
  inverse: "bg-white px-5 py-3.5 text-teal shadow-md hover:shadow-lg",
  ghost:
    "rounded-none px-0 py-0 text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink",
};

const containerVariants: Record<Variant, Variants> = {
  primary: { rest: { scale: 1 }, hover: { scale: 1.035 } },
  inverse: { rest: { scale: 1 }, hover: { scale: 1.035 } },
  ghost: { rest: {}, hover: {} },
};

const arrowVariants: Variants = {
  rest: { x: 0 },
  hover: { x: 3 },
};

export function Button({
  href,
  variant = "primary",
  withArrow = true,
  className = "",
  children,
  ...rest
}: ButtonAsLink) {
  return (
    <MotionLink
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      variants={containerVariants[variant]}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...rest}
    >
      {children}
      {withArrow && (
        <motion.span
          className="inline-flex"
          variants={arrowVariants}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ArrowIcon className="h-4 w-4" />
        </motion.span>
      )}
    </MotionLink>
  );
}
