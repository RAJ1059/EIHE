"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import { Card } from "@/components/lms/ui/Card";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!token) {
      setError("This reset link is missing its token. Request a new one.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordRequest(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">Reset Password</h1>
        <p className="mt-2 text-sm text-ink/70">Choose a new password for your account.</p>

        <Card className="mt-8">
          {!token ? (
            <p className="text-sm text-red-600">
              This reset link is invalid. Request a new one from the{" "}
              <Link href="/forgot-password" className="font-semibold underline">
                forgot password
              </Link>{" "}
              page.
            </p>
          ) : done ? (
            <p className="text-sm text-ink/80">
              Your password has been reset. Redirecting you to log in…
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <FieldError message={error} />

              <FormButton type="submit" loading={isSubmitting} className="w-full">
                Reset Password
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
