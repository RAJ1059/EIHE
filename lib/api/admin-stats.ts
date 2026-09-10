import { apiFetch } from "./client";
import type { LmsAdminStatsOverview } from "@/types/lms";

export function getAdminStatsOverview(accessToken: string) {
  return apiFetch<LmsAdminStatsOverview>("/admin/stats/overview", { accessToken });
}
