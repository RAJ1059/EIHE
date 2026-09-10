"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { getAdminCourse } from "@/lib/api/courses";
import {
  createModule,
  deleteModule,
  listAdminModules,
  reorderModules,
  updateModule,
} from "@/lib/api/modules";
import {
  createLesson,
  deleteLesson,
  listAdminLessons,
  reorderLessons,
  updateLesson,
  type LessonInput,
} from "@/lib/api/lessons";
import {
  createFinalQuiz,
  createModuleQuiz,
  deleteQuiz,
  listFinalQuizzes,
  listModuleQuizzes,
} from "@/lib/api/quizzes";
import type { LmsCourse, LmsLesson, LmsModule, LmsQuiz } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, Textarea } from "@/components/lms/ui/Input";

type ModuleWithContent = LmsModule & { lessons: LmsLesson[]; quizzes: LmsQuiz[] };

export default function CourseContentPage() {
  const params = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [course, setCourse] = useState<LmsCourse | null>(null);
  const [modules, setModules] = useState<ModuleWithContent[] | null>(null);
  const [finalQuizzes, setFinalQuizzes] = useState<LmsQuiz[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!accessToken) return;
    const moduleList = await listAdminModules(accessToken, params.id);
    const withContent = await Promise.all(
      moduleList.map(async (module) => ({
        ...module,
        lessons: await listAdminLessons(accessToken, module._id),
        quizzes: await listModuleQuizzes(accessToken, module._id),
      })),
    );
    setModules(withContent);
    setFinalQuizzes(await listFinalQuizzes(accessToken, params.id));
  }, [accessToken, params.id]);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    async function load() {
      try {
        const loadedCourse = await getAdminCourse(accessToken as string, params.id);
        if (cancelled) return;
        setCourse(loadedCourse);
        await refresh();
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load course content.");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [accessToken, params.id, refresh]);

  async function handleAddModule(title: string) {
    if (!accessToken) return;
    await createModule(accessToken, params.id, { title });
    await refresh();
  }

  async function handleMoveModule(moduleId: string, direction: -1 | 1) {
    if (!accessToken || !modules) return;
    const ids = modules.map((m) => m._id);
    const index = ids.indexOf(moduleId);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await reorderModules(accessToken, ids);
    await refresh();
  }

  async function handleRenameModule(moduleId: string, title: string) {
    if (!accessToken) return;
    await updateModule(accessToken, moduleId, { title });
    await refresh();
  }

  async function handleDeleteModule(moduleId: string) {
    if (!accessToken) return;
    if (!confirm("Delete this module and all its lessons?")) return;
    await deleteModule(accessToken, moduleId);
    await refresh();
  }

  async function handleAddLesson(moduleId: string, input: LessonInput) {
    if (!accessToken) return;
    await createLesson(accessToken, moduleId, input);
    await refresh();
  }

  async function handleUpdateLesson(lessonId: string, input: Partial<LessonInput>) {
    if (!accessToken) return;
    await updateLesson(accessToken, lessonId, input);
    await refresh();
  }

  async function handleDeleteLesson(lessonId: string) {
    if (!accessToken) return;
    if (!confirm("Delete this lesson?")) return;
    await deleteLesson(accessToken, lessonId);
    await refresh();
  }

  async function handleMoveLesson(module: ModuleWithContent, lessonId: string, direction: -1 | 1) {
    if (!accessToken) return;
    const ids = module.lessons.map((l) => l._id);
    const index = ids.indexOf(lessonId);
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    await reorderLessons(accessToken, ids);
    await refresh();
  }

  async function handleAddModuleQuiz(moduleId: string) {
    if (!accessToken) return;
    const title = prompt("Quiz title?");
    if (!title?.trim()) return;
    await createModuleQuiz(accessToken, moduleId, { title: title.trim() });
    await refresh();
  }

  async function handleAddFinalQuiz() {
    if (!accessToken) return;
    const title = prompt("Final quiz title?");
    if (!title?.trim()) return;
    await createFinalQuiz(accessToken, params.id, { title: title.trim() });
    await refresh();
  }

  async function handleDeleteQuiz(quizId: string) {
    if (!accessToken) return;
    if (!confirm("Delete this quiz and all its questions?")) return;
    await deleteQuiz(accessToken, quizId);
    await refresh();
  }

  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">
        {course ? `Content — ${course.title}` : "Course Content"}
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Build the curriculum: add modules, then add YouTube lessons inside each one.
      </p>

      {modules === null && <div className="mt-6 h-40 animate-pulse rounded-2xl bg-cream" />}

      {modules && (
        <div className="mt-6 space-y-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={module._id}
              module={module}
              isFirst={index === 0}
              isLast={index === modules.length - 1}
              onMove={(direction) => handleMoveModule(module._id, direction)}
              onRename={(title) => handleRenameModule(module._id, title)}
              onDelete={() => handleDeleteModule(module._id)}
              onAddLesson={(input) => handleAddLesson(module._id, input)}
              onUpdateLesson={handleUpdateLesson}
              onDeleteLesson={handleDeleteLesson}
              onMoveLesson={(lessonId, direction) => handleMoveLesson(module, lessonId, direction)}
              onAddQuiz={() => handleAddModuleQuiz(module._id)}
              onDeleteQuiz={handleDeleteQuiz}
            />
          ))}

          {modules.length === 0 && (
            <p className="text-sm text-ink/50">No modules yet. Add the first one below.</p>
          )}

          <AddModuleForm onAdd={handleAddModule} />

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Final Assessment</h2>
              <button
                type="button"
                onClick={handleAddFinalQuiz}
                className="text-sm font-semibold text-teal hover:underline"
              >
                + Add Final Quiz
              </button>
            </div>
            <p className="mt-1 text-xs text-ink/50">
              Course-level quizzes, unlocked once every lesson in the course is complete.
            </p>
            <ul className="mt-4 divide-y divide-ink/5">
              {finalQuizzes?.map((quiz) => (
                <QuizRow key={quiz._id} quiz={quiz} onDelete={() => handleDeleteQuiz(quiz._id)} />
              ))}
              {finalQuizzes?.length === 0 && (
                <li className="py-3 text-sm text-ink/40">No final quiz yet.</li>
              )}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}

