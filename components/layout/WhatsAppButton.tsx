"use client";

import { motion } from "framer-motion";
import { footerSocial } from "@/config/site";
import { WhatsAppIcon } from "@/components/ui/icons";

export function WhatsAppButton() {
  const href = footerSocial.find((s) => s.label === "WhatsApp")?.href;
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 sm:right-6 sm:bottom-6"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
