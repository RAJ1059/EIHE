"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminCourses } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";

const STATUS_STYLES: Record<LmsCourse["status"], string> = {
  DRAFT: "bg-ink/10 text-ink/60",
  PUBLISHED: "bg-teal/15 text-teal",
  ARCHIVED: "bg-red-100 text-red-700",
};

export default function AdminCoursesPage() {
  const { accessToken } = useAuth();
  const [courses, setCourses] = useState<LmsCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAdminCourses(accessToken)
      .then((result) => {
        if (!cancelled) setCourses(result.items);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load courses.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Courses</h1>
        <Link
          href="/admin/courses/create"
          className="rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
        >
          + New Course
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {courses === null &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={4}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {courses?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={4}>
                  No courses yet. Create your first one.
                </td>
              </tr>
            )}

            {courses?.map((course) => (
              <tr key={course._id}>
                <td className="px-4 py-3 font-medium text-ink">{course.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[course.status]}`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {course.price === 0 ? "Free" : `${course.currency} ${course.price}`}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/courses/${course._id}/content`}
                    className="mr-4 text-sm font-semibold text-teal hover:underline"
                  >
                    Content
                  </Link>
                  <Link
                    href={`/admin/courses/${course._id}/edit`}
                    className="text-sm font-semibold text-teal hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
