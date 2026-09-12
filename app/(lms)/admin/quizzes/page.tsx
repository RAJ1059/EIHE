"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAllQuizzes } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminQuizSummary } from "@/types/lms";
import { Reveal } from "@/components/motion/Reveal";

export default function AdminQuizzesPage() {
  const { accessToken } = useAuth();
  const [quizzes, setQuizzes] = useState<LmsAdminQuizSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAllQuizzes(accessToken)
      .then((result) => {
        if (!cancelled) setQuizzes(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setQuizzes([]);
        setError(err instanceof ApiError ? err.message : "Could not load quizzes.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Quizzes</h1>
      <p className="mt-1 text-sm text-ink/60">Every quiz across every course, newest first.</p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Passing %</th>
              <th className="px-4 py-3">Questions</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {quizzes === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={5}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {quizzes?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={5}>
                  No quizzes yet.
                </td>
              </tr>
            )}

            {quizzes?.map((quiz) => (
              <tr key={quiz._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{quiz.title}</td>
                <td className="px-4 py-3 text-ink/70">{quiz.course?.title ?? "—"}</td>
                <td className="px-4 py-3 text-ink/70">{quiz.passingPercentage}%</td>
                <td className="px-4 py-3 text-ink/70">{quiz.questionCount}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/quizzes/${quiz._id}`}
                    className="text-sm font-semibold text-teal hover:underline"
                  >
                    Edit →
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
