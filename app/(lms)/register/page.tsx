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
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, PersonIcon } from "@/components/ui/icons";

// Only ever follow an internal, single-segment-rooted path from ?next= —
// never an absolute/protocol-relative URL, which would be an open redirect.
function safeNextPath(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle } = useAuth();
  const [name, setName] = useState("");
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
      const registeredUser = await register(name, email, password);
      goToNext(registeredUser.role);
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
      const registeredUser = await loginWithGoogle(idToken);
      goToNext(registeredUser.role);
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
          Create your account
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: "easeOut" }}
          className="mt-2 text-sm text-ink/70"
        >
          Register to browse and enroll in EIHE programs.
        </motion.p>

        <Card
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <PersonIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <Input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink/30" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              Create Account
            </FormButton>
          </form>

          <div className="mt-6">
            <GoogleSignInButton onCredential={handleGoogleCredential} disabled={isSubmitting} />
          </div>
        </Card>

        <p className="mt-6 text-center text-sm text-ink/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-teal hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
