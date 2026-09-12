"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { MenuIcon } from "@/components/ui/icons";

export function PortalTopBar({
  label,
  userName,
  onLogout,
  onMenuClick,
}: {
  label: string;
  userName: string;
  onLogout: () => void;
  /** Toggles the off-canvas sidebar on narrow screens — the button that
   * calls this is hidden at the `lg` breakpoint, where the sidebar is
   * always visible instead. */
  onMenuClick: () => void;
}) {
  return (
    <header className="relative grid grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden bg-gradient-to-r from-sage to-teal px-4 py-3.5 shadow-sm sm:px-6">
      <div className="relative z-10 flex min-w-0 items-center gap-2 justify-self-start">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
          className="-ml-1 shrink-0 rounded-lg p-1.5 text-white hover:bg-white/10 lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <Link href="/" className="group flex min-w-0 items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
          >
            <Image src={siteConfig.logo} alt="EIHE logo" width={20} height={20} className="h-5 w-5" />
          </motion.div>
          <span className="truncate text-sm font-semibold tracking-wide text-white">{label}</span>
        </Link>
      </div>

      <span className="hidden truncate text-center text-sm font-semibold tracking-wide text-white/90 lg:block">
        {siteConfig.fullName}
      </span>

      <div className="relative z-10 flex items-center gap-3 justify-self-end">
        <span className="hidden text-sm text-white/85 sm:inline">{userName}</span>
        <ThemeToggle />
        <motion.button
          type="button"
          onClick={onLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="shrink-0 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
        >
          Log Out
        </motion.button>
      </div>
    </header>
  );
}
