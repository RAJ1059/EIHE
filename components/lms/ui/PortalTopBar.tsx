"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function PortalTopBar({
  label,
  userName,
  onLogout,
}: {
  label: string;
  userName: string;
  onLogout: () => void;
}) {
  return (
    <header className="relative flex items-center justify-between overflow-hidden bg-gradient-to-r from-sage to-teal px-6 py-3.5 shadow-sm">
      <Link href="/" className="group relative z-10 flex items-center gap-2.5">
        <motion.div
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm"
        >
          <Image src={siteConfig.logo} alt="EIHE logo" width={20} height={20} className="h-5 w-5" />
        </motion.div>
        <span className="text-sm font-semibold tracking-wide text-white">{label}</span>
      </Link>
      <div className="relative z-10 flex items-center gap-4">
        <span className="hidden text-sm text-white/85 sm:inline">{userName}</span>
        <motion.button
          type="button"
          onClick={onLogout}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
        >
          Log Out
        </motion.button>
      </div>
    </header>
  );
}
