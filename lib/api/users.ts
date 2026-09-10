import { apiFetch } from "./client";
import type { LmsUser } from "@/types/lms";

export function updateProfile(accessToken: string, input: { name: string }) {
  return apiFetch<LmsUser>("/users/me", {
    method: "PATCH",
    accessToken,
    body: input,
  });
}
