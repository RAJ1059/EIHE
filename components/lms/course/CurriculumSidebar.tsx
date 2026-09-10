"use client";

import { useState } from "react";
import Link from "next/link";
import type { LmsCurriculum } from "@/types/lms";

export function CurriculumSidebar({
  slug,
  curriculum,
  activeLessonId,
  activeQuizId,
}: {
  slug: string;
  curriculum: LmsCurriculum | null;
  activeLessonId?: string;
  activeQuizId?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <aside className="w-full shrink-0 lg:w-72">
      <div className="flex items-center justify-between">
        <Link href="/student/courses" className="text-sm font-semibold text-teal hover:underline">
          ← Back to My Courses
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-xs font-semibold text-ink lg:hidden"
        >
          {mobileOpen ? "Hide outline" : "Course outline"}
        </button>
      </div>

      <div className={`${mobileOpen ? "block" : "hidden"} mt-4 space-y-4 lg:block`}>
        {curriculum === null &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white" />
          ))}

        {curriculum?.modules.map((module) => (
          <div key={module._id} className="rounded-xl border border-ink/10 bg-white p-3">
            <p className="px-1 text-xs font-semibold tracking-wide text-ink/50 uppercase">
              {module.title}
            </p>
            <ul className="mt-2 space-y-1">
              {module.lessons.map((l) => {
                const isActive = l._id === activeLessonId;
                return (
                  <li key={l._id}>
                    {l.locked ? (
                      <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink/30">
                        🔒 {l.title}
                      </span>
                    ) : (
                      <Link
                        href={`/student/courses/${slug}/lesson/${l._id}`}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                          isActive
                            ? "bg-sage/10 font-semibold text-sage"
                            : "text-ink hover:bg-cream"
                        }`}
                      >
                        {l.completed ? "✓" : "▷"} {l.title}
                      </Link>
                    )}
                  </li>
                );
              })}
              {module.quizzes.map((q) => {
                const isActive = q._id === activeQuizId;
                return (
                  <li key={q._id}>
                    {q.locked ? (
                      <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink/30">
                        🔒 {q.title}
                      </span>
                    ) : (
                      <Link
                        href={`/student/courses/${slug}/quiz/${q._id}`}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                          isActive
                            ? "bg-sage/10 font-semibold text-sage"
                            : "text-ink hover:bg-cream"
                        }`}
                      >
                        {q.passed ? "✓" : "📝"} {q.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {curriculum && curriculum.finalQuizzes.length > 0 && (
          <div className="rounded-xl border border-ink/10 bg-white p-3">
            <p className="px-1 text-xs font-semibold tracking-wide text-ink/50 uppercase">
              Final Assessment
            </p>
            <ul className="mt-2 space-y-1">
              {curriculum.finalQuizzes.map((q) => {
                const isActive = q._id === activeQuizId;
                return (
                  <li key={q._id}>
                    {q.locked ? (
                      <span className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink/30">
                        🔒 {q.title}
                      </span>
                    ) : (
                      <Link
                        href={`/student/courses/${slug}/quiz/${q._id}`}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                          isActive
                            ? "bg-sage/10 font-semibold text-sage"
                            : "text-ink hover:bg-cream"
                        }`}
                      >
                        {q.passed ? "✓" : "📝"} {q.title}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
