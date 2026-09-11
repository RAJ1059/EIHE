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
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

type EnrollmentWithProgress = Enrollment & { progress: CourseProgress };

const STATUS_STYLES: Record<Enrollment["status"], string> = {
  ACTIVE: "bg-teal/15 text-teal",
  COMPLETED: "bg-green-100 text-green-700",
  EXPIRED: "bg-ink/10 text-ink/50",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function MyCoursesPage() {
  const { accessToken } = useAuth();
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
        setEnrollments([]);
        setError(err instanceof ApiError ? err.message : "Could not load your courses.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">My Courses</h1>
      <p className="mt-1 text-sm text-ink/60">Everything you&rsquo;re enrolled in, in one place.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {enrollments === null && !error && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white" />
          ))}
        </div>
      )}

      {enrollments?.length === 0 && (
        <Card className="mt-6 text-center">
          <p className="text-ink/70">You haven&rsquo;t enrolled in any courses yet.</p>
          <Link
            href="/student/courses/browse"
            className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
          >
            Browse courses →
          </Link>
        </Card>
      )}

      {enrollments && enrollments.length > 0 && (
        <RevealGroup className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment) => (
            <RevealItem key={enrollment._id}>
              <Card hoverable className="flex h-full flex-col overflow-hidden !p-0">
                <div className="relative h-36 w-full bg-ink/5">
                  {enrollment.course.featuredImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={enrollment.course.featuredImage}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span
                    className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[enrollment.status]}`}
                  >
                    {enrollment.status}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-bold text-sage">{enrollment.course.title}</h3>
                  <p className="mt-1 text-xs text-ink/50">
                    Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1">
                      <ProgressBar percent={enrollment.progress.percent} />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-ink/60">
                      {enrollment.progress.percent}%
                    </span>
                  </div>

                  <Link
                    href={`/student/courses/${enrollment.course.slug}`}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {enrollment.progress.percent > 0 ? "Continue" : "Start"} Learning →
                  </Link>
                </div>
              </Card>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
