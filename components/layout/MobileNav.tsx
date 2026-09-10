"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav } from "@/config/site";
import { ChevronDownIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-lime"
      >
        {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-20 origin-top bg-cream px-6 py-4 shadow-lg"
          >
            <ul className="flex flex-col gap-1">
              {mainNav.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={openItem === item.label}
                        onClick={() =>
                          setOpenItem((value) =>
                            value === item.label ? null : item.label,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-lime hover:text-sage"
                      >
                        {item.label}
                        <ChevronDownIcon
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${
                            openItem === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {openItem === item.label && (
                          <motion.ul
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3 flex flex-col gap-1 overflow-hidden border-l border-ink/10 pl-3"
                          >
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  onClick={() => setOpen(false)}
                                  className="block rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-lime hover:text-sage"
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-lime hover:text-sage"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
