"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { completeLesson, getCurriculum, getLesson } from "@/lib/api/lessons";
import { ApiError } from "@/lib/api/client";
import type { LmsCurriculum, LmsLesson } from "@/types/lms";
import { YouTubePlayer } from "@/components/lms/course/YouTubePlayer";
import { FormButton } from "@/components/lms/ui/FormButton";
import { CurriculumSidebar } from "@/components/lms/course/CurriculumSidebar";
import { RichTextContent } from "@/components/lms/ui/RichTextContent";
import { findNextAfterLesson, type NextStep } from "@/lib/lms/curriculumNav";

export default function LessonPlayerPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();

  const [curriculum, setCurriculum] = useState<LmsCurriculum | null>(null);
  const [lesson, setLesson] = useState<LmsLesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsPurchase, setNeedsPurchase] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [nextStep, setNextStep] = useState<NextStep | null>(null);

  const loadCurriculum = useCallback(() => {
    if (!accessToken) return;
    getCurriculum(params.slug, accessToken).then(setCurriculum).catch(() => {});
  }, [accessToken, params.slug]);

  useEffect(() => {
    loadCurriculum();
  }, [loadCurriculum]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    getLesson(params.lessonId, accessToken)
      .then((data) => {
        if (cancelled) return;
        setLesson(data);
        setError(null);
        setNeedsPurchase(false);
        setNextStep(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setLesson(null);
        setError(err instanceof ApiError ? err.message : "Could not load this lesson.");
        setNeedsPurchase(err instanceof ApiError && err.errorCode === "LESSON_LOCKED_NOT_ENROLLED");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, params.lessonId]);

  async function handleComplete() {
    if (!accessToken || !curriculum) return;
    setCompleting(true);
    try {
      await completeLesson(accessToken, params.lessonId);
      loadCurriculum();

      const next = findNextAfterLesson(curriculum, params.lessonId);
      if (next.type === "lesson") {
        // Still inside the same chapter — keep the existing flow of moving
        // straight on to the next lesson.
        router.push(`/student/courses/${params.slug}/lesson/${next.lessonId}`);
      } else {
        // End of the chapter (or the whole course) — show what's next
        // instead of silently redirecting into a quiz.
        setNextStep(next);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not mark this lesson complete.");
    } finally {
      setCompleting(false);
    }
  }

  // Only relevant for the LESSON_LOCKED_QUIZ_REQUIRED edge case (direct URL
  // entry, stale bookmark) — the sidebar already hides this link normally
  // since the lesson shows locked there too.
  const blockingQuiz = curriculum
    ? (() => {
        const moduleIndex = curriculum.modules.findIndex((m) =>
          m.lessons.some((l) => l._id === params.lessonId),
        );
        if (moduleIndex <= 0) return null;
        return curriculum.modules[moduleIndex - 1].quizzes.find((q) => !q.passed) ?? null;
      })()
    : null;

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <CurriculumSidebar slug={params.slug} curriculum={curriculum} activeLessonId={params.lessonId} />

      <div className="min-w-0 flex-1">
        {error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            <p>{error}</p>
            {needsPurchase && (
              <Link
                href={`/courses/${params.slug}`}
                className="mt-3 inline-block font-semibold underline hover:no-underline"
              >
                View course →
              </Link>
            )}
            {!needsPurchase && blockingQuiz && (
              <Link
                href={`/student/courses/${params.slug}/quiz/${blockingQuiz._id}`}
                className="mt-3 inline-block font-semibold underline hover:no-underline"
              >
                Take that chapter&rsquo;s quiz →
              </Link>
            )}
          </div>
        )}

        {!error && !lesson && (
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-white" />
        )}

        {!error && lesson && (
          <div>
            {lesson.youtubeVideoId ? (
              <YouTubePlayer videoId={lesson.youtubeVideoId} title={lesson.title} />
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl bg-ink/5 text-sm text-ink/50">
                No video attached to this lesson.
              </div>
            )}

            <h1 className="mt-6 text-2xl font-bold text-ink">{lesson.title}</h1>
            {lesson.description && <p className="mt-2 text-ink/70">{lesson.description}</p>}
            {lesson.content && (
              <RichTextContent html={lesson.content} className="mt-4 text-sm text-ink/70" />
            )}

            {lesson.topics.length > 0 && (
              <div className="mt-6 space-y-4">
                {lesson.topics.map((topic) => (
                  <div key={topic._id} className="rounded-xl border border-ink/10 bg-white p-4">
                    <h3 className="font-semibold text-ink">{topic.title}</h3>
                    {topic.content && (
                      <p className="mt-1 whitespace-pre-wrap text-sm text-ink/70">
                        {topic.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {nextStep === null && (
              <FormButton className="mt-6" onClick={handleComplete} loading={completing}>
                Mark Lesson Complete
              </FormButton>
            )}

            {nextStep?.type === "quiz" && (
              <div className="mt-6 rounded-2xl border border-teal/20 bg-teal/5 p-6 text-center">
                <p className="font-semibold text-ink">🎉 Chapter complete!</p>
                <p className="mt-1 text-sm text-ink/60">
                  Take the quiz for this chapter to unlock the next one.
                </p>
                <FormButton
                  className="mt-4"
                  onClick={() =>
                    router.push(`/student/courses/${params.slug}/quiz/${nextStep.quizId}`)
                  }
                >
                  Take Chapter Quiz →
                </FormButton>
              </div>
            )}

            {nextStep?.type === "done" && (
              <div className="mt-6 rounded-2xl border border-teal/20 bg-teal/5 p-6 text-center">
                <p className="font-semibold text-ink">🎉 You&rsquo;ve finished this course!</p>
                <FormButton
                  className="mt-4"
                  onClick={() => router.push("/student/courses")}
                >
                  Back to My Courses
                </FormButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
