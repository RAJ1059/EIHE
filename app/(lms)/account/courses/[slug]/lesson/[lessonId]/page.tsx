"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { completeLesson, getCurriculum, getLesson } from "@/lib/api/lessons";
import { ApiError } from "@/lib/api/client";
import type { LmsCurriculum, LmsLesson } from "@/types/lms";
import { YouTubePlayer } from "@/components/lms/course/YouTubePlayer";
import { FormButton } from "@/components/lms/ui/FormButton";
import { CurriculumSidebar } from "@/components/lms/course/CurriculumSidebar";

export default function LessonPlayerPage() {
  const params = useParams<{ slug: string; lessonId: string }>();
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuth();

  const [curriculum, setCurriculum] = useState<LmsCurriculum | null>(null);
  const [lesson, setLesson] = useState<LmsLesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

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
      })
      .catch((err) => {
        if (cancelled) return;
        setLesson(null);
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not load this lesson.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, params.lessonId]);

  async function handleComplete() {
    if (!accessToken) return;
    setCompleting(true);
    try {
      await completeLesson(accessToken, params.lessonId);
      loadCurriculum();

      const allLessons = (curriculum?.modules ?? []).flatMap((m) => m.lessons);
      const index = allLessons.findIndex((l) => l._id === params.lessonId);
      const next = allLessons[index + 1];
      if (next) {
        router.push(`/account/courses/${params.slug}/lesson/${next._id}`);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not mark this lesson complete.");
    } finally {
      setCompleting(false);
    }
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Loading…</p>
      </div>
    );
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <CurriculumSidebar
          slug={params.slug}
          curriculum={curriculum}
          activeLessonId={params.lessonId}
        />

        <div className="min-w-0 flex-1">
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
              {error}
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
                <p className="mt-4 whitespace-pre-wrap text-sm text-ink/70">{lesson.content}</p>
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

              <FormButton className="mt-6" onClick={handleComplete} loading={completing}>
                Mark Lesson Complete
              </FormButton>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
