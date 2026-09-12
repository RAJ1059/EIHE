"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/AuthContext";
import { deleteCourse, duplicateCourse, listAdminCourses } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";
import { Reveal } from "@/components/motion/Reveal";

const STATUS_STYLES: Record<LmsCourse["status"], string> = {
  DRAFT: "bg-ink/10 text-ink/60",
  PENDING_REVIEW: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-teal/15 text-teal",
  ARCHIVED: "bg-red-100 text-red-700",
};

export default function AdminCoursesPage() {
  const { accessToken } = useAuth();
  const [courses, setCourses] = useState<LmsCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

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

  async function handleDelete(course: LmsCourse) {
    if (!accessToken) return;
    const confirmed = window.confirm(
      course.status === "PUBLISHED"
        ? `"${course.title}" is published — deleting it permanently removes its modules, lessons, quizzes, and every student's enrollment and progress. This can't be undone. Delete it anyway?`
        : `Permanently delete "${course.title}" and all of its content? This can't be undone.`,
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(course._id);
    try {
      await deleteCourse(accessToken, course._id);
      setCourses((prev) => prev?.filter((c) => c._id !== course._id) ?? prev);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this course.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDuplicate(course: LmsCourse) {
    if (!accessToken) return;
    setError(null);
    setDuplicatingId(course._id);
    try {
      const copy = await duplicateCourse(accessToken, course._id);
      setCourses((prev) => (prev ? [copy, ...prev] : prev));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not duplicate this course.");
    } finally {
      setDuplicatingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Courses</h1>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href="/admin/courses/create"
            className="inline-block rounded-full bg-sage px-4 py-2 text-sm font-semibold text-white"
          >
            + New Course
          </Link>
        </motion.div>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
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
              <tr key={course._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{course.title}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[course.status]} ${
                      course.status === "PENDING_REVIEW" ? "animate-pulse" : ""
                    }`}
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
                    className="mr-4 text-sm font-semibold text-teal hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDuplicate(course)}
                    disabled={duplicatingId === course._id}
                    className="mr-4 text-sm font-semibold text-teal hover:underline disabled:opacity-50"
                  >
                    {duplicatingId === course._id ? "Duplicating…" : "Duplicate"}
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    disabled={deletingId === course._id}
                    className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
                  >
                    {deletingId === course._id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
