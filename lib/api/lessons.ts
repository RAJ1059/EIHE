import { apiFetch } from "./client";
import type { LmsAdminLessonSummary, LmsCurriculum, LmsLesson, LmsTopic } from "@/types/lms";

export type LessonInput = {
  title: string;
  description?: string;
  content?: string;
  youtubeUrl: string;
  duration?: string;
  requirePreviousLesson?: boolean;
  allowFreePreview?: boolean;
  topics?: Pick<LmsTopic, "title" | "content" | "order">[];
};

export function getCurriculum(slug: string, accessToken?: string | null) {
  return apiFetch<LmsCurriculum>(`/courses/${slug}/curriculum`, {
    accessToken: accessToken ?? undefined,
  });
}

export function getLesson(id: string, accessToken?: string | null) {
  return apiFetch<LmsLesson>(`/lessons/${id}`, { accessToken: accessToken ?? undefined });
}

export function completeLesson(accessToken: string, id: string) {
  return apiFetch<{ completed: true }>(`/lessons/${id}/complete`, {
    method: "POST",
    accessToken,
  });
}

export function listAdminLessons(accessToken: string, moduleId: string) {
  return apiFetch<LmsLesson[]>(`/admin/modules/${moduleId}/lessons`, { accessToken });
}

/** Cross-course listing for the admin Lessons page. */
export function listAllLessons(accessToken: string) {
  return apiFetch<LmsAdminLessonSummary[]>("/admin/lessons", { accessToken });
}

export function createLesson(accessToken: string, moduleId: string, input: LessonInput) {
  return apiFetch<LmsLesson>(`/admin/modules/${moduleId}/lessons`, {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function updateLesson(accessToken: string, id: string, input: Partial<LessonInput>) {
  return apiFetch<LmsLesson>(`/admin/lessons/${id}`, {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export function deleteLesson(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/lessons/${id}`, { method: "DELETE", accessToken });
}

export function reorderLessons(accessToken: string, orderedIds: string[]) {
  return apiFetch<null>(`/admin/lessons/reorder`, {
    method: "PUT",
    accessToken,
    body: { orderedIds },
  });
}
