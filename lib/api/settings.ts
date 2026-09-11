import { apiFetch } from "./client";
import type { LmsPublicSettings, LmsSiteSettings } from "@/types/lms";

export function getPublicSettings() {
  return apiFetch<LmsPublicSettings>("/settings/public");
}

export function getAdminSettings(accessToken: string) {
  return apiFetch<LmsSiteSettings>("/admin/settings", { accessToken });
}

export type UpdateGeneralSettingsInput = {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  supportEmail?: string;
  logoUrl?: string;
};

export function updateGeneralSettings(accessToken: string, input: UpdateGeneralSettingsInput) {
  return apiFetch<LmsSiteSettings>("/admin/settings/general", {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export type UpdatePaymentSettingsInput = {
  currency?: string;
  taxPercent?: number;
  razorpayEnabled?: boolean;
  stripeEnabled?: boolean;
  stripePublishableKey?: string;
};

export function updatePaymentSettings(accessToken: string, input: UpdatePaymentSettingsInput) {
  return apiFetch<LmsSiteSettings>("/admin/settings/payment", {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export type UpdateSecuritySettingsInput = {
  sessionTimeoutMinutes?: number;
  maxLoginAttempts?: number;
  requireEmailVerification?: boolean;
  googleOAuthEnabled?: boolean;
};

export function updateSecuritySettings(accessToken: string, input: UpdateSecuritySettingsInput) {
  return apiFetch<LmsSiteSettings>("/admin/settings/security", {
    method: "PUT",
    accessToken,
    body: input,
  });
}
