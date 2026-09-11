"use client";

import { motion } from "framer-motion";
import { cn } from "./cn";

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-teal" : "bg-ink/15",
        )}
      >
        <motion.span
          layout
          className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
      {label && <span className="text-sm font-medium text-ink/70">{label}</span>}
    </label>
  );
}
