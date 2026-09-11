import type { LmsCurriculum } from "@/types/lms";

export type NextStep =
  | { type: "lesson"; lessonId: string }
  | { type: "quiz"; quizId: string }
  | { type: "done" };

/** What comes right after a module's own content is exhausted: its next
 * sibling module's first lesson, or — if this was the last module — the
 * next unpassed course-level final quiz, or nothing left at all. */
export function findNextAfterModule(curriculum: LmsCurriculum, moduleId: string): NextStep {
  const moduleIndex = curriculum.modules.findIndex((m) => m._id === moduleId);
  const nextModule = moduleIndex >= 0 ? curriculum.modules[moduleIndex + 1] : undefined;
  if (nextModule?.lessons[0]) {
    return { type: "lesson", lessonId: nextModule.lessons[0]._id };
  }

  const nextFinalQuiz = curriculum.finalQuizzes.find((q) => !q.passed);
  if (nextFinalQuiz) return { type: "quiz", quizId: nextFinalQuiz._id };

  return { type: "done" };
}

/** What a student should do right after completing a given lesson: the
 * next lesson in the same chapter, that chapter's quiz if one hasn't been
 * passed yet, or whatever comes after the chapter otherwise. */
export function findNextAfterLesson(curriculum: LmsCurriculum, lessonId: string): NextStep {
  for (const chapter of curriculum.modules) {
    const index = chapter.lessons.findIndex((l) => l._id === lessonId);
    if (index === -1) continue;

    const nextInModule = chapter.lessons[index + 1];
    if (nextInModule) return { type: "lesson", lessonId: nextInModule._id };

    const unpassedQuiz = chapter.quizzes.find((q) => !q.passed);
    if (unpassedQuiz) return { type: "quiz", quizId: unpassedQuiz._id };

    return findNextAfterModule(curriculum, chapter._id);
  }
  return { type: "done" };
}

/** What comes after passing a given quiz — resolves both chapter quizzes
 * (advance past their module) and course-level final quizzes. */
export function findNextAfterQuiz(curriculum: LmsCurriculum, quizId: string): NextStep {
  const chapter = curriculum.modules.find((m) => m.quizzes.some((q) => q._id === quizId));
  if (chapter) return findNextAfterModule(curriculum, chapter._id);

  const nextFinalQuiz = curriculum.finalQuizzes.find((q) => q._id !== quizId && !q.passed);
  if (nextFinalQuiz) return { type: "quiz", quizId: nextFinalQuiz._id };

  return { type: "done" };
}
