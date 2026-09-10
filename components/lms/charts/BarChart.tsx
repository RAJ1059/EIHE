"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type BarDatum = { label: string; value: number };

/**
 * Horizontal bar chart. Single-series nominal categorical (each bar is a
 * different real-world entity, not a separate series) — so every bar takes
 * the same hue and there's no legend box; the card title names the metric.
 */
export function BarChart({
  data,
  color = "var(--color-teal)",
  formatValue = (v: number) => String(v),
}: {
  data: BarDatum[];
  color?: string;
  formatValue?: (value: number) => string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.value));

  if (data.length === 0) {
    return <p className="text-sm text-ink/50">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const isHovered = hovered === i;
        return (
          <div
            key={d.label}
            className="group"
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            tabIndex={0}
            role="img"
            aria-label={`${d.label}: ${formatValue(d.value)}`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="truncate pr-2 font-medium text-ink/70">{d.label}</span>
              <span
                className={`shrink-0 font-semibold tabular-nums transition-colors ${
                  isHovered ? "text-ink" : "text-ink/50"
                }`}
              >
                {formatValue(d.value)}
              </span>
            </div>
            <div className="mt-1 h-3 w-full rounded-full bg-ink/[0.06]">
              <motion.div
                className="h-3 rounded-full"
                style={{ backgroundColor: color, opacity: isHovered ? 1 : 0.85 }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
