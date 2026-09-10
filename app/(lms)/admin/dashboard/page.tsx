"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAdminStatsOverview } from "@/lib/api/admin-stats";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminStatsOverview } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";

const CARDS: {
  key: keyof LmsAdminStatsOverview;
  label: string;
  tag: string;
}[] = [
  { key: "totalStudents", label: "Total Students", tag: "All time" },
  { key: "newStudentsThisWeek", label: "New Students", tag: "Last 7 days" },
  { key: "totalInstructors", label: "Instructors & Admins", tag: "Active" },
  { key: "totalCourses", label: "Total Courses", tag: "All statuses" },
  { key: "publishedCourses", label: "Published Courses", tag: "Live" },
  { key: "pendingReviewCourses", label: "Pending Review", tag: "Needs approval" },
  { key: "totalEnrollments", label: "Total Enrollments", tag: "All time" },
  { key: "newEnrollmentsThisWeek", label: "New Enrollments", tag: "Last 7 days" },
];

export default function AdminDashboardPage() {
  const { user, accessToken } = useAuth();
  const [stats, setStats] = useState<LmsAdminStatsOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    getAdminStatsOverview(accessToken)
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load dashboard stats.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-ink/60">Role: {user?.role}</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Card key={card.key}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                {card.tag}
              </p>
            </div>
            <p className="mt-4 text-3xl font-extrabold text-ink">
              {stats ? stats[card.key] : (
                <span className="inline-block h-8 w-12 animate-pulse rounded bg-cream align-middle" />
              )}
            </p>
            <p className="mt-1 text-sm text-ink/60">{card.label}</p>
          </Card>
        ))}
      </div>

      {stats && stats.pendingReviewCourses > 0 && (
        <Card className="mt-6 flex items-center justify-between">
          <p className="text-sm text-ink/70">
            <span className="font-semibold text-ink">{stats.pendingReviewCourses}</span>{" "}
            course{stats.pendingReviewCourses === 1 ? "" : "s"} waiting on your review.
          </p>
          <Link
            href="/admin/course-approval"
            className="text-sm font-semibold text-teal hover:underline"
          >
            Review now →
          </Link>
        </Card>
      )}

      <Card className="mt-6">
        <p className="text-sm text-ink/70">
          Revenue and payment analytics will appear here once the Razorpay checkout module is
          built — not shown yet since there&rsquo;s no real payment data to report.
        </p>
        <Link
          href="/admin/courses"
          className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
        >
          Go to Course management →
        </Link>
      </Card>
    </div>
  );
}
