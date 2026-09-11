import { apiFetch } from "./client";
import type { LmsCourseDetailReport, LmsCourseSummaryReport } from "@/types/lms";

export function listCourseReports(accessToken: string) {
  return apiFetch<LmsCourseSummaryReport[]>("/admin/course-reports", { accessToken });
}

export function getCourseReport(accessToken: string, id: string) {
  return apiFetch<LmsCourseDetailReport>(`/admin/course-reports/${id}`, { accessToken });
}
