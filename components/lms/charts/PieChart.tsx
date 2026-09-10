"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";

export type PieDatum = { label: string; value: number; color: string };

const SIZE = 160;
const STROKE = 26;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Donut chart. Categorical — a legend is always shown (2+ slices), with
 * direct percentage labels only on slices large enough to read (>= 8%).
 */
export function PieChart({ data }: { data: PieDatum[] }) {
  const gradientId = useId();
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return <p className="text-sm text-ink/50">No data yet.</p>;
  }

  const positiveData = data.filter((d) => d.value > 0);
  // 2px surface gap between adjacent slices.
  const gap = positiveData.length > 1 ? 2 : 0;

  const { items: slices } = positiveData.reduce<{
    items: Array<PieDatum & { fraction: number; dasharray: string; dashoffset: number; index: number }>;
    cumulative: number;
  }>(
    (acc, d, i) => {
      const fraction = d.value / total;
      const length = fraction * CIRCUMFERENCE;
      const dasharray = `${Math.max(length - gap, 0)} ${CIRCUMFERENCE - Math.max(length - gap, 0)}`;
      return {
        items: [...acc.items, { ...d, fraction, dasharray, dashoffset: -acc.cumulative, index: i }],
        cumulative: acc.cumulative + length,
      };
    },
    { items: [], cumulative: 0 },
  );

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="-rotate-90"
          role="img"
          aria-label="Distribution chart"
        >
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            className="text-ink/[0.06]"
            strokeWidth={STROKE}
          />
          {slices.map((slice) => (
            <motion.circle
              key={`${gradientId}-${slice.label}`}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={slice.color}
              strokeWidth={STROKE}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${CIRCUMFERENCE}` }}
              animate={{
                strokeDasharray: slice.dasharray,
                opacity: hovered === null || hovered === slice.index ? 1 : 0.45,
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ strokeDashoffset: slice.dashoffset }}
              onPointerEnter={() => setHovered(slice.index)}
              onPointerLeave={() => setHovered(null)}
              tabIndex={0}
              role="img"
              aria-label={`${slice.label}: ${slice.value} (${Math.round(slice.fraction * 100)}%)`}
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-ink">{total}</span>
          <span className="text-[11px] font-medium text-ink/50">Total</span>
        </div>
      </div>

      <ul className="w-full space-y-2">
        {data.map((d, i) => (
          <li
            key={d.label}
            className={`flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-sm transition-colors ${
              hovered === i ? "bg-ink/[0.04]" : ""
            }`}
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered(null)}
          >
            <span className="flex items-center gap-2 text-ink/70">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: d.color }}
                aria-hidden="true"
              />
              {d.label}
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-ink">
              {d.value}
              <span className="ml-1 text-xs font-normal text-ink/40">
                ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
