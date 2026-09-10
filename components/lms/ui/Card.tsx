"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "./cn";

export function Card({
  className,
  hoverable = false,
  ...props
}: HTMLMotionProps<"div"> & { hoverable?: boolean }) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl border border-ink/5 bg-white p-6 shadow-sm transition-shadow",
        hoverable && "cursor-pointer hover:shadow-md",
        className,
      )}
      whileHover={hoverable ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    />
  );
}
