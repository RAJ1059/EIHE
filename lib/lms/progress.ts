import type { LmsCurriculum, LmsCurriculumLesson } from "@/types/lms";

export type CourseProgress = {
  totalItems: number;
  completedItems: number;
  percent: number;
  nextLesson: LmsCurriculumLesson | null;
};

export function computeCourseProgress(curriculum: LmsCurriculum): CourseProgress {
  const lessons = curriculum.modules.flatMap((m) => m.lessons);
  const quizzes = [...curriculum.modules.flatMap((m) => m.quizzes), ...curriculum.finalQuizzes];

  const totalItems = lessons.length + quizzes.length;
  const completedItems =
    lessons.filter((l) => l.completed).length + quizzes.filter((q) => q.passed).length;

  const percent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);
  const nextLesson = lessons.find((l) => !l.locked && !l.completed) ?? null;

  return { totalItems, completedItems, percent, nextLesson };
}
