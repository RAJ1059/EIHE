"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  deleteCourse,
  getAdminCourse,
  submitCourseForReview,
  updateCourse,
  type CourseInput,
} from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";
import { CourseForm } from "@/components/lms/admin/CourseForm";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Card } from "@/components/lms/ui/Card";

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken, user } = useAuth();
  const [course, setCourse] = useState<LmsCourse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittingForReview, setSubmittingForReview] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    getAdminCourse(accessToken, params.id)
      .then(setCourse)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Course not found."));
  }, [accessToken, params.id]);

  async function handleSubmit(input: Omit<CourseInput, "instructor">) {
    if (!accessToken) return;
    await updateCourse(accessToken, params.id, input);
    router.push("/admin/courses");
  }

  async function handleSubmitForReview() {
    if (!accessToken) return;
    setSubmittingForReview(true);
    try {
      const updated = await submitCourseForReview(accessToken, params.id);
      setCourse(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit this course for review.");
    } finally {
      setSubmittingForReview(false);
    }
  }

  async function handleDelete() {
    if (!accessToken || !course) return;
    const confirmed = window.confirm(
      course.status === "PUBLISHED"
        ? `"${course.title}" is published — deleting it permanently removes its modules, lessons, quizzes, and every student's enrollment and progress. This can't be undone. Delete it anyway?`
        : `Permanently delete "${course.title}" and all of its content? This can't be undone.`,
    );
    if (!confirmed) return;

    setError(null);
    setIsDeleting(true);
    try {
      await deleteCourse(accessToken, params.id);
      router.push("/admin/courses");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not delete this course.");
      setIsDeleting(false);
    }
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!course) return <div className="h-64 animate-pulse rounded-2xl bg-cream" />;

  const canPublish = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Edit Course</h1>

      {!canPublish && course.status === "DRAFT" && (
        <Card className="mt-6 flex items-center justify-between">
          <p className="text-sm text-ink/70">Ready for students to see this course?</p>
          <FormButton onClick={handleSubmitForReview} loading={submittingForReview}>
            Submit for Review
          </FormButton>
        </Card>
      )}
      {!canPublish && course.status === "PENDING_REVIEW" && (
        <Card className="mt-6">
          <p className="text-sm text-ink/70">
            This course is waiting on an admin to review and publish it.
          </p>
        </Card>
      )}

      <div className="mt-6">
        <CourseForm
          initialCourse={course}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          canPublish={canPublish}
        />
      </div>

      {canPublish && (
        <Card className="mt-8 max-w-3xl border-red-100 bg-red-50/50">
          <h2 className="font-bold text-red-700">Danger Zone</h2>
          <p className="mt-1 text-sm text-ink/70">
            Permanently delete this course, its modules, lessons, quizzes, and every student&rsquo;s
            enrollment and progress. This works regardless of status — draft, published, or
            archived — and can&rsquo;t be undone.
          </p>
          <FormButton
            variant="danger"
            className="mt-4"
            onClick={handleDelete}
            loading={isDeleting}
          >
            Delete Course
          </FormButton>
        </Card>
      )}
    </div>
  );
}
