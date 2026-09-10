"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug } from "@/lib/api/courses";
import { enrollInFreeCourse, listMyEnrollments } from "@/lib/api/enrollments";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse } from "@/types/lms";
import { FormButton } from "@/components/lms/ui/FormButton";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";

export default function CourseDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const { items, addItem } = useCart();
  const [course, setCourse] = useState<LmsCourse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

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

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    listMyEnrollments(accessToken)
      .then((enrollments) => {
        if (cancelled) return;
        setIsEnrolled(enrollments.some((e) => e.course.slug === params.slug));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [accessToken, params.slug]);

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
  const isFree = course.price === 0 && (course.salePrice === null || course.salePrice === 0);
  const inCart = items.some((item) => item.courseId === course._id);

  async function handleEnrollFree() {
    if (!accessToken) return;
    setActionError(null);
    setIsEnrolling(true);
    try {
      await enrollInFreeCourse(accessToken, course!._id);
      router.push("/student/courses");
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "Could not enroll right now.");
    } finally {
      setIsEnrolling(false);
    }
  }

  function handleAddToCart() {
    addItem({
      courseId: course!._id,
      title: course!.title,
      slug: course!.slug,
      price: course!.price,
      salePrice: course!.salePrice,
      currency: course!.currency,
      featuredImage: course!.featuredImage,
    });
    router.push("/cart");
  }

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

        <div className="mt-10 rounded-2xl border border-ink/10 bg-cream p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-extrabold text-ink">
                {isFree
                  ? "Free"
                  : course.salePrice != null
                    ? `${course.currency} ${course.salePrice}`
                    : `${course.currency} ${course.price}`}
              </p>
              {!isFree && course.salePrice != null && (
                <p className="text-sm text-ink/40 line-through">
                  {course.currency} {course.price}
                </p>
              )}
            </div>

            {isEnrolled ? (
              <FormButton onClick={() => router.push(`/student/courses/${course.slug}`)}>
                Continue Learning →
              </FormButton>
            ) : !user ? (
              <FormButton onClick={() => router.push(`/login?next=/courses/${course.slug}`)}>
                Log In to Enroll
              </FormButton>
            ) : isFree ? (
              <FormButton onClick={handleEnrollFree} loading={isEnrolling}>
                Enroll for Free
              </FormButton>
            ) : inCart ? (
              <FormButton variant="secondary" onClick={() => router.push("/cart")}>
                View in Cart
              </FormButton>
            ) : (
              <FormButton onClick={handleAddToCart}>Add to Cart</FormButton>
            )}
          </div>
          {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}
        </div>
      </div>
    </section>
  );
}
