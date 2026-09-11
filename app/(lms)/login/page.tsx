"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { homePathForRole } from "@/lib/auth/roles";
import { ApiError } from "@/lib/api/client";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import { Card } from "@/components/lms/ui/Card";
import { GoogleSignInButton } from "@/components/lms/ui/GoogleSignInButton";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from "@/components/ui/icons";

// Only ever follow an internal, single-segment-rooted path from ?next= —
// never an absolute/protocol-relative URL, which would be an open redirect.
function safeNextPath(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function goToNext(role: Parameters<typeof homePathForRole>[0]) {
    const next = safeNextPath(searchParams.get("next"));
    router.push(next ?? homePathForRole(role));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      goToNext(loggedInUser.role);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleCredential(idToken: string) {
    setError(null);
    setIsSubmitting(true);
    try {
      const loggedInUser = await loginWithGoogle(idToken);
      goToNext(loggedInUser.role);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-3xl font-extrabold tracking-tight text-sage"
        >
          Log In
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="mt-2 text-sm text-ink/70"
        >
          Welcome back. Log in to continue your courses.
        </motion.p>

        <Card
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-teal hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11 pl-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink/70"
                >
                  {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                key={error}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                transition={{ duration: 0.4 }}
              >
                <FieldError message={error} />
              </motion.div>
            )}

            <FormButton type="submit" loading={isSubmitting} className="w-full">
              Log In
            </FormButton>
          </form>

          <div className="mt-6">
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isSubmitting} />
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-ink/70">
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="font-semibold text-teal hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}
