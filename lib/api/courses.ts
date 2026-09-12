import { apiFetch } from "./client";
import type { LmsCategory, LmsCourse, LmsPaginated } from "@/types/lms";

export type CourseQuery = {
  search?: string;
  category?: string;
  difficultyLevel?: LmsCourse["difficultyLevel"];
  status?: LmsCourse["status"];
  sort?: "newest" | "popular" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

function toQueryString(query: CourseQuery): string {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function listCourses(query: CourseQuery = {}) {
  return apiFetch<LmsPaginated<LmsCourse>>(`/courses${toQueryString(query)}`);
}

export function getCourseBySlug(slug: string) {
  return apiFetch<LmsCourse>(`/courses/${slug}`);
}

export function listCategories() {
  return apiFetch<LmsCategory[]>("/categories");
}

export function listAdminCourses(accessToken: string, query: CourseQuery = {}) {
  return apiFetch<LmsPaginated<LmsCourse>>(`/admin/courses${toQueryString(query)}`, {
    accessToken,
  });
}

export function getAdminCourse(accessToken: string, id: string) {
  return apiFetch<LmsCourse>(`/admin/courses/${id}`, { accessToken });
}

export type CourseInput = {
  title: string;
  shortDescription?: string;
  description?: string;
  featuredImage?: string;
  brochureUrl?: string;
  category: string;
  subcategory?: string;
  tags?: string[];
  instructor: string;
  difficultyLevel?: LmsCourse["difficultyLevel"];
  duration?: string;
  language?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  status?: LmsCourse["status"];
  isFeatured?: boolean;
  accessType?: LmsCourse["accessType"];
  certificateEnabled?: boolean;
};

export function createCourse(accessToken: string, input: CourseInput) {
  return apiFetch<LmsCourse>("/admin/courses", {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function updateCourse(accessToken: string, id: string, input: Partial<CourseInput>) {
  return apiFetch<LmsCourse>(`/admin/courses/${id}`, {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export function deleteCourse(accessToken: string, id: string) {
  return apiFetch<{ deleted: true } | null>(`/admin/courses/${id}`, {
    method: "DELETE",
    accessToken,
  });
}

export function duplicateCourse(accessToken: string, id: string) {
  return apiFetch<LmsCourse>(`/admin/courses/${id}/duplicate`, {
    method: "POST",
    accessToken,
  });
}

export function submitCourseForReview(accessToken: string, id: string) {
  return apiFetch<LmsCourse>(`/admin/courses/${id}/submit-for-review`, {
    method: "PUT",
    accessToken,
  });
}

export function approveCourse(accessToken: string, id: string) {
  return apiFetch<LmsCourse>(`/admin/courses/${id}/approve`, { method: "PUT", accessToken });
}

export function rejectCourse(accessToken: string, id: string) {
  return apiFetch<LmsCourse>(`/admin/courses/${id}/reject`, { method: "PUT", accessToken });
}
