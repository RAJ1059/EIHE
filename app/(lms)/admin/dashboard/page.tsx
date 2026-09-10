"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAdminStatsOverview } from "@/lib/api/admin-stats";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminStatsOverview } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";
import { BarChart } from "@/components/lms/charts/BarChart";
import { PieChart } from "@/components/lms/charts/PieChart";
import {
  PeopleIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  CheckIcon,
  ClockIcon,
  DocumentIcon,
} from "@/components/ui/icons";

// Validated categorical palette for course status (see dataviz skill):
// teal (brand/live), amber (needs action), violet (neutral/draft), red
// (inactive) — all pass the CVD + lightness + chroma checks together.
const STATUS_COLORS = {
  PUBLISHED: "#2cb1bc",
  PENDING_REVIEW: "#eda100",
  DRAFT: "#8b5cf6",
  ARCHIVED: "#ef4444",
} as const;

const CARDS: {
  key: keyof LmsAdminStatsOverview;
  label: string;
  tag: string;
  icon: typeof PeopleIcon;
  accent: string;
}[] = [
  { key: "totalStudents", label: "Total Students", tag: "All time", icon: PeopleIcon, accent: "bg-teal/10 text-teal" },
  { key: "newStudentsThisWeek", label: "New Students", tag: "Last 7 days", icon: PeopleIcon, accent: "bg-sage/10 text-sage" },
  { key: "totalInstructors", label: "Instructors & Admins", tag: "Active", icon: BriefcaseIcon, accent: "bg-purple-100 text-purple-600" },
  { key: "totalCourses", label: "Total Courses", tag: "All statuses", icon: GraduationCapIcon, accent: "bg-teal/10 text-teal" },
  { key: "publishedCourses", label: "Published Courses", tag: "Live", icon: CheckIcon, accent: "bg-green-100 text-green-700" },
  { key: "pendingReviewCourses", label: "Pending Review", tag: "Needs approval", icon: ClockIcon, accent: "bg-amber-100 text-amber-700" },
  { key: "totalEnrollments", label: "Total Enrollments", tag: "All time", icon: DocumentIcon, accent: "bg-sage/10 text-sage" },
  { key: "newEnrollmentsThisWeek", label: "New Enrollments", tag: "Last 7 days", icon: DocumentIcon, accent: "bg-teal/10 text-teal" },
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

      <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {CARDS.map((card) => (
          <RevealItem key={card.key}>
            <Card hoverable>
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${card.accent}`}>
                <card.icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-xs font-semibold tracking-wide text-ink/40 uppercase">
                {card.tag}
              </p>
              <p className="mt-1 text-3xl font-extrabold text-ink">
                {stats ? stats[card.key] : (
                  <span className="inline-block h-8 w-12 animate-pulse rounded bg-cream align-middle" />
                )}
              </p>
              <p className="mt-1 text-sm text-ink/60">{card.label}</p>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      {stats && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <Card className="h-full">
              <h2 className="font-bold text-ink">Courses by Status</h2>
              <div className="mt-6">
                <PieChart
                  data={[
                    { label: "Published", value: stats.publishedCourses, color: STATUS_COLORS.PUBLISHED },
                    { label: "Pending Review", value: stats.pendingReviewCourses, color: STATUS_COLORS.PENDING_REVIEW },
                    { label: "Draft", value: stats.draftCourses, color: STATUS_COLORS.DRAFT },
                    { label: "Archived", value: stats.archivedCourses, color: STATUS_COLORS.ARCHIVED },
                  ]}
                />
              </div>
            </Card>
          </Reveal>
          <Reveal delay={0.15}>
            <Card className="h-full">
              <h2 className="font-bold text-ink">People &amp; Enrollments</h2>
              <div className="mt-6">
                <BarChart
                  color="var(--color-teal)"
                  data={[
                    { label: "Students", value: stats.totalStudents },
                    { label: "Instructors & Admins", value: stats.totalInstructors },
                    { label: "Total Enrollments", value: stats.totalEnrollments },
                    { label: "Active Enrollments", value: stats.activeEnrollments },
                  ]}
                />
              </div>
            </Card>
          </Reveal>
        </div>
      )}

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
          Revenue and payment analytics will appear here once real orders start coming through —
          not shown yet since there&rsquo;s no live payment data to report.
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
