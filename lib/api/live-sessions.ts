import { apiFetch } from "./client";
import type { LmsLiveSession } from "@/types/lms";

export type LiveSessionInput = {
  title: string;
  description?: string;
  meetingUrl: string;
  scheduledAt: string;
  durationMinutes?: number;
};

// --- Student ---

export function listLiveSessionsForCourse(slug: string, accessToken?: string | null) {
  return apiFetch<LmsLiveSession[]>(`/courses/${slug}/live-sessions`, {
    accessToken: accessToken ?? undefined,
  });
}

// --- Admin / instructor ---

export function listAdminLiveSessions(accessToken: string, courseId: string) {
  return apiFetch<LmsLiveSession[]>(`/admin/courses/${courseId}/live-sessions`, { accessToken });
}

export function createLiveSession(accessToken: string, courseId: string, input: LiveSessionInput) {
  return apiFetch<LmsLiveSession>(`/admin/courses/${courseId}/live-sessions`, {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function updateLiveSession(
  accessToken: string,
  id: string,
  input: Partial<LiveSessionInput>,
) {
  return apiFetch<LmsLiveSession>(`/admin/live-sessions/${id}`, {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export function deleteLiveSession(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/live-sessions/${id}`, { method: "DELETE", accessToken });
}
