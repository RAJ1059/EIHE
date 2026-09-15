import { apiFetch } from "./client";
import type { LmsForumThread, LmsForumThreadWithReplies } from "@/types/lms";

// --- Student ---

export function listThreads(slug: string, accessToken?: string | null) {
  return apiFetch<LmsForumThread[]>(`/courses/${slug}/forum`, {
    accessToken: accessToken ?? undefined,
  });
}

export function createThread(accessToken: string, slug: string, title: string, body: string) {
  return apiFetch<LmsForumThread>(`/courses/${slug}/forum`, {
    method: "POST",
    accessToken,
    body: { title, body },
  });
}

export function getThread(id: string, accessToken?: string | null) {
  return apiFetch<LmsForumThreadWithReplies>(`/forum/threads/${id}`, {
    accessToken: accessToken ?? undefined,
  });
}

export function createReply(accessToken: string, threadId: string, body: string) {
  return apiFetch<LmsForumThreadWithReplies["replies"][number]>(
    `/forum/threads/${threadId}/replies`,
    { method: "POST", accessToken, body: { body } },
  );
}

export function deleteOwnThread(accessToken: string, id: string) {
  return apiFetch<null>(`/forum/threads/${id}`, { method: "DELETE", accessToken });
}

export function deleteOwnReply(accessToken: string, id: string) {
  return apiFetch<null>(`/forum/replies/${id}`, { method: "DELETE", accessToken });
}

// --- Admin / instructor moderation ---

export function listThreadsForAdmin(accessToken: string, courseId: string) {
  return apiFetch<LmsForumThread[]>(`/admin/courses/${courseId}/forum`, { accessToken });
}

export function setThreadPinned(accessToken: string, id: string, pinned: boolean) {
  return apiFetch<LmsForumThread>(`/admin/forum/threads/${id}/pinned`, {
    method: "PUT",
    accessToken,
    body: { pinned },
  });
}

export function deleteThreadAsModerator(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/forum/threads/${id}`, { method: "DELETE", accessToken });
}

export function deleteReplyAsModerator(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/forum/replies/${id}`, { method: "DELETE", accessToken });
}
