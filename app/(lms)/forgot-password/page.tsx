"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { forgotPasswordRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import { Card } from "@/components/lms/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await forgotPasswordRequest(email);
      // Always show the same success state — the backend never reveals
      // whether an account exists for this email either.
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">Forgot Password</h1>
        <p className="mt-2 text-sm text-ink/70">
          Enter your account email and we&rsquo;ll send you a link to reset your password.
        </p>

        <Card className="mt-8">
          {submitted ? (
            <p className="text-sm text-ink/80">
              If an account exists for <span className="font-semibold">{email}</span>,
              we&rsquo;ve sent a password reset link to it. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <FieldError message={error} />

              <FormButton type="submit" loading={isSubmitting} className="w-full">
                Send Reset Link
              </FormButton>
            </form>
          )}
        </Card>

        <p className="mt-6 text-center text-sm text-ink/70">
          <Link href="/login" className="font-semibold text-teal hover:underline">
            ← Back to Log In
          </Link>
        </p>
      </div>
    </section>
  );
}
