import { apiFetch, ApiError } from "./client";
import type { LmsCertificate, LmsCertificateTemplate } from "@/types/lms";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export function getAdminCertificateTemplate(accessToken: string) {
  return apiFetch<LmsCertificateTemplate>("/admin/certificate-template", { accessToken });
}

export type CertificateTemplatePositions = {
  nameXPercent: number;
  nameYPercent: number;
  nameFontSize: number;
  nameColor: string;
  courseTitleXPercent: number;
  courseTitleYPercent: number;
  courseTitleFontSize: number;
  courseTitleColor: string;
  dateXPercent: number;
  dateYPercent: number;
  dateFontSize: number;
  dateColor: string;
};

export function updateAdminCertificateTemplate(
  accessToken: string,
  positions: CertificateTemplatePositions,
  imageFile?: File | null,
) {
  const formData = new FormData();
  Object.entries(positions).forEach(([key, value]) => formData.set(key, String(value)));
  if (imageFile) formData.set("image", imageFile);

  return apiFetch<LmsCertificateTemplate>("/admin/certificate-template", {
    method: "PUT",
    accessToken,
    body: formData,
  });
}

/** Admin-only preview of the raw template image — needs the bearer token,
 * so it can't be a plain <img src>; fetch it and hand back an object URL. */
export async function fetchAdminCertificateTemplateImageUrl(
  accessToken: string,
): Promise<string | null> {
  const response = await fetch(`${API_URL}/admin/certificate-template/image`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) return null;
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}

export function listMyCertificates(accessToken: string) {
  return apiFetch<LmsCertificate[]>("/certificates/my", { accessToken });
}

/** Fetches a certificate's PNG (auth required, so no plain <a href>) and
 * triggers a browser download. */
export async function downloadCertificate(
  accessToken: string,
  certificate: LmsCertificate,
): Promise<void> {
  const response = await fetch(`${API_URL}/certificates/${certificate._id}/download`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new ApiError(
      json?.message ?? "Could not download this certificate.",
      response.status,
      json?.errorCode ?? "UNKNOWN_ERROR",
    );
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `certificate-${certificate.certificateNumber}.png`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
