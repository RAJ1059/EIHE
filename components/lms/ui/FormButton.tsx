"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-sage text-white hover:opacity-90",
  secondary: "bg-white text-ink border border-ink/15 hover:border-ink/30",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export function FormButton({
  variant = "primary",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  loading?: boolean;
  children?: ReactNode;
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
      disabled={isDisabled}
      whileHover={isDisabled ? undefined : { scale: 1.03 }}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </motion.button>
  );
}
