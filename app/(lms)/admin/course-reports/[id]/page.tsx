"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCourseReport } from "@/lib/api/admin-course-reports";
import { ApiError } from "@/lib/api/client";
import type { LmsCourseDetailReport } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { ProgressBar } from "@/components/lms/ui/ProgressBar";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export default function AdminCourseReportDetailPage() {
  const params = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [report, setReport] = useState<LmsCourseDetailReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    getCourseReport(accessToken, params.id)
      .then((result) => {
        if (!cancelled) setReport(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load this report.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, params.id]);

  return (
    <div>
      <Link
        href="/admin/course-reports"
        className="text-sm font-semibold text-teal hover:underline"
      >
        ← All course reports
      </Link>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!report && !error && (
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
      )}

      {report && (
        <>
          <h1 className="mt-4 text-2xl font-bold text-ink">{report.course.title}</h1>

          <RevealGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <RevealItem>
              <Card>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Enrollments
                </p>
                <p className="mt-1 text-3xl font-extrabold text-ink">{report.totalEnrollments}</p>
                <p className="mt-1 text-sm text-ink/60">{report.activeEnrollments} active</p>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Lessons
                </p>
                <p className="mt-1 text-3xl font-extrabold text-ink">{report.totalLessons}</p>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Quizzes
                </p>
                <p className="mt-1 text-3xl font-extrabold text-ink">{report.totalQuizzes}</p>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card>
                <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                  Completed
                </p>
                <p className="mt-1 text-3xl font-extrabold text-ink">
                  {report.completedStudents}
                </p>
                <p className="mt-1 text-sm text-ink/60">student{report.completedStudents === 1 ? "" : "s"}</p>
              </Card>
            </RevealItem>
          </RevealGroup>

          <Card className="mt-6">
            <h2 className="font-bold text-ink">Average Completion</h2>
            <p className="mt-1 text-sm text-ink/60">
              Across all actively enrolled students in this course.
            </p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex-1">
                <ProgressBar percent={report.averageCompletionPercent} />
              </div>
              <span className="text-lg font-bold text-ink">
                {report.averageCompletionPercent}%
              </span>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
