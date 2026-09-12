"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { downloadCertificate, listMyCertificates } from "@/lib/api/certificates";
import type { LmsCertificate } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { GraduationCapIcon } from "@/components/ui/icons";

export default function StudentCertificatesPage() {
  const { accessToken } = useAuth();
  const [certificates, setCertificates] = useState<LmsCertificate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listMyCertificates(accessToken)
      .then((list) => {
        if (!cancelled) setCertificates(list);
      })
      .catch((err) => {
        if (cancelled) return;
        setCertificates([]);
        setError(err instanceof ApiError ? err.message : "Could not load your certificates.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  async function handleDownload(certificate: LmsCertificate) {
    if (!accessToken) return;
    setDownloadingId(certificate._id);
    setError(null);
    try {
      await downloadCertificate(accessToken, certificate);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not download this certificate.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">My Certificates</h1>
      <p className="mt-1 text-sm text-ink/60">
        Awarded automatically once you complete a course that offers one.
      </p>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {certificates === null && !error && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
          <div className="h-32 animate-pulse rounded-2xl bg-white" />
        </div>
      )}

      {certificates?.length === 0 && (
        <Card className="mt-6 text-center">
          <p className="text-ink/70">
            You haven&rsquo;t earned any certificates yet — finish a course that offers one to get
            yours.
          </p>
        </Card>
      )}

      {certificates && certificates.length > 0 && (
        <RevealGroup className="mt-6 grid gap-4 sm:grid-cols-2">
          {certificates.map((certificate) => {
            const courseTitle =
              typeof certificate.course === "object" ? certificate.course.title : certificate.courseTitle;
            return (
              <RevealItem key={certificate._id}>
                <Card hoverable className="flex h-full flex-col">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal/10 text-teal">
                    <GraduationCapIcon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-bold text-sage">{courseTitle}</h3>
                  <p className="mt-1 text-xs text-ink/50">
                    Issued {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-xs text-ink/40">{certificate.certificateNumber}</p>
                  <FormButton
                    className="mt-4"
                    variant="secondary"
                    loading={downloadingId === certificate._id}
                    onClick={() => handleDownload(certificate)}
                  >
                    Download
                  </FormButton>
                </Card>
              </RevealItem>
            );
          })}
        </RevealGroup>
      )}
    </div>
  );
}
