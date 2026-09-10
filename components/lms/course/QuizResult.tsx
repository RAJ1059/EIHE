import type { LmsQuizSubmitResult } from "@/types/lms";
import { FormButton } from "@/components/lms/ui/FormButton";

export function QuizResult({
  result,
  canRetake,
  onRetake,
  retaking,
}: {
  result: LmsQuizSubmitResult;
  canRetake: boolean;
  onRetake: () => void;
  retaking: boolean;
}) {
  if (!result.showResults) {
    return (
      <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-ink">Quiz submitted.</p>
        <p className="mt-2 text-sm text-ink/60">
          Results for this quiz aren&rsquo;t shown immediately.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center">
      <p
        className={`text-4xl font-extrabold ${result.passed ? "text-sage" : "text-red-600"}`}
      >
        {result.percentage}%
      </p>
      <p className="mt-2 text-sm text-ink/60">
        {result.score} / {result.maxScore} points
      </p>
      <span
        className={`mt-4 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold ${
          result.passed ? "bg-teal/15 text-teal" : "bg-red-100 text-red-700"
        }`}
      >
        {result.passed ? "Passed" : "Failed"}
      </span>
      {result.expired && (
        <p className="mt-3 text-xs text-red-600">Time expired before this was submitted.</p>
      )}

      {!result.passed && canRetake && (
        <div className="mt-6">
          <FormButton onClick={onRetake} loading={retaking}>
            Retake Quiz
          </FormButton>
        </div>
      )}
      {!result.passed && !canRetake && (
        <p className="mt-6 text-sm text-ink/50">No more attempts available.</p>
      )}
    </div>
  );
}
