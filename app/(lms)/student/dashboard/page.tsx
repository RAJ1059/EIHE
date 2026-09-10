"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listMyEnrollments, type Enrollment } from "@/lib/api/enrollments";
import { getCurriculum } from "@/lib/api/lessons";
import { computeCourseProgress, type CourseProgress } from "@/lib/lms/progress";
import { ApiError } from "@/lib/api/client";
import { Card } from "@/components/lms/ui/Card";
import { ProgressBar } from "@/components/lms/ui/ProgressBar";
import { RevealGroup, RevealItem, Reveal } from "@/components/motion/Reveal";
import { GraduationCapIcon, CheckIcon, ClockIcon } from "@/components/ui/icons";
import { BarChart } from "@/components/lms/charts/BarChart";
import { PieChart } from "@/components/lms/charts/PieChart";

type EnrollmentWithProgress = Enrollment & { progress: CourseProgress };

export default function StudentDashboardPage() {
  const { user, accessToken } = useAuth();
  const [enrollments, setEnrollments] = useState<EnrollmentWithProgress[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    async function load() {
      try {
        const list = await listMyEnrollments(accessToken as string);
        const withProgress = await Promise.all(
          list.map(async (enrollment) => {
            const curriculum = await getCurriculum(enrollment.course.slug, accessToken);
            return { ...enrollment, progress: computeCourseProgress(curriculum) };
          }),
        );
        if (!cancelled) setEnrollments(withProgress);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load your dashboard.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const inProgressCourses = enrollments?.filter(
    (e) => e.progress.percent > 0 && e.progress.percent < 100,
  );
  const inProgress = inProgressCourses?.[0];
  const completedCount = enrollments?.filter((e) => e.progress.percent === 100).length ?? 0;
  const notStartedCount = enrollments?.filter((e) => e.progress.percent === 0).length ?? 0;

  const statCards = [
    { value: enrollments?.length ?? "—", label: "Enrolled Courses", icon: GraduationCapIcon, accent: "bg-teal/10 text-teal" },
    { value: completedCount, label: "Completed Courses", icon: CheckIcon, accent: "bg-green-100 text-green-700" },
    { value: inProgressCourses?.length ?? "—", label: "In Progress", icon: ClockIcon, accent: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-ink/60">{user?.email}</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {statCards.map((stat) => (
          <RevealItem key={stat.label}>
            <Card hoverable>
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${stat.accent}`}>
                <stat.icon className="h-4 w-4" />
              </div>
              <p className="mt-3 text-3xl font-extrabold text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-ink/60">{stat.label}</p>
            </Card>
          </RevealItem>
        ))}
      </RevealGroup>

      {inProgress && (
        <Reveal delay={0.1}>
          <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-sage to-teal p-6 text-white shadow-sm">
            <p className="text-xs font-semibold tracking-wide text-white/80 uppercase">
              Continue Learning
            </p>
            <p className="mt-2 text-lg font-bold">{inProgress.course.title}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
                <div
                  className="h-full rounded-full bg-white transition-all duration-700"
                  style={{ width: `${inProgress.progress.percent}%` }}
                />
              </div>
              <span className="shrink-0 text-sm font-semibold">{inProgress.progress.percent}%</span>
            </div>
            <Link
              href={
                inProgress.progress.nextLesson
                  ? `/student/courses/${inProgress.course.slug}/lesson/${inProgress.progress.nextLesson._id}`
                  : `/student/courses/${inProgress.course.slug}`
              }
              className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-sage transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              Continue Course →
            </Link>
          </div>
        </Reveal>
      )}

      {enrollments && enrollments.length > 0 && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Reveal delay={0.1}>
            <Card className="h-full">
              <h2 className="font-bold text-ink">Course Status</h2>
              <div className="mt-6">
                <PieChart
                  data={[
                    { label: "Completed", value: completedCount, color: "#2cb1bc" },
                    { label: "In Progress", value: inProgressCourses?.length ?? 0, color: "#eda100" },
                    { label: "Not Started", value: notStartedCount, color: "#8b5cf6" },
                  ]}
                />
              </div>
            </Card>
          </Reveal>
          <Reveal delay={0.15}>
            <Card className="h-full">
              <h2 className="font-bold text-ink">Progress by Course</h2>
              <div className="mt-6">
                <BarChart
                  color="var(--color-teal)"
                  formatValue={(v) => `${v}%`}
                  data={enrollments.map((e) => ({
                    label: e.course.title,
                    value: e.progress.percent,
                  }))}
                />
              </div>
            </Card>
          </Reveal>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">My Courses</h2>
          <Link href="/student/courses" className="text-sm font-semibold text-teal hover:underline">
            View all →
          </Link>
        </div>

        <RevealGroup className="mt-4 space-y-3">
          {enrollments === null && !error && (
            <>
              <div className="h-20 animate-pulse rounded-2xl bg-white" />
              <div className="h-20 animate-pulse rounded-2xl bg-white" />
            </>
          )}

          {enrollments?.length === 0 && (
            <Card className="text-center">
              <p className="text-ink/70">You haven&rsquo;t enrolled in any courses yet.</p>
              <Link
                href="/courses"
                className="mt-3 inline-block text-sm font-semibold text-teal hover:underline"
              >
                Browse courses →
              </Link>
            </Card>
          )}

          {enrollments?.map((enrollment) => (
            <RevealItem key={enrollment._id}>
              <Card hoverable className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-ink">{enrollment.course.title}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <ProgressBar percent={enrollment.progress.percent} />
                    <span className="shrink-0 text-xs font-semibold text-ink/60">
                      {enrollment.progress.percent}%
                    </span>
                  </div>
                </div>
                <Link
                  href={`/student/courses/${enrollment.course.slug}`}
                  className="shrink-0 text-sm font-semibold text-teal hover:underline"
                >
                  Continue →
                </Link>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  );
}
