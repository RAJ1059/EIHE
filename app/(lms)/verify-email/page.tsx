"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { verifyEmailRequest } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { Card } from "@/components/lms/ui/Card";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    verifyEmailRequest(token)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setError(err instanceof ApiError ? err.message : "Could not verify this email.");
      });
  }, [token]);

  return (
    <section className="bg-cream">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">Verify Email</h1>

        <Card className="mt-8">
          {!token ? (
            <p className="text-sm text-red-600">This verification link is missing its token.</p>
          ) : status === "checking" ? (
            <p className="text-sm text-ink/70">Verifying…</p>
          ) : status === "success" ? (
            <p className="text-sm text-ink/80">
              Your email is verified. You can now{" "}
              <Link href="/login" className="font-semibold text-teal hover:underline">
                log in
              </Link>
              .
            </p>
          ) : (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </Card>
      </div>
    </section>
  );
}
