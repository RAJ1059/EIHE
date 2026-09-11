"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listCourseReports } from "@/lib/api/admin-course-reports";
import { ApiError } from "@/lib/api/client";
import type { LmsCourseSummaryReport } from "@/types/lms";
import { Reveal } from "@/components/motion/Reveal";

export default function AdminCourseReportsPage() {
  const { accessToken } = useAuth();
  const [reports, setReports] = useState<LmsCourseSummaryReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listCourseReports(accessToken)
      .then((result) => {
        if (!cancelled) setReports(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setReports([]);
        setError(err instanceof ApiError ? err.message : "Could not load course reports.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Course Reports</h1>
      <p className="mt-1 text-sm text-ink/60">Enrollment and content totals per course.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Enrollments</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Lessons</th>
              <th className="px-4 py-3">Quizzes</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {reports === null &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={6}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {reports?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={6}>
                  No courses yet.
                </td>
              </tr>
            )}

            {reports?.map((report) => (
              <tr key={report.course._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{report.course.title}</td>
                <td className="px-4 py-3 text-ink/70">{report.totalEnrollments}</td>
                <td className="px-4 py-3 text-ink/70">{report.activeEnrollments}</td>
                <td className="px-4 py-3 text-ink/70">{report.totalLessons}</td>
                <td className="px-4 py-3 text-ink/70">{report.totalQuizzes}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/course-reports/${report.course._id}`}
                    className="text-sm font-semibold text-teal hover:underline"
                  >
                    View report →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
