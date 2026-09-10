"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";

const inputClasses =
  "w-full rounded-lg border border-ink/10 bg-cream px-4 py-3 text-sm text-ink placeholder:text-ink/40 transition-colors duration-200 hover:border-ink/20 focus:border-teal focus:outline-none";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          role="status"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-white p-8 text-center shadow-sm"
        >
          <h3 className="text-xl font-semibold text-ink">
            Message received.
          </h3>
          <p className="mt-2 text-sm text-ink/70">
            Thank you for reaching out. A member of our team will follow up
            shortly.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3 }}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="First Name" htmlFor="first_name">
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                autoComplete="given-name"
                className={inputClasses}
                placeholder="First Name"
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClasses}
                placeholder="Email Address"
              />
            </Field>
          </div>

          <Field label="Phone Number" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              className={inputClasses}
              placeholder="Your Phone Number with Country Code"
            />
          </Field>

          <Field label="Your Message" htmlFor="message">
            <textarea
              id="message"
              name="message"
              rows={4}
              className={inputClasses}
              placeholder="How can we help you?"
            />
          </Field>

          <div className="space-y-3">
            <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/70">
              <input
                type="checkbox"
                name="consent_privacy"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 text-teal focus:ring-teal"
              />
              I have read the{" "}
              <Link
                href="/privacy-policy"
                className="text-teal underline underline-offset-2"
              >
                Privacy Policy
              </Link>{" "}
              and understand that EIHE will process my personal data to
              respond to my enquiry. I agree to be contacted by email,
              telephone, or WhatsApp for this purpose.
            </label>
            <label className="flex items-start gap-2.5 text-xs leading-relaxed text-ink/70">
              <input
                type="checkbox"
                name="consent_marketing"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 text-teal focus:ring-teal"
              />
              I would like to receive information about EIHE programs,
              events, and other educational opportunities. I understand that
              I can unsubscribe at any time.
            </label>
          </div>

          <motion.button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-teal px-5 py-3.5 text-sm font-medium text-white shadow-md"
            initial="rest"
            whileHover="hover"
            whileTap={{ scale: 0.96 }}
            variants={{ rest: { scale: 1 }, hover: { scale: 1.035 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Request My Call
            <motion.span
              className="inline-flex"
              variants={{ rest: { x: 0 }, hover: { x: 3 } }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <ArrowIcon className="h-4 w-4" />
            </motion.span>
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}
