import { apiFetch } from "./client";
import type { LmsAdminUser, LmsPaginated, LmsRole } from "@/types/lms";
import type { Enrollment } from "./enrollments";

export type UserListQuery = {
  search?: string;
  role?: LmsRole;
  page?: number;
  limit?: number;
};

function toQueryString(query: UserListQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function listAdminUsers(accessToken: string, query: UserListQuery = {}) {
  return apiFetch<LmsPaginated<LmsAdminUser>>(`/admin/users${toQueryString(query)}`, {
    accessToken,
  });
}

export function getAdminUser(accessToken: string, id: string) {
  return apiFetch<LmsAdminUser>(`/admin/users/${id}`, { accessToken });
}

export function getUserEnrollments(accessToken: string, id: string) {
  return apiFetch<Enrollment[]>(`/admin/users/${id}/enrollments`, { accessToken });
}

export function updateUserRole(accessToken: string, id: string, role: LmsRole) {
  return apiFetch<LmsAdminUser>(`/admin/users/${id}/role`, {
    method: "PUT",
    accessToken,
    body: { role },
  });
}

export function manualEnrollUser(accessToken: string, id: string, courseId: string) {
  return apiFetch<Enrollment>(`/admin/users/${id}/enrollments`, {
    method: "POST",
    accessToken,
    body: { courseId },
  });
}

export function removeUserEnrollment(accessToken: string, id: string, courseId: string) {
  return apiFetch<null>(`/admin/users/${id}/enrollments/${courseId}`, {
    method: "DELETE",
    accessToken,
  });
}
