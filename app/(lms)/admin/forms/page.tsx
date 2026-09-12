"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAdminFormSubmissions } from "@/lib/api/form-submissions";
import { ApiError } from "@/lib/api/client";
import type { LmsFormSubmission, LmsFormType } from "@/types/lms";
import { Select } from "@/components/lms/ui/Input";
import { Reveal } from "@/components/motion/Reveal";

const FORM_TYPE_LABELS: Record<LmsFormType, string> = {
  BROCHURE_DOWNLOAD: "Brochure Download",
};

export default function AdminFormsPage() {
  const { accessToken } = useAuth();
  const [submissions, setSubmissions] = useState<LmsFormSubmission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formType, setFormType] = useState<LmsFormType | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAdminFormSubmissions(accessToken, { formType: formType || undefined, page, limit: 20 })
      .then((result) => {
        if (cancelled) return;
        setSubmissions(result.items);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setSubmissions([]);
        setError(err instanceof ApiError ? err.message : "Could not load form submissions.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, formType, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Forms</h1>
      <p className="mt-1 text-sm text-ink/60">
        Every lead captured through a gated form on the public site (e.g. course brochure downloads).
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select
          value={formType}
          onChange={(e) => {
            setFormType(e.target.value as LmsFormType | "");
            setPage(1);
          }}
          className="max-w-52"
        >
          <option value="">All form types</option>
          <option value="BROCHURE_DOWNLOAD">Brochure Download</option>
        </Select>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Form</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {submissions === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={6}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {submissions?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={6}>
                  No form submissions yet.
                </td>
              </tr>
            )}

            {submissions?.map((submission) => (
              <tr key={submission._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{submission.name}</td>
                <td className="px-4 py-3 text-ink/70">{submission.email}</td>
                <td className="px-4 py-3 text-ink/70">{submission.phone}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-teal/15 px-2.5 py-1 text-xs font-semibold text-teal">
                    {FORM_TYPE_LABELS[submission.formType]}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/70">{submission.courseTitle || "—"}</td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(submission.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-ink/10 px-3 py-1 font-semibold text-ink disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-ink/60">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border border-ink/10 px-3 py-1 font-semibold text-ink disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
