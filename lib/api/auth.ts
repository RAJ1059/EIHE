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

export function googleAuthRequest(idToken: string) {
  return apiFetch<AuthResult>("/auth/google", {
    method: "POST",
    body: { idToken },
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

export function forgotPasswordRequest(email: string) {
  return apiFetch<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export function resetPasswordRequest(token: string, password: string) {
  return apiFetch<{ reset: true }>("/auth/reset-password", {
    method: "POST",
    body: { token, password },
  });
}

export function verifyEmailRequest(token: string) {
  return apiFetch<{ verified: true }>("/auth/verify-email", {
    method: "POST",
    body: { token },
  });
}
