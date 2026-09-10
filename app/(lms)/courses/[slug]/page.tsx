"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";
import { FormButton } from "@/components/lms/ui/FormButton";
import { useAuth } from "@/lib/auth/AuthContext";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<LmsCourse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCourseBySlug(params.slug)
      .then((data) => {
        if (!cancelled) setCourse(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Course not found.");
      });
    return () => {
      cancelled = true;
    };
  }, [params.slug]);

  if (error) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-ink">{error}</h1>
        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="h-8 w-2/3 animate-pulse rounded bg-cream" />
          <div className="mt-6 h-40 animate-pulse rounded-2xl bg-cream" />
        </div>
      </section>
    );
  }

  const instructorName =
    typeof course.instructor === "object" ? course.instructor.name : "EIHE Faculty";
  const categoryName =
    typeof course.category === "object" ? course.category.name : undefined;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
        {categoryName && (
          <span className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {categoryName}
          </span>
        )}
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          By {instructorName} &middot; {course.difficultyLevel} &middot; {course.duration}
        </p>

        <p className="mt-6 leading-relaxed text-ink/70">{course.description}</p>

        <div className="mt-10 flex items-center justify-between rounded-2xl border border-ink/10 bg-cream p-6">
          <div>
            <p className="text-2xl font-extrabold text-ink">
              {course.salePrice != null
                ? `${course.currency} ${course.salePrice}`
                : course.price === 0
                  ? "Free"
                  : `${course.currency} ${course.price}`}
            </p>
            {course.salePrice != null && (
              <p className="text-sm text-ink/40 line-through">
                {course.currency} {course.price}
              </p>
            )}
          </div>
          <FormButton
            onClick={() => {
              if (!user) router.push("/login");
              // Enrollment/checkout flow lands in the Payments phase — not built yet.
            }}
          >
            {user ? "Enroll (coming soon)" : "Log In to Enroll"}
          </FormButton>
        </div>
      </div>
    </section>
  );
}
