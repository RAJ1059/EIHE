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

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Welcome, {user?.name}</h1>
      <p className="mt-1 text-sm text-ink/60">{user?.email}</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-3xl font-extrabold text-ink">{enrollments?.length ?? "—"}</p>
          <p className="mt-1 text-sm text-ink/60">Enrolled Courses</p>
        </Card>
        <Card>
          <p className="text-3xl font-extrabold text-ink">{completedCount}</p>
          <p className="mt-1 text-sm text-ink/60">Completed Courses</p>
        </Card>
        <Card>
          <p className="text-3xl font-extrabold text-ink">{inProgressCourses?.length ?? "—"}</p>
          <p className="mt-1 text-sm text-ink/60">In Progress</p>
        </Card>
      </div>

      {inProgress && (
        <Card className="mt-6">
          <p className="text-xs font-semibold tracking-wide text-teal uppercase">
            Continue Learning
          </p>
          <p className="mt-2 text-lg font-bold text-ink">{inProgress.course.title}</p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar percent={inProgress.progress.percent} />
            <span className="shrink-0 text-sm font-semibold text-ink/70">
              {inProgress.progress.percent}%
            </span>
          </div>
          <Link
            href={
              inProgress.progress.nextLesson
                ? `/student/courses/${inProgress.course.slug}/lesson/${inProgress.progress.nextLesson._id}`
                : `/student/courses/${inProgress.course.slug}`
            }
            className="mt-4 inline-flex items-center justify-center rounded-full bg-sage px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
          >
            Continue Course →
          </Link>
        </Card>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">My Courses</h2>
          <Link href="/student/courses" className="text-sm font-semibold text-teal hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
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
            <Card key={enrollment._id} className="flex items-center justify-between gap-4">
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
          ))}
        </div>
      </div>
    </div>
  );
}
