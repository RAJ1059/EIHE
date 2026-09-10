"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type PortalNavItem = { href: string; label: string };

const VARIANTS = {
  light: {
    idle: "text-ink hover:bg-cream",
    active: "text-sage",
    pill: "bg-sage/10",
  },
  dark: {
    idle: "text-white/75 hover:bg-white/10 hover:text-white",
    active: "text-white",
    pill: "bg-white/15",
  },
} as const;

export function PortalSidebarNav({
  items,
  layoutId,
  variant = "light",
  className = "mt-4 space-y-1",
}: {
  items: PortalNavItem[];
  layoutId: string;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  const pathname = usePathname();
  const styles = VARIANTS[variant];

  return (
    <nav className={className}>
      {items.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className="relative block">
            <motion.div
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? styles.active : styles.idle
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className={`absolute inset-0 rounded-lg ${styles.pill}`}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
