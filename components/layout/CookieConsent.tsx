"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon, LockIcon, ShieldIcon, ArrowIcon } from "@/components/ui/icons";

const STORAGE_KEY = "eihe_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Deliberate post-mount read: localStorage isn't available during SSR,
    // so the consent state can only be known after mount — rendering
    // hidden-then-shown here is correct, not a state-sync anti-pattern.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // Private browsing / blocked storage — just show it every visit rather
      // than crash; there's nothing safe to persist in that case anyway.
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "rejected") {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Ignore — see above.
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-label="Cookie consent"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-2xl rounded-2xl border border-ink/10 bg-white p-8 shadow-xl sm:p-10"
          >
            <button
              type="button"
              onClick={() => respond("rejected")}
              aria-label="Close"
              className="absolute top-5 right-5 text-ink/40 hover:text-ink"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
              <ShieldIcon className="h-6 w-6" />
            </span>

            <p className="mt-5 text-xs font-semibold tracking-[0.15em] text-teal uppercase">
              Privacy &amp; Cookies
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
              We care about your privacy
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-ink/70 sm:text-base">
              We use our own and third-party cookies for analytical purposes and ads
              personalisation. This helps us provide you with a better browsing experience and
              relevant content.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/70 sm:text-base">
              You can choose whether to accept or reject these cookies.
            </p>

            <Link
              href="/legal-notice"
              className="mt-3 inline-block text-sm font-semibold text-teal underline underline-offset-2 hover:no-underline"
            >
              Read our Legal Notice
            </Link>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => respond("accepted")}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sage to-teal px-5 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.97]"
              >
                Accept
                <ArrowIcon className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => respond("rejected")}
                className="flex-1 rounded-full border border-ink/10 bg-cream px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/20"
              >
                Reject
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5 text-xs text-ink/50">
              <span>Your privacy matters to us</span>
              <span className="flex items-center gap-1.5 font-semibold text-teal">
                <LockIcon className="h-3.5 w-3.5" />
                Secure browsing
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
