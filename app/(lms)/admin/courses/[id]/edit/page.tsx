"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAdminCourse, updateCourse, type CourseInput } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";
import { CourseForm } from "@/components/lms/admin/CourseForm";

export default function EditCoursePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [course, setCourse] = useState<LmsCourse | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!course) return <div className="h-64 animate-pulse rounded-2xl bg-cream" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Edit Course</h1>
      <div className="mt-6">
        <CourseForm
          initialCourse={course}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
