"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { createCourse, type CourseInput } from "@/lib/api/courses";
import { CourseForm } from "@/components/lms/admin/CourseForm";

export default function CreateCoursePage() {
  const router = useRouter();
  const { accessToken, user } = useAuth();

  async function handleSubmit(input: Omit<CourseInput, "instructor">) {
    if (!accessToken || !user) return;
    await createCourse(accessToken, { ...input, instructor: user.id });
    router.push("/admin/courses");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">New Course</h1>
      <p className="mt-1 text-sm text-ink/60">
        You are listed as the instructor for this course.
      </p>
      <div className="mt-6">
        <CourseForm onSubmit={handleSubmit} submitLabel="Create Course" />
      </div>
    </div>
  );
}
