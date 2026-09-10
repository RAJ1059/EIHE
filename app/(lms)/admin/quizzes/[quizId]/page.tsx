"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import {
  createQuestion,
  deleteQuestion,
  getAdminQuiz,
  listQuestions,
  reorderQuestions,
  updateQuestion,
  updateQuiz,
  type QuestionInput,
  type QuizInput,
} from "@/lib/api/quizzes";
import type { LmsQuestion, LmsQuestionType, LmsQuiz } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, Select, Textarea } from "@/components/lms/ui/Input";

const QUESTION_TYPES: { value: LmsQuestionType; label: string }[] = [
  { value: "SINGLE_CHOICE", label: "Single choice" },
  { value: "MULTIPLE_CHOICE", label: "Multiple choice" },
  { value: "TRUE_FALSE", label: "True / False" },
  { value: "SHORT_ANSWER", label: "Short answer" },
];

export default function QuizBuilderPage() {
  const params = useParams<{ quizId: string }>();
  const { accessToken } = useAuth();
  const [quiz, setQuiz] = useState<LmsQuiz | null>(null);
  const [questions, setQuestions] = useState<LmsQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    setQuiz(await getAdminQuiz(accessToken, params.quizId));
    setQuestions(await listQuestions(accessToken, params.quizId));
  }, [accessToken, params.quizId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await refresh();
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load this quiz.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  async function handleSaveSettings(input: Partial<QuizInput>) {
    if (!accessToken) return;
    await updateQuiz(accessToken, params.quizId, input);
    await refresh();
  }

  async function handleAddQuestion(input: QuestionInput) {
    if (!accessToken) return;
    await createQuestion(accessToken, params.quizId, input);
    setShowAddQuestion(false);
    await refresh();
  }

  async function handleUpdateQuestion(id: string, input: Partial<QuestionInput>) {
    if (!accessToken) return;
    await updateQuestion(accessToken, id, input);
    await refresh();
  }

  async function handleDeleteQuestion(id: string) {
    if (!accessToken) return;
    if (!confirm("Delete this question?")) return;
    await deleteQuestion(accessToken, id);
    await refresh();
  }

  async function handleMoveQuestion(id: string, direction: -1 | 1) {
    if (!accessToken || !questions) return;
    const ids = questions.map((q) => q._id);
    const index = ids.indexOf(id);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await reorderQuestions(accessToken, ids);
    await refresh();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!quiz) return <div className="h-64 animate-pulse rounded-2xl bg-cream" />;

  return (
    <div>
      <Link
        href={`/admin/courses`}
        className="text-sm font-semibold text-teal hover:underline"
      >
        ← Back to Courses
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-ink">{quiz.title}</h1>

      <div className="mt-6">
        <QuizSettingsForm quiz={quiz} onSave={handleSaveSettings} />
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Questions</h2>
          <button
            type="button"
            onClick={() => setShowAddQuestion((v) => !v)}
            className="text-sm font-semibold text-teal hover:underline"
          >
            {showAddQuestion ? "Close" : "+ Add Question"}
          </button>
        </div>

        {showAddQuestion && (
          <Card className="mt-4">
            <QuestionForm submitLabel="Add Question" onSubmit={handleAddQuestion} />
          </Card>
        )}

        <div className="mt-4 space-y-4">
          {questions?.map((question, index) => (
            <QuestionCard
              key={question._id}
              question={question}
              isFirst={index === 0}
              isLast={index === questions.length - 1}
              onMove={(direction) => handleMoveQuestion(question._id, direction)}
              onUpdate={(input) => handleUpdateQuestion(question._id, input)}
              onDelete={() => handleDeleteQuestion(question._id)}
            />
          ))}
          {questions?.length === 0 && (
            <p className="text-sm text-ink/50">No questions yet. Add the first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizSettingsForm({
  quiz,
  onSave,
}: {
  quiz: LmsQuiz;
  onSave: (input: Partial<QuizInput>) => Promise<void>;
}) {
  const [description, setDescription] = useState(quiz.description);
  const [passingPercentage, setPassingPercentage] = useState(String(quiz.passingPercentage));
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(
    quiz.timeLimitMinutes != null ? String(quiz.timeLimitMinutes) : "",
  );
  const [maxAttempts, setMaxAttempts] = useState(
    quiz.maxAttempts != null ? String(quiz.maxAttempts) : "",
  );
  const [retakeDelayMinutes, setRetakeDelayMinutes] = useState(
    quiz.retakeDelayMinutes != null ? String(quiz.retakeDelayMinutes) : "",
  );
  const [randomizeQuestions, setRandomizeQuestions] = useState(quiz.randomizeQuestions);
  const [randomizeAnswers, setRandomizeAnswers] = useState(quiz.randomizeAnswers);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(quiz.showCorrectAnswers);
  const [showResults, setShowResults] = useState(quiz.showResults);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await onSave({
        description,
        passingPercentage: Number(passingPercentage) || 0,
        timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
        maxAttempts: maxAttempts ? Number(maxAttempts) : null,
        retakeDelayMinutes: retakeDelayMinutes ? Number(retakeDelayMinutes) : null,
        randomizeQuestions,
        randomizeAnswers,
        showCorrectAnswers,
        showResults,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-4">
      <div>
        <Label htmlFor="quiz-description">Description</Label>
        <Textarea
          id="quiz-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="quiz-pass">Passing %</Label>
          <Input
            id="quiz-pass"
            type="number"
            min={0}
            max={100}
            value={passingPercentage}
            onChange={(e) => setPassingPercentage(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quiz-time">Time limit (min)</Label>
          <Input
            id="quiz-time"
            type="number"
            min={1}
            placeholder="Unlimited"
            value={timeLimitMinutes}
            onChange={(e) => setTimeLimitMinutes(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quiz-attempts">Max attempts</Label>
          <Input
            id="quiz-attempts"
            type="number"
            min={1}
            placeholder="Unlimited"
            value={maxAttempts}
            onChange={(e) => setMaxAttempts(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="quiz-retake-delay">Retake delay (min)</Label>
          <Input
            id="quiz-retake-delay"
            type="number"
            min={0}
            placeholder="Immediate"
            value={retakeDelayMinutes}
            onChange={(e) => setRetakeDelayMinutes(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-ink">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={randomizeQuestions}
            onChange={(e) => setRandomizeQuestions(e.target.checked)}
          />
          Randomize question order
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={randomizeAnswers}
            onChange={(e) => setRandomizeAnswers(e.target.checked)}
          />
          Randomize answer order
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showCorrectAnswers}
            onChange={(e) => setShowCorrectAnswers(e.target.checked)}
          />
          Show correct answers after submit
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showResults}
            onChange={(e) => setShowResults(e.target.checked)}
          />
          Show score after submit
        </label>
      </div>
      <FormButton onClick={submit} loading={saving}>
        Save Settings
      </FormButton>
    </Card>
  );
}

function QuestionCard({
  question,
  isFirst,
  isLast,
  onMove,
  onUpdate,
  onDelete,
}: {
  question: LmsQuestion;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onUpdate: (input: Partial<QuestionInput>) => Promise<void>;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={isFirst}
              className="text-xs text-ink/40 hover:text-ink disabled:opacity-20"
              aria-label="Move question up"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={isLast}
              className="text-xs text-ink/40 hover:text-ink disabled:opacity-20"
              aria-label="Move question down"
            >
              ▼
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{question.text}</p>
            <p className="text-xs text-ink/50">
              {QUESTION_TYPES.find((t) => t.value === question.type)?.label} ·{" "}
              {question.points} {question.points === 1 ? "point" : "points"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-xs font-semibold text-teal hover:underline"
          >
            {editing ? "Close" : "Edit"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-xs font-semibold text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      {editing && (
        <div className="mt-3 border-t border-ink/10 pt-4">
          <QuestionForm
            initial={question}
            submitLabel="Save Changes"
            onSubmit={async (input) => {
              await onUpdate(input);
              setEditing(false);
            }}
          />
        </div>
      )}
    </Card>
  );
}

function QuestionForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: LmsQuestion;
  submitLabel: string;
  onSubmit: (input: QuestionInput) => Promise<void>;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [type, setType] = useState<LmsQuestionType>(initial?.type ?? "SINGLE_CHOICE");
  const [options, setOptions] = useState(
    initial?.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect ?? false })) ?? [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  );
  const [correctAnswers, setCorrectAnswers] = useState(
    initial?.correctAnswers.join(", ") ?? "",
  );
  const [points, setPoints] = useState(String(initial?.points ?? 1));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function changeType(next: LmsQuestionType) {
    setType(next);
    if (next === "TRUE_FALSE") {
      setOptions([
        { text: "True", isCorrect: true },
        { text: "False", isCorrect: false },
      ]);
    }
  }

  function updateOption(index: number, field: "text" | "isCorrect", value: string | boolean) {
    setOptions((prev) =>
      prev.map((o, i) => {
        if (i !== index) {
          // Single/true-false questions only ever have one correct option.
          if (field === "isCorrect" && value === true && type !== "MULTIPLE_CHOICE") {
            return { ...o, isCorrect: false };
          }
          return o;
        }
        return { ...o, [field]: value };
      }),
    );
  }

  async function submit() {
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        text: text.trim(),
        type,
        points: Number(points) || 1,
        ...(type === "SHORT_ANSWER"
          ? {
              correctAnswers: correctAnswers
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
            }
          : { options: options.filter((o) => o.text.trim()) }),
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this question.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="question-text">Question</Label>
        <Textarea id="question-text" rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="question-type">Type</Label>
          <Select
            id="question-type"
            value={type}
            onChange={(e) => changeType(e.target.value as LmsQuestionType)}
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="question-points">Points</Label>
          <Input
            id="question-points"
            type="number"
            min={1}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
      </div>

      {type === "SHORT_ANSWER" ? (
        <div>
          <Label htmlFor="question-answers">Accepted answers (comma-separated)</Label>
          <Input
            id="question-answers"
            value={correctAnswers}
            onChange={(e) => setCorrectAnswers(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <Label htmlFor="question-options">Options (check the correct one(s))</Label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type={type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
                  name="correct-option"
                  checked={option.isCorrect}
                  onChange={(e) => updateOption(index, "isCorrect", e.target.checked)}
                  disabled={type === "TRUE_FALSE"}
                />
                <Input
                  value={option.text}
                  disabled={type === "TRUE_FALSE"}
                  onChange={(e) => updateOption(index, "text", e.target.value)}
                />
                {type !== "TRUE_FALSE" && options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))}
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            {type !== "TRUE_FALSE" && (
              <button
                type="button"
                onClick={() => setOptions((prev) => [...prev, { text: "", isCorrect: false }])}
                className="text-xs font-semibold text-teal hover:underline"
              >
                + Add Option
              </button>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <FormButton onClick={submit} loading={saving} disabled={!text.trim()}>
        {submitLabel}
      </FormButton>
    </div>
  );
}
