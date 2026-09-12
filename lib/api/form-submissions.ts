import { apiFetch } from "./client";
import type { LmsFormSubmission, LmsFormType, LmsPaginated } from "@/types/lms";

export type CreateFormSubmissionInput = {
  formType: LmsFormType;
  name: string;
  email: string;
  phone: string;
  courseId?: string;
};

export function submitForm(input: CreateFormSubmissionInput) {
  return apiFetch<LmsFormSubmission>("/form-submissions", {
    method: "POST",
    body: input,
  });
}

export type FormSubmissionQuery = {
  formType?: LmsFormType;
  page?: number;
  limit?: number;
};

function toQueryString(query: FormSubmissionQuery): string {
  const params = new URLSearchParams();
  if (query.formType) params.set("formType", query.formType);
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function listAdminFormSubmissions(accessToken: string, query: FormSubmissionQuery = {}) {
  return apiFetch<LmsPaginated<LmsFormSubmission>>(`/admin/form-submissions${toQueryString(query)}`, {
    accessToken,
  });
}
