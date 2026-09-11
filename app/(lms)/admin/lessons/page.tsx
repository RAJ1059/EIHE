"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAllLessons } from "@/lib/api/lessons";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminLessonSummary } from "@/types/lms";
import { Reveal } from "@/components/motion/Reveal";

export default function AdminLessonsPage() {
  const { accessToken } = useAuth();
  const [lessons, setLessons] = useState<LmsAdminLessonSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAllLessons(accessToken)
      .then((result) => {
        if (!cancelled) setLessons(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setLessons([]);
        setError(err instanceof ApiError ? err.message : "Could not load lessons.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Lessons</h1>
      <p className="mt-1 text-sm text-ink/60">Every lesson across every course, newest first.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Module</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {lessons === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={5}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {lessons?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={5}>
                  No lessons yet.
                </td>
              </tr>
            )}

            {lessons?.map((lesson) => (
              <tr key={lesson._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{lesson.title}</td>
                <td className="px-4 py-3 text-ink/70">{lesson.course?.title ?? "—"}</td>
                <td className="px-4 py-3 text-ink/70">{lesson.module?.title ?? "—"}</td>
                <td className="px-4 py-3 text-ink/70">{lesson.duration || "—"}</td>
                <td className="px-4 py-3 text-right">
                  {lesson.course && (
                    <Link
                      href={`/admin/courses/${lesson.course._id}/content`}
                      className="text-sm font-semibold text-teal hover:underline"
                    >
                      Open in Content →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