function AddModuleForm({ onAdd }: { onAdd: (title: string) => Promise<void> }) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onAdd(title.trim());
      setTitle("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="flex items-center gap-3">
      <Input
        placeholder="New module title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormButton onClick={submit} loading={saving} disabled={!title.trim()}>
        + Add Module
      </FormButton>
    </Card>
  );
}

function ModuleCard({
  module,
  isFirst,
  isLast,
  onMove,
  onRename,
  onDelete,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onMoveLesson,
  onAddQuiz,
  onDeleteQuiz,
}: {
  module: ModuleWithContent;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onRename: (title: string) => void;
  onDelete: () => void;
  onAddLesson: (input: LessonInput) => Promise<void>;
  onUpdateLesson: (lessonId: string, input: Partial<LessonInput>) => Promise<void>;
  onDeleteLesson: (lessonId: string) => void;
  onMoveLesson: (lessonId: string, direction: -1 | 1) => void;
  onAddQuiz: () => void;
  onDeleteQuiz: (quizId: string) => void;
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [showAddLesson, setShowAddLesson] = useState(false);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={isFirst}
              className="text-ink/40 hover:text-ink disabled:opacity-20"
              aria-label="Move module up"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={isLast}
              className="text-ink/40 hover:text-ink disabled:opacity-20"
              aria-label="Move module down"
            >
              ▼
            </button>
          </div>

          {editingTitle ? (
            <div className="flex flex-1 items-center gap-2">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <FormButton
                variant="secondary"
                onClick={() => {
                  onRename(title.trim() || module.title);
                  setEditingTitle(false);
                }}
              >
                Save
              </FormButton>
            </div>
          ) : (
            <h2
              className="cursor-pointer text-lg font-semibold text-ink"
              onClick={() => setEditingTitle(true)}
              title="Click to rename"
            >
              {module.title}
            </h2>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAddQuiz}
            className="text-sm font-semibold text-teal hover:underline"
          >
            + Add Quiz
          </button>
          <button
            type="button"
            onClick={() => setShowAddLesson((v) => !v)}
            className="text-sm font-semibold text-teal hover:underline"
          >
            + Add Lesson
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-sm font-semibold text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-ink/5">
        {module.lessons.map((lesson, index) => (
          <LessonRow
            key={lesson._id}
            lesson={lesson}
            isFirst={index === 0}
            isLast={index === module.lessons.length - 1}
            onMove={(direction) => onMoveLesson(lesson._id, direction)}
            onUpdate={(input) => onUpdateLesson(lesson._id, input)}
            onDelete={() => onDeleteLesson(lesson._id)}
          />
        ))}
        {module.quizzes.map((quiz) => (
          <QuizRow key={quiz._id} quiz={quiz} onDelete={() => onDeleteQuiz(quiz._id)} />
        ))}
        {module.lessons.length === 0 && module.quizzes.length === 0 && (
          <li className="py-3 text-sm text-ink/40">No lessons or quizzes in this module yet.</li>
        )}
      </ul>

      {showAddLesson && (
        <div className="mt-4 border-t border-ink/10 pt-4">
          <LessonForm
            onSubmit={async (input) => {
              await onAddLesson(input);
              setShowAddLesson(false);
            }}
            submitLabel="Add Lesson"
          />
        </div>
      )}
    </Card>
  );
}

function QuizRow({ quiz, onDelete }: { quiz: LmsQuiz; onDelete: () => void }) {
  return (
    <li className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-ink">📝 {quiz.title}</p>
        <p className="text-xs text-ink/50">
          Pass {quiz.passingPercentage}%
          {quiz.timeLimitMinutes ? ` · ${quiz.timeLimitMinutes} min` : ""}
          {quiz.maxAttempts ? ` · ${quiz.maxAttempts} attempts` : " · unlimited attempts"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/quizzes/${quiz._id}`}
          className="text-xs font-semibold text-teal hover:underline"
        >
          Manage Questions
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs font-semibold text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </li>
  );
}

function LessonRow({
  lesson,
  isFirst,
  isLast,
  onMove,
  onUpdate,
  onDelete,
}: {
  lesson: LmsLesson;
  isFirst: boolean;
  isLast: boolean;
  onMove: (direction: -1 | 1) => void;
  onUpdate: (input: Partial<LessonInput>) => Promise<void>;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={isFirst}
              className="text-xs text-ink/40 hover:text-ink disabled:opacity-20"
              aria-label="Move lesson up"
            >
              ▲
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={isLast}
              className="text-xs text-ink/40 hover:text-ink disabled:opacity-20"
              aria-label="Move lesson down"
            >
              ▼
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{lesson.title}</p>
            <p className="text-xs text-ink/50">
              {lesson.allowFreePreview && "Free preview · "}
              {lesson.requirePreviousLesson && "Requires previous lesson · "}
              {lesson.duration || "No duration set"}
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
        <div className="mt-3 rounded-xl bg-cream/50 p-4">
          <LessonForm
            initial={lesson}
            submitLabel="Save Changes"
            onSubmit={async (input) => {
              await onUpdate(input);
              setEditing(false);
            }}
          />
        </div>
      )}
    </li>
  );
}

function LessonForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: LmsLesson;
  submitLabel: string;
  onSubmit: (input: LessonInput) => Promise<void>;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [requirePreviousLesson, setRequirePreviousLesson] = useState(
    initial?.requirePreviousLesson ?? false,
  );
  const [allowFreePreview, setAllowFreePreview] = useState(initial?.allowFreePreview ?? false);
  const [topics, setTopics] = useState(initial?.topics ?? []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTopic() {
    setTopics((prev) => [
      ...prev,
      { _id: `new-${prev.length}`, title: "", content: "", order: prev.length },
    ]);
  }

  function updateTopic(index: number, field: "title" | "content", value: string) {
    setTopics((prev) => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  }

  function removeTopic(index: number) {
    setTopics((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit() {
    if (!title.trim() || !youtubeUrl.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        youtubeUrl: youtubeUrl.trim(),
        description: description.trim(),
        content: content.trim(),
        duration: duration.trim(),
        requirePreviousLesson,
        allowFreePreview,
        topics: topics
          .filter((t) => t.title.trim())
          .map((t, order) => ({ title: t.title.trim(), content: t.content, order })),
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save this lesson.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="lesson-title">Title</Label>
        <Input id="lesson-title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="lesson-youtube">YouTube URL</Label>
        <Input
          id="lesson-youtube"
          placeholder="https://www.youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="lesson-duration">Duration (optional, e.g. 12:30)</Label>
        <Input id="lesson-duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="lesson-description">Description</Label>
        <Textarea
          id="lesson-description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="lesson-content">Lesson notes / content</Label>
        <Textarea
          id="lesson-content"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-ink">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={requirePreviousLesson}
            onChange={(e) => setRequirePreviousLesson(e.target.checked)}
          />
          Require previous lesson to be completed first
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={allowFreePreview}
            onChange={(e) => setAllowFreePreview(e.target.checked)}
          />
          Allow free preview (no enrollment needed)
        </label>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="lesson-topics">Topics (optional sub-sections within this lesson)</Label>
          <button
            type="button"
            onClick={addTopic}
            className="text-xs font-semibold text-teal hover:underline"
          >
            + Add Topic
          </button>
        </div>
        <div className="space-y-2">
          {topics.map((topic, index) => (
            <div key={topic._id} className="rounded-lg border border-ink/10 p-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Topic title"
                  value={topic.title}
                  onChange={(e) => updateTopic(index, "title", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeTopic(index)}
                  className="shrink-0 text-xs font-semibold text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <Textarea
                className="mt-2"
                rows={2}
                placeholder="Topic content"
                value={topic.content}
                onChange={(e) => updateTopic(index, "content", e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <FormButton onClick={submit} loading={saving} disabled={!title.trim() || !youtubeUrl.trim()}>
        {submitLabel}
      </FormButton>
    </div>
  );
}
