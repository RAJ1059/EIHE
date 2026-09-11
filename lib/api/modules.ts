import { apiFetch } from "./client";
import type { LmsModule } from "@/types/lms";

export type ModuleInput = {
  title: string;
  description?: string;
  image?: string;
  status?: LmsModule["status"];
};

export function listAdminModules(accessToken: string, courseId: string) {
  return apiFetch<LmsModule[]>(`/admin/courses/${courseId}/modules`, { accessToken });
}

export function createModule(accessToken: string, courseId: string, input: ModuleInput) {
  return apiFetch<LmsModule>(`/admin/courses/${courseId}/modules`, {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function updateModule(accessToken: string, id: string, input: Partial<ModuleInput>) {
  return apiFetch<LmsModule>(`/admin/modules/${id}`, {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export function deleteModule(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/modules/${id}`, { method: "DELETE", accessToken });
}

export function reorderModules(accessToken: string, orderedIds: string[]) {
  return apiFetch<null>(`/admin/modules/reorder`, {
    method: "PUT",
    accessToken,
    body: { orderedIds },
  });
}
