"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Card } from "@/components/lms/ui/Card";

export default function StudentDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Loading…</p>
      </div>
    );
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Welcome, {user.name}</h1>
            <p className="mt-1 text-sm text-ink/60">{user.email}</p>
          </div>
          <button
            onClick={() => logout().then(() => router.push("/login"))}
            className="rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink hover:border-ink/30"
          >
            Log Out
          </button>
        </div>

        <Card className="mt-8">
          <p className="text-sm text-ink/70">
            &ldquo;My Courses&rdquo;, progress tracking, quiz results, and
            certificates will appear here once the Enrollment and Progress
            modules are built in a later phase — not faked in this pass.
          </p>
          <Link
            href="/courses"
            className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
          >
            Browse courses →
          </Link>
        </Card>
      </div>
    </section>
  );
}
