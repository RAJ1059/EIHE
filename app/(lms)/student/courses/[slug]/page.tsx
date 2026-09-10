"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCurriculum } from "@/lib/api/lessons";
import { ApiError } from "@/lib/api/client";

export default function CoursePlayerEntryPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    getCurriculum(params.slug, accessToken)
      .then((curriculum) => {
        if (cancelled) return;
        const firstLesson = curriculum.modules.flatMap((m) => m.lessons)[0];
        if (!firstLesson) {
          setError("This course doesn't have any lessons yet.");
          return;
        }
        router.replace(`/student/courses/${params.slug}/lesson/${firstLesson._id}`);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Could not load this course.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, params.slug, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm text-ink/60">{error ?? "Loading course…"}</p>
    </div>
  );
}
