"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { approveCourse, listAdminCourses, rejectCourse } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";
import { FormButton } from "@/components/lms/ui/FormButton";

export default function CourseApprovalPage() {
  const { accessToken } = useAuth();
  const [courses, setCourses] = useState<LmsCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    const result = await listAdminCourses(accessToken, { status: "PENDING_REVIEW", limit: 100 });
    setCourses(result.items);
  }, [accessToken]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await refresh();
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load pending courses.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  async function handleApprove(id: string) {
    if (!accessToken) return;
    setBusyId(id);
    try {
      await approveCourse(accessToken, id);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not approve this course.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id: string) {
    if (!accessToken) return;
    if (!confirm("Reject this course? It will go back to Draft for the instructor to revise.")) {
      return;
    }
    setBusyId(id);
    try {
      await rejectCourse(accessToken, id);
      await refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not reject this course.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Course Approval</h1>
      <p className="mt-1 text-sm text-ink/60">
        Courses instructors have submitted for review, waiting to be published.
      </p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Instructor</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {courses === null &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={4}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {courses?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={4}>
                  Nothing waiting on review right now.
                </td>
              </tr>
            )}

            {courses?.map((course) => (
              <tr key={course._id}>
                <td className="px-4 py-3 font-medium text-ink">{course.title}</td>
                <td className="px-4 py-3 text-ink/70">
                  {typeof course.instructor === "object" ? course.instructor.name : "—"}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(course.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <FormButton
                      variant="secondary"
                      loading={busyId === course._id}
                      onClick={() => handleReject(course._id)}
                    >
                      Reject
                    </FormButton>
                    <FormButton loading={busyId === course._id} onClick={() => handleApprove(course._id)}>
                      Approve
                    </FormButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
