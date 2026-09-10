"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type PortalNavItem = { href: string; label: string };

export function PortalSidebarNav({
  items,
  layoutId,
  className = "mt-4 space-y-1",
}: {
  items: PortalNavItem[];
  layoutId: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {items.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
        return (
          <Link key={item.href} href={item.href} className="relative block">
            <motion.div
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active ? "text-sage" : "text-ink hover:bg-cream"
              }`}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {active && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-lg bg-sage/10"
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
