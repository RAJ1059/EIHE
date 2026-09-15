"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCourseBySlug } from "@/lib/api/courses";
import { getCurriculum } from "@/lib/api/lessons";
import { enrollInFreeCourse, listMyEnrollments } from "@/lib/api/enrollments";
import { listLiveSessionsForCourse } from "@/lib/api/live-sessions";
import { ApiError } from "@/lib/api/client";
import type { LmsCourse, LmsCurriculum, LmsLiveSession } from "@/types/lms";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Card } from "@/components/lms/ui/Card";
import { RichTextContent } from "@/components/lms/ui/RichTextContent";
import { cn } from "@/components/lms/ui/cn";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/cart/CartContext";
import { BrochureDownloadModal } from "@/components/lms/course/BrochureDownloadModal";
import {
  CalendarIcon,
  ChevronDownIcon,
  CheckIcon,
  ClockIcon,
  DocumentIcon,
  DownloadIcon,
  GraduationCapIcon,
  LockIcon,
  PlusIcon,
} from "@/components/ui/icons";

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function CourseDetailContent({
  slug,
  variant,
  cartPath,
  checkoutPath,
  loginPath,
  registerPath,
}: {
  slug: string;
  /** "portal" renders inline inside the Student portal shell, where the
   * visitor is always already logged in (StudentLayout guards the route),
   * so the guest/login/register branches below are dead code there but
   * kept for the shared public path. */
  variant: "public" | "portal";
  cartPath: string;
  checkoutPath: string;
  loginPath: string;
  registerPath: string;
}) {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const { items, addItem } = useCart();
  const [course, setCourse] = useState<LmsCourse | null>(null);
  const [curriculum, setCurriculum] = useState<LmsCurriculum | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [showBrochureModal, setShowBrochureModal] = useState(false);
  const isPortal = variant === "portal";

  useEffect(() => {
    let cancelled = false;
    getCourseBySlug(slug)
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
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    getCurriculum(slug, accessToken)
      .then((data) => {
        if (!cancelled) setCurriculum(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug, accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    listMyEnrollments(accessToken)
      .then((enrollments) => {
        if (cancelled) return;
        setIsEnrolled(enrollments.some((e) => e.course.slug === slug));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [accessToken, slug]);

  if (error) {
    const errorBody = (
      <div className={isPortal ? "text-center" : "mx-auto max-w-3xl px-6 py-24 text-center"}>
        <h1 className="text-2xl font-bold text-ink">{error}</h1>
      </div>
    );
    return isPortal ? errorBody : <section className="bg-white">{errorBody}</section>;
  }

  if (!course) {
    const loadingBody = (
      <div className={isPortal ? "" : "mx-auto max-w-4xl px-6 py-16"}>
        <div className="h-8 w-2/3 animate-pulse rounded bg-cream" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-cream" />
      </div>
    );
    return isPortal ? loadingBody : <section className="bg-white">{loadingBody}</section>;
  }

  const categoryName = typeof course.category === "object" ? course.category.name : undefined;
  const isFree = course.price === 0 && (course.salePrice === null || course.salePrice === 0);
  const inCart = items.some((item) => item.courseId === course._id);

  const modules = curriculum?.modules ?? [];
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalQuizzes =
    modules.reduce((sum, m) => sum + m.quizzes.length, 0) + (curriculum?.finalQuizzes.length ?? 0);

  const accessLines: string[] = [];
  if (course.enrollmentStartDate) {
    accessLines.push(`Started ${formatDateTime(course.enrollmentStartDate)}`);
  }
  if (course.accessDurationType === "SPECIFIC_DATE" && course.accessExpiryDate) {
    accessLines.push(`Ends ${formatDateTime(course.accessExpiryDate)}`);
  } else if (course.accessDurationType === "DAYS_AFTER_ENROLLMENT" && course.accessDurationDays) {
    accessLines.push(`Access for ${course.accessDurationDays} days after enrollment`);
  } else if (course.accessDurationType === "NEVER_EXPIRES") {
    accessLines.push("Lifetime access");
  }

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
    router.push(`${cartPath}?added=${course!._id}`);
  }

  // Guests skip the login gate entirely: the course goes straight into the
  // cart and they land on checkout, where they can pay and create their
  // account in one step instead of being bounced to a separate login page.
  function handleGuestCheckout() {
    addItem({
      courseId: course!._id,
      title: course!.title,
      slug: course!.slug,
      price: course!.price,
      salePrice: course!.salePrice,
      currency: course!.currency,
      featuredImage: course!.featuredImage,
    });
    router.push(checkoutPath);
  }

  function toggleModule(id: string) {
    setExpandedModuleId((current) => (current === id ? null : id));
  }

  // Drives the floating "Enroll Now" button — mirrors whatever the sidebar's
  // primary CTA would do in the current state, so it's a second entry point
  // to the exact same action rather than separate logic to keep in sync.
  function handlePrimaryAction() {
    if (isEnrolled) {
      router.push(`/student/courses/${course!.slug}`);
      return;
    }
    if (!user) {
      if (isFree) {
        router.push(`${registerPath}?next=/courses/${course!.slug}`);
      } else {
        handleGuestCheckout();
      }
      return;
    }
    if (isFree) {
      handleEnrollFree();
      return;
    }
    if (inCart) {
      router.push(cartPath);
      return;
    }
    handleAddToCart();
  }

  const body = (
    <div>
      <div className={isPortal ? "" : "mx-auto max-w-6xl px-6 pt-10 sm:pt-14"}>
        {categoryName && (
          <span className="text-xs font-semibold tracking-[0.2em] text-teal uppercase">
            {categoryName}
          </span>
        )}
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {course.title}
        </h1>
      </div>

      <div className={isPortal ? "mt-6" : "mx-auto mt-6 max-w-6xl px-6"}>
        <div className="relative overflow-hidden rounded-2xl bg-sage">
          {course.featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.featuredImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-sage via-sage/85 to-sage/20" />
          <div className="relative max-w-xl px-8 py-16 sm:py-20">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">{course.title}</h2>
            {course.shortDescription && (
              <p className="mt-3 text-white/85">{course.shortDescription}</p>
            )}
          </div>

          {!isPortal && (
            <div className="absolute right-4 bottom-4 z-10 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
              {course.brochureUrl && (
                <button
                  type="button"
                  onClick={() => setShowBrochureModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.04] active:scale-[0.97]"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Download Brochure
                </button>
              )}
              <button
                type="button"
                onClick={handlePrimaryAction}
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.04] active:scale-[0.97]"
              >
                <PlusIcon className="h-4 w-4" />
                Enroll Now
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={
          isPortal
            ? "mt-10 grid gap-10 lg:grid-cols-[1fr_320px]"
            : "mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1fr_320px] lg:py-16"
        }
      >
        <div className="min-w-0">
          <RichTextContent html={course.description} className="text-ink/70" />

          {modules.length > 0 && (
            <div className="mt-12">
              <h3 className="flex items-center gap-2 text-xl font-bold text-sage">
                <DocumentIcon className="h-5 w-5" />
                All Modules &ndash; {course.title}
              </h3>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {modules.map((module, index) => (
                  <a
                    key={module._id}
                    href={`#module-${module._id}`}
                    onClick={() => setExpandedModuleId(module._id)}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
                  >
                    {(module.image || course.featuredImage) && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={module.image || course.featuredImage || ""}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-sage via-sage/40 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-3">
                      <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
                        Module {index + 1}
                      </span>
                      <span className="mt-1 text-sm leading-tight font-semibold text-white">
                        {module.title}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {modules.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-ink">Course Content</h3>
              <div className="mt-4 overflow-hidden rounded-2xl border border-ink/10">
                {modules.map((module, index) => {
                  const isOpen = expandedModuleId === module._id;
                  const quizCount = module.quizzes.length;
                  return (
                    <div
                      id={`module-${module._id}`}
                      key={module._id}
                      className="border-b border-ink/10 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => toggleModule(module._id)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <div>
                          <p className="font-semibold text-ink">
                            Chapter {index + 1} {module.title}
                          </p>
                          {quizCount > 0 && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-ink/50">
                              <DocumentIcon className="h-3.5 w-3.5" />
                              {quizCount} Quiz{quizCount === 1 ? "" : "zes"}
                            </p>
                          )}
                        </div>
                        <ChevronDownIcon
                          className={cn(
                            "h-4 w-4 shrink-0 text-ink/40 transition-transform",
                            isOpen && "rotate-180",
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="space-y-2 px-5 pb-5">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson._id}
                              className="flex items-center gap-2 text-sm text-ink/70"
                            >
                              {lesson.locked ? (
                                <LockIcon className="h-3.5 w-3.5 shrink-0 text-ink/30" />
                              ) : (
                                <CheckIcon className="h-3.5 w-3.5 shrink-0 text-teal" />
                              )}
                              <span>{lesson.title}</span>
                              {lesson.duration && (
                                <span className="text-ink/40">&middot; {lesson.duration}</span>
                              )}
                            </div>
                          ))}
                          {module.quizzes.map((quiz) => (
                            <div
                              key={quiz._id}
                              className="flex items-center gap-2 text-sm text-ink/70"
                            >
                              {quiz.locked ? (
                                <LockIcon className="h-3.5 w-3.5 shrink-0 text-ink/30" />
                              ) : (
                                <DocumentIcon className="h-3.5 w-3.5 shrink-0 text-teal" />
                              )}
                              <span>{quiz.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {curriculum && curriculum.finalQuizzes.length > 0 && (
                  <div className="px-5 py-4">
                    <p className="font-semibold text-ink">Final Assessment</p>
                    <div className="mt-2 space-y-2">
                      {curriculum.finalQuizzes.map((quiz) => (
                        <div key={quiz._id} className="flex items-center gap-2 text-sm text-ink/70">
                          {quiz.locked ? (
                            <LockIcon className="h-3.5 w-3.5 shrink-0 text-ink/30" />
                          ) : (
                            <DocumentIcon className="h-3.5 w-3.5 shrink-0 text-teal" />
                          )}
                          <span>{quiz.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6 self-start lg:sticky lg:top-24">
          <Card>
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

            <div className="mt-4">
              {isEnrolled ? (
                <FormButton
                  className="w-full"
                  onClick={() => router.push(`/student/courses/${course.slug}`)}
                >
                  Continue Learning →
                </FormButton>
              ) : !user ? (
                isFree ? (
                  <FormButton
                    className="w-full"
                    onClick={() => router.push(`${registerPath}?next=/courses/${course.slug}`)}
                  >
                    Create Account to Enroll
                  </FormButton>
                ) : (
                  <FormButton className="w-full" onClick={handleGuestCheckout}>
                    Enroll in this course
                  </FormButton>
                )
              ) : isFree ? (
                <FormButton className="w-full" onClick={handleEnrollFree} loading={isEnrolling}>
                  Enroll for Free
                </FormButton>
              ) : inCart ? (
                <FormButton variant="secondary" className="w-full" onClick={() => router.push(cartPath)}>
                  View in Cart
                </FormButton>
              ) : (
                <FormButton className="w-full" onClick={handleAddToCart}>
                  Add to Cart
                </FormButton>
              )}
            </div>
            {!user && (
              <p className="mt-3 text-center text-xs text-ink/50">
                or{" "}
                <button
                  type="button"
                  onClick={() => router.push(`${loginPath}?next=/courses/${course.slug}`)}
                  className="font-semibold text-teal hover:underline"
                >
                  Log In
                </button>
              </p>
            )}
            {actionError && <p className="mt-3 text-sm text-red-600">{actionError}</p>}
          </Card>

          {accessLines.length > 0 && (
            <Card>
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">Access</p>
              <div className="mt-2 space-y-1">
                {accessLines.map((line) => (
                  <p key={line} className="flex items-center gap-2 text-sm text-ink/80">
                    <ClockIcon className="h-4 w-4 shrink-0 text-ink/40" />
                    {line}
                  </p>
                ))}
              </div>
            </Card>
          )}

          {course.certificateEnabled && (
            <Card>
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                Completion Awards
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-ink/80">
                <GraduationCapIcon className="h-4 w-4 shrink-0 text-teal" />
                Certificate
              </p>
            </Card>
          )}

          {curriculum && (totalLessons > 0 || totalQuizzes > 0) && (
            <Card>
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">Includes</p>
              <div className="mt-2 space-y-1">
                {totalLessons > 0 && (
                  <p className="flex items-center gap-2 text-sm text-ink/80">
                    <DocumentIcon className="h-4 w-4 shrink-0 text-ink/40" />
                    {totalLessons} Lesson{totalLessons === 1 ? "" : "s"}
                  </p>
                )}
                {totalQuizzes > 0 && (
                  <p className="flex items-center gap-2 text-sm text-ink/80">
                    <CheckIcon className="h-4 w-4 shrink-0 text-ink/40" />
                    {totalQuizzes} Quiz{totalQuizzes === 1 ? "" : "zes"}
                  </p>
                )}
              </div>
            </Card>
          )}

          {isPortal && isEnrolled && (
            <Card>
              <p className="text-xs font-semibold tracking-wide text-ink/40 uppercase">
                Community
              </p>
              <LiveSessionsPreview slug={course.slug} />
              <Link
                href={`/student/courses/${course.slug}/discussions`}
                className="mt-4 flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
              >
                <DocumentIcon className="h-4 w-4 shrink-0" />
                Course Discussions
              </Link>
            </Card>
          )}
        </aside>
      </div>

      {course.brochureUrl && (
        <BrochureDownloadModal
          open={showBrochureModal}
          onClose={() => setShowBrochureModal(false)}
          brochureUrl={course.brochureUrl}
          courseId={course._id}
        />
      )}
    </div>
  );

  return isPortal ? body : <section className="bg-white">{body}</section>;
}

function LiveSessionsPreview({ slug }: { slug: string }) {
  const { accessToken } = useAuth();
  const [sessions, setSessions] = useState<LmsLiveSession[] | null>(null);
  // Read via an effect, not inline during render — Date.now() is impure and
  // this also lets the "live now" state update on its own while the page
  // stays open, without a manual refresh.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    listLiveSessionsForCourse(slug, accessToken)
      .then((data) => {
        if (!cancelled) setSessions(data);
      })
      .catch(() => {
        if (!cancelled) setSessions([]);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, accessToken]);

  useEffect(() => {
    // Deliberate post-mount read of the current time, same rationale as
    // CartContext's post-mount localStorage read: this can only be known
    // once mounted, and re-rendering once with the real value here is
    // correct, not a state-sync anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!sessions || now === null) {
    return <div className="mt-2 h-10 animate-pulse rounded-lg bg-cream" />;
  }

  const upcoming = sessions
    .filter((s) => new Date(s.scheduledAt).getTime() + s.durationMinutes * 60_000 > now)
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0];

  if (!upcoming) {
    return (
      <p className="mt-2 flex items-center gap-2 text-sm text-ink/60">
        <CalendarIcon className="h-4 w-4 shrink-0 text-ink/40" />
        No upcoming live sessions
      </p>
    );
  }

  const startsAt = new Date(upcoming.scheduledAt).getTime();
  const endsAt = startsAt + upcoming.durationMinutes * 60_000;
  const isLive = now >= startsAt && now <= endsAt;

  return (
    <div className="mt-2">
      <p className="flex items-center gap-2 text-sm font-medium text-ink">
        <CalendarIcon className="h-4 w-4 shrink-0 text-teal" />
        {upcoming.title}
      </p>
      <p className="mt-1 text-xs text-ink/50">{formatDateTime(upcoming.scheduledAt)}</p>
      <a
        href={upcoming.meetingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-2 inline-flex items-center justify-center rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.97]",
          isLive ? "bg-red-600" : "bg-sage",
        )}
      >
        {isLive ? "Join Now — Live" : "View Meeting Link"}
      </a>
    </div>
  );
}
