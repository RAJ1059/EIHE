"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { getCurriculum } from "@/lib/api/lessons";
import { getQuiz, startQuiz, submitQuiz } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";
import type {
  LmsCurriculum,
  LmsQuizForViewer,
  LmsQuizStartResult,
  LmsQuizSubmitResult,
} from "@/types/lms";
import { CurriculumSidebar } from "@/components/lms/course/CurriculumSidebar";
import { QuizTimer } from "@/components/lms/course/QuizTimer";
import { QuizQuestion, type QuestionAnswerValue } from "@/components/lms/course/QuizQuestion";
import { QuizResult } from "@/components/lms/course/QuizResult";
import { FormButton } from "@/components/lms/ui/FormButton";
import { findNextAfterQuiz, type NextStep } from "@/lib/lms/curriculumNav";

type Stage = "intro" | "taking" | "result";

export default function QuizPlayerPage() {
  const params = useParams<{ slug: string; quizId: string }>();
  const router = useRouter();
  const { accessToken } = useAuth();

  const [curriculum, setCurriculum] = useState<LmsCurriculum | null>(null);
  const [quiz, setQuiz] = useState<LmsQuizForViewer | null>(null);
  const [session, setSession] = useState<LmsQuizStartResult | null>(null);
  const [answers, setAnswers] = useState<Record<string, QuestionAnswerValue>>({});
  const [result, setResult] = useState<LmsQuizSubmitResult | null>(null);
  const [stage, setStage] = useState<Stage>("intro");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [nextStep, setNextStep] = useState<NextStep | null>(null);

  const loadCurriculum = useCallback(() => {
    if (!accessToken) return;
    getCurriculum(params.slug, accessToken).then(setCurriculum).catch(() => {});
  }, [accessToken, params.slug]);

  const loadQuiz = useCallback(() => {
    if (!accessToken) return;
    getQuiz(params.quizId, accessToken)
      .then(setQuiz)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load this quiz.");
      });
  }, [accessToken, params.quizId]);

  useEffect(() => {
    loadCurriculum();
    loadQuiz();
  }, [loadCurriculum, loadQuiz]);

  async function handleStart() {
    if (!accessToken) return;
    setBusy(true);
    setError(null);
    try {
      const started = await startQuiz(accessToken, params.quizId);
      setSession(started);
      setAnswers(
        Object.fromEntries(
          started.questions.map((q) => [q._id, { selectedOptionIds: [], textAnswer: "" }]),
        ),
      );
      setResult(null);
      setNextStep(null);
      setStage("taking");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start this quiz.");
    } finally {
      setBusy(false);
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!accessToken || !session) return;
    setBusy(true);
    try {
      const submitted = await submitQuiz(
        accessToken,
        params.quizId,
        session.attempt._id,
        session.questions.map((q) => ({
          questionId: q._id,
          selectedOptionIds: answers[q._id]?.selectedOptionIds,
          textAnswer: answers[q._id]?.textAnswer,
        })),
      );
      setResult(submitted);
      setStage("result");
      setNextStep(
        submitted.passed && curriculum ? findNextAfterQuiz(curriculum, params.quizId) : null,
      );
      loadQuiz();
      loadCurriculum();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit this quiz.");
    } finally {
      setBusy(false);
    }
  }, [accessToken, session, params.quizId, answers, curriculum, loadQuiz, loadCurriculum]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <CurriculumSidebar slug={params.slug} curriculum={curriculum} activeQuizId={params.quizId} />

      <div className="min-w-0 flex-1">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        {!quiz && !error && <div className="h-64 animate-pulse rounded-2xl bg-white" />}

        {quiz && stage === "intro" && (
          <div className="rounded-2xl border border-ink/10 bg-white p-8">
            <h1 className="text-2xl font-bold text-ink">{quiz.title}</h1>
            {quiz.description && <p className="mt-2 text-ink/70">{quiz.description}</p>}

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-ink/50">Passing score</dt>
                <dd className="font-semibold text-ink">{quiz.passingPercentage}%</dd>
              </div>
              <div>
                <dt className="text-ink/50">Time limit</dt>
                <dd className="font-semibold text-ink">
                  {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min` : "None"}
                </dd>
              </div>
              <div>
                <dt className="text-ink/50">Attempts</dt>
                <dd className="font-semibold text-ink">
                  {quiz.maxAttempts ? `${quiz.attemptsUsed} / ${quiz.maxAttempts}` : "Unlimited"}
                </dd>
              </div>
              <div>
                <dt className="text-ink/50">Status</dt>
                <dd className="font-semibold text-ink">
                  {quiz.passed ? "Passed" : "Not passed yet"}
                </dd>
              </div>
            </dl>

            {quiz.attempts.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold tracking-wide text-ink/50 uppercase">
                  Attempt history
                </p>
                <ul className="mt-2 space-y-1 text-sm text-ink/70">
                  {quiz.attempts.map((a) => (
                    <li key={a.attemptNumber}>
                      Attempt {a.attemptNumber} — {a.percentage}% —{" "}
                      {a.passed ? "Passed" : "Failed"}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              {quiz.locked ? (
                <p className="text-sm text-ink/50">
                  🔒 Complete the required lessons before taking this quiz.
                </p>
              ) : quiz.attemptsRemaining === 0 ? (
                <p className="text-sm text-ink/50">No more attempts available.</p>
              ) : (
                <FormButton onClick={handleStart} loading={busy}>
                  {quiz.attemptsUsed > 0 ? "Retake Quiz" : "Start Quiz"}
                </FormButton>
              )}
            </div>
          </div>
        )}

        {stage === "taking" && session && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-xl font-bold text-ink">{quiz?.title}</h1>
              {session.attempt.timeLimitMinutes && (
                <QuizTimer
                  totalSeconds={session.attempt.timeLimitMinutes * 60}
                  onExpire={handleSubmit}
                />
              )}
            </div>

            <div className="space-y-4">
              {session.questions.map((q, index) => (
                <QuizQuestion
                  key={q._id}
                  index={index}
                  question={q}
                  value={answers[q._id] ?? { selectedOptionIds: [], textAnswer: "" }}
                  onChange={(value) => setAnswers((prev) => ({ ...prev, [q._id]: value }))}
                />
              ))}
            </div>

            <FormButton className="mt-6" onClick={handleSubmit} loading={busy}>
              Submit Quiz
            </FormButton>
          </div>
        )}

        {stage === "result" && result && (
          <QuizResult
            result={result}
            canRetake={quiz ? quiz.attemptsRemaining !== 0 && !quiz.locked : false}
            retaking={busy}
            onRetake={handleStart}
            onContinue={
              nextStep?.type === "lesson"
                ? () => router.push(`/student/courses/${params.slug}/lesson/${nextStep.lessonId}`)
                : nextStep?.type === "quiz"
                  ? () => router.push(`/student/courses/${params.slug}/quiz/${nextStep.quizId}`)
                  : nextStep?.type === "done"
                    ? () => router.push("/student/courses")
                    : undefined
            }
            continueLabel={nextStep?.type === "done" ? "Back to My Courses" : "Continue →"}
          />
        )}
      </div>
    </div>
  );
}
