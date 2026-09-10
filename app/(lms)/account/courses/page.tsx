"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listMyEnrollments, type Enrollment } from "@/lib/api/enrollments";
import { ApiError } from "@/lib/api/client";

export default function MyCoursesPage() {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!accessToken) return;
    listMyEnrollments(accessToken)
      .then(setEnrollments)
      .catch((err) => {
        setEnrollments([]);
        setError(err instanceof ApiError ? err.message : "Could not load your courses.");
      });
  }, [accessToken]);

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
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">My Courses</h1>

        <div className="mt-6 flex gap-4 text-sm font-semibold">
          <Link href="/account" className="text-ink/60 hover:text-teal">
            My Account
          </Link>
          <span className="text-teal">My Courses</span>
          <Link href="/cart" className="text-ink/60 hover:text-teal">
            My Cart
          </Link>
        </div>

        {error && <p className="mt-8 text-sm text-red-600">{error}</p>}

        {enrollments === null && !error && (
          <div className="mt-8 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        )}

        {enrollments?.length === 0 && (
          <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-8 text-center">
            <p className="text-ink/70">You haven&rsquo;t enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
            >
              Browse courses →
            </Link>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <div className="mt-8 space-y-4">
            {enrollments.map((enrollment) => (
              <div
                key={enrollment._id}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div>
                  <h3 className="font-bold text-sage">{enrollment.course.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal">
                    {enrollment.status}
                  </span>
                  <Link
                    href={`/account/courses/${enrollment.course.slug}`}
                    className="text-sm font-semibold text-sage hover:underline"
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
