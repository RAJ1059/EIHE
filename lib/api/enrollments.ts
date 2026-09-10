import { apiFetch } from "./client";
import type { LmsCourse } from "@/types/lms";

export type Enrollment = {
  _id: string;
  course: Pick<LmsCourse, "_id" | "title" | "slug" | "shortDescription" | "featuredImage">;
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED";
  source: "FREE_SELF_ENROLL" | "MANUAL" | "ORDER";
  enrolledAt: string;
  expiresAt: string | null;
};

export function listMyEnrollments(accessToken: string) {
  return apiFetch<Enrollment[]>("/student/enrollments", { accessToken });
}

export function enrollInFreeCourse(accessToken: string, courseId: string) {
  return apiFetch<Enrollment>("/student/enrollments", {
    method: "POST",
    accessToken,
    body: { courseId },
  });
}
