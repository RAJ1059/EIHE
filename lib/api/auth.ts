import { apiFetch } from "./client";
import type { LmsUser } from "@/types/lms";

type AuthResult = { user: LmsUser; accessToken: string };
type RefreshResult = { accessToken: string };

export function registerRequest(input: { name: string; email: string; password: string }) {
  return apiFetch<AuthResult>("/auth/register", {
    method: "POST",
    body: input,
    withCredentials: true,
  });
}

export function loginRequest(input: { email: string; password: string }) {
  return apiFetch<AuthResult>("/auth/login", {
    method: "POST",
    body: input,
    withCredentials: true,
  });
}

export function refreshRequest() {
  return apiFetch<RefreshResult>("/auth/refresh", {
    method: "POST",
    withCredentials: true,
  });
}

export function logoutRequest(accessToken: string) {
  return apiFetch<{ loggedOut: boolean }>("/auth/logout", {
    method: "POST",
    accessToken,
    withCredentials: true,
  });
}

export type MeResult = { userId: string; email: string; role: LmsUser["role"]; name: string };

export function meRequest(accessToken: string) {
  return apiFetch<MeResult>("/auth/me", {
    method: "GET",
    accessToken,
  });
}
