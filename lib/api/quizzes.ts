import { apiFetch } from "./client";
import type {
  LmsAdminQuizSummary,
  LmsQuestion,
  LmsQuestionType,
  LmsQuiz,
  LmsQuizAttempt,
  LmsQuizForViewer,
  LmsQuizStartResult,
  LmsQuizSubmitResult,
} from "@/types/lms";

export type QuizInput = {
  title: string;
  description?: string;
  passingPercentage?: number;
  timeLimitMinutes?: number | null;
  maxAttempts?: number | null;
  retakeDelayMinutes?: number | null;
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
  showCorrectAnswers?: boolean;
  showResults?: boolean;
};

export type QuestionOptionInput = { text: string; isCorrect?: boolean };

export type QuestionInput = {
  text: string;
  type: LmsQuestionType;
  options?: QuestionOptionInput[];
  correctAnswers?: string[];
  points?: number;
};

// --- Student ---

export function getQuiz(id: string, accessToken?: string | null) {
  return apiFetch<LmsQuizForViewer>(`/quizzes/${id}`, { accessToken: accessToken ?? undefined });
}

export function startQuiz(accessToken: string, id: string) {
  return apiFetch<LmsQuizStartResult>(`/quizzes/${id}/start`, { method: "POST", accessToken });
}

export type SubmitQuizAnswer = {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
};

export function submitQuiz(
  accessToken: string,
  id: string,
  attemptId: string,
  answers: SubmitQuizAnswer[],
) {
  return apiFetch<LmsQuizSubmitResult>(`/quizzes/${id}/submit`, {
    method: "POST",
    accessToken,
    body: { attemptId, answers },
  });
}

export function getMyQuizAttempts(accessToken: string, id: string) {
  return apiFetch<LmsQuizAttempt[]>(`/quizzes/${id}/attempts`, { accessToken });
}

// --- Admin: quizzes ---

export function listModuleQuizzes(accessToken: string, moduleId: string) {
  return apiFetch<LmsQuiz[]>(`/admin/modules/${moduleId}/quizzes`, { accessToken });
}

export function createModuleQuiz(accessToken: string, moduleId: string, input: QuizInput) {
  return apiFetch<LmsQuiz>(`/admin/modules/${moduleId}/quizzes`, {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function listFinalQuizzes(accessToken: string, courseId: string) {
  return apiFetch<LmsQuiz[]>(`/admin/courses/${courseId}/final-quizzes`, { accessToken });
}

export function createFinalQuiz(accessToken: string, courseId: string, input: QuizInput) {
  return apiFetch<LmsQuiz>(`/admin/courses/${courseId}/final-quizzes`, {
    method: "POST",
    accessToken,
    body: input,
  });
}

/** Cross-course listing for the admin Quizzes page. */
export function listAllQuizzes(accessToken: string) {
  return apiFetch<LmsAdminQuizSummary[]>("/admin/quizzes", { accessToken });
}

export function getAdminQuiz(accessToken: string, id: string) {
  return apiFetch<LmsQuiz>(`/admin/quizzes/${id}`, { accessToken });
}

export function updateQuiz(accessToken: string, id: string, input: Partial<QuizInput>) {
  return apiFetch<LmsQuiz>(`/admin/quizzes/${id}`, { method: "PUT", accessToken, body: input });
}

export function deleteQuiz(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/quizzes/${id}`, { method: "DELETE", accessToken });
}

export function duplicateQuiz(accessToken: string, id: string) {
  return apiFetch<LmsQuiz>(`/admin/quizzes/${id}/duplicate`, { method: "POST", accessToken });
}

export function reorderQuizzes(accessToken: string, orderedIds: string[]) {
  return apiFetch<null>(`/admin/quizzes/reorder`, {
    method: "PUT",
    accessToken,
    body: { orderedIds },
  });
}

// --- Admin: questions ---

export function listQuestions(accessToken: string, quizId: string) {
  return apiFetch<LmsQuestion[]>(`/admin/quizzes/${quizId}/questions`, { accessToken });
}

export function createQuestion(accessToken: string, quizId: string, input: QuestionInput) {
  return apiFetch<LmsQuestion>(`/admin/quizzes/${quizId}/questions`, {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function updateQuestion(accessToken: string, id: string, input: Partial<QuestionInput>) {
  return apiFetch<LmsQuestion>(`/admin/questions/${id}`, {
    method: "PUT",
    accessToken,
    body: input,
  });
}

export function deleteQuestion(accessToken: string, id: string) {
  return apiFetch<null>(`/admin/questions/${id}`, { method: "DELETE", accessToken });
}

export function reorderQuestions(accessToken: string, orderedIds: string[]) {
  return apiFetch<null>(`/admin/questions/reorder`, {
    method: "PUT",
    accessToken,
    body: { orderedIds },
  });
}
