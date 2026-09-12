"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import {
  fetchAdminCertificateTemplateImageUrl,
  getAdminCertificateTemplate,
  updateAdminCertificateTemplate,
  type CertificateTemplatePositions,
} from "@/lib/api/certificates";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label } from "@/components/lms/ui/Input";

type FieldKey = "name" | "courseTitle" | "date";

const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Student name",
  courseTitle: "Course title",
  date: "Completion date",
};

const DEFAULT_POSITIONS: CertificateTemplatePositions = {
  nameXPercent: 50,
  nameYPercent: 52,
  nameFontSize: 42,
  nameColor: "#1a1a1a",
  courseTitleXPercent: 50,
  courseTitleYPercent: 66,
  courseTitleFontSize: 22,
  courseTitleColor: "#333333",
  dateXPercent: 50,
  dateYPercent: 78,
  dateFontSize: 16,
  dateColor: "#555555",
};

async function fetchTemplateState(accessToken: string) {
  const template = await getAdminCertificateTemplate(accessToken);
  const positions: CertificateTemplatePositions = {
    nameXPercent: template.nameXPercent,
    nameYPercent: template.nameYPercent,
    nameFontSize: template.nameFontSize,
    nameColor: template.nameColor,
    courseTitleXPercent: template.courseTitleXPercent,
    courseTitleYPercent: template.courseTitleYPercent,
    courseTitleFontSize: template.courseTitleFontSize,
    courseTitleColor: template.courseTitleColor,
    dateXPercent: template.dateXPercent,
    dateYPercent: template.dateYPercent,
    dateFontSize: template.dateFontSize,
    dateColor: template.dateColor,
  };
  const imageUrl = template.hasImage
    ? await fetchAdminCertificateTemplateImageUrl(accessToken)
    : null;
  return { positions, hasImage: template.hasImage, imageUrl };
}

export default function AdminCertificatesPage() {
  const { accessToken } = useAuth();
  const [positions, setPositions] = useState<CertificateTemplatePositions>(DEFAULT_POSITIONS);
  const [hasImage, setHasImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [stagedPreviewUrl, setStagedPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    fetchTemplateState(accessToken)
      .then((result) => {
        if (cancelled) return;
        setPositions(result.positions);
        setHasImage(result.hasImage);
        setImageUrl(result.imageUrl);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load the certificate template.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  function handleFileChange(file: File | null) {
    setStagedFile(file);
    if (stagedPreviewUrl) URL.revokeObjectURL(stagedPreviewUrl);
    setStagedPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function updateField(field: FieldKey, key: "XPercent" | "YPercent" | "FontSize" | "Color", value: string) {
    const propKey = `${field}${key}` as keyof CertificateTemplatePositions;
    setPositions((prev) => ({
      ...prev,
      [propKey]: key === "Color" ? value : Number(value),
    }));
  }

  async function handleSave() {
    if (!accessToken) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateAdminCertificateTemplate(accessToken, positions, stagedFile);
      handleFileChange(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      const result = await fetchTemplateState(accessToken);
      setPositions(result.positions);
      setHasImage(result.hasImage);
      setImageUrl(result.imageUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the certificate template.");
    } finally {
      setSaving(false);
    }
  }

  const previewSrc = stagedPreviewUrl ?? imageUrl;

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-cream" />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Certificates</h1>
      <p className="mt-1 text-sm text-ink/60">
        Upload the certificate design students receive automatically when they complete a
        course, and set where their name, the course title, and the completion date land on it.
        Enable it per course from that course&rsquo;s edit page.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <h2 className="font-bold text-ink">Preview</h2>
          <p className="mt-1 text-xs text-ink/50">
            An approximate preview of where the three fields will land — the actual certificate
            is generated on the server for every download.
          </p>
          <div className="relative mt-4 overflow-hidden rounded-xl border border-ink/10 bg-ink/5">
            {previewSrc ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Certificate template" className="w-full" />
                {(["name", "courseTitle", "date"] as FieldKey[]).map((field) => (
                  <span
                    key={field}
                    className="absolute -translate-x-1/2 -translate-y-1/2 font-serif whitespace-nowrap"
                    style={{
                      left: `${positions[`${field}XPercent`]}%`,
                      top: `${positions[`${field}YPercent`]}%`,
                      fontSize: `${positions[`${field}FontSize`] / 2}px`,
                      color: positions[`${field}Color`],
                    }}
                  >
                    {field === "name"
                      ? "Jane Student"
                      : field === "courseTitle"
                        ? "Sample Course Title"
                        : "1 January 2026"}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-ink/40">
                No template uploaded yet
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="templateImage">
              {hasImage ? "Replace template image" : "Upload template image"}
            </Label>
            <input
              ref={fileInputRef}
              id="templateImage"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink/70 file:mr-3 file:rounded-full file:border-0 file:bg-sage file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
          </div>
        </Card>

        <div className="space-y-6">
          {(["name", "courseTitle", "date"] as FieldKey[]).map((field) => (
            <Card key={field}>
              <h3 className="font-semibold text-ink">{FIELD_LABELS[field]}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`${field}-x`}>Horizontal %</Label>
                  <Input
                    id={`${field}-x`}
                    type="number"
                    min={0}
                    max={100}
                    value={positions[`${field}XPercent`]}
                    onChange={(e) => updateField(field, "XPercent", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field}-y`}>Vertical %</Label>
                  <Input
                    id={`${field}-y`}
                    type="number"
                    min={0}
                    max={100}
                    value={positions[`${field}YPercent`]}
                    onChange={(e) => updateField(field, "YPercent", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field}-size`}>Font size</Label>
                  <Input
                    id={`${field}-size`}
                    type="number"
                    min={8}
                    max={160}
                    value={positions[`${field}FontSize`]}
                    onChange={(e) => updateField(field, "FontSize", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field}-color`}>Color</Label>
                  <input
                    id={`${field}-color`}
                    type="color"
                    value={positions[`${field}Color`]}
                    onChange={(e) => updateField(field, "Color", e.target.value)}
                    className="h-[42px] w-full rounded-lg border border-ink/10"
                  />
                </div>
              </div>
            </Card>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}
          {saved && <p className="text-sm font-semibold text-teal">Saved.</p>}

          <FormButton onClick={handleSave} loading={saving} className="w-full">
            Save Certificate Template
          </FormButton>
        </div>
      </div>
    </div>
  );
}
