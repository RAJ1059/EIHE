"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listMyEnrollments, type Enrollment } from "@/lib/api/enrollments";
import { ApiError } from "@/lib/api/client";

export default function MyCoursesPage() {
  const { accessToken } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    listMyEnrollments(accessToken)
      .then(setEnrollments)
      .catch((err) => {
        setEnrollments([]);
        setError(err instanceof ApiError ? err.message : "Could not load your courses.");
      });
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">My Courses</h1>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {enrollments === null && !error && (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      )}

      {enrollments?.length === 0 && (
        <div className="mt-6 rounded-2xl border border-ink/10 bg-white p-8 text-center">
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
        <div className="mt-6 space-y-4">
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
                  href={`/student/courses/${enrollment.course.slug}`}
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
  );
}
