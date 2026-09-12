"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { submitForm } from "@/lib/api/form-submissions";
import { ApiError } from "@/lib/api/client";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import { FormButton } from "@/components/lms/ui/FormButton";
import { DownloadIcon, CloseIcon } from "@/components/ui/icons";

export function BrochureDownloadModal({
  open,
  onClose,
  brochureUrl,
  courseId,
}: {
  open: boolean;
  onClose: () => void;
  brochureUrl: string;
  courseId: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleClose() {
    onClose();
    // Reset after the close animation finishes so the form is fresh next
    // time it opens, instead of resetting mid-close and flashing content.
    setTimeout(() => {
      setName("");
      setEmail("");
      setPhone("");
      setError(null);
      setSubmitted(false);
    }, 200);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await submitForm({ formType: "BROCHURE_DOWNLOAD", name, email, phone, courseId });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not submit the form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-bold text-ink">
                {submitted ? "Thank you!" : "Download Brochure"}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="text-ink/40 hover:text-ink"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="mt-4 text-center">
                <p className="text-sm text-ink/70">
                  Your details have been received. Click below to download the brochure.
                </p>
                <a
                  href={brochureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.97]"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download Now
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <p className="text-sm text-ink/60">
                  Enter your details to download the course brochure.
                </p>
                <div>
                  <Label htmlFor="brochure-name">Full name</Label>
                  <Input
                    id="brochure-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="brochure-email">Email</Label>
                  <Input
                    id="brochure-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="brochure-phone">Phone</Label>
                  <Input
                    id="brochure-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <FieldError message={error} />
                <FormButton type="submit" loading={isSubmitting} className="w-full">
                  Submit
                </FormButton>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
