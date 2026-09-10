// Shared types for the LMS backend integration.
// Namespaced with an `Lms` prefix to avoid colliding with the unrelated
// marketing `Course` type in data/courses.ts (used by the static /programs pages).

export type LmsRole = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";

export type LmsUser = {
  id: string;
  name: string;
  email: string;
  role: LmsRole;
};

export type LmsCourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type LmsDifficultyLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LmsAccessType = "OPEN" | "FREE" | "PAID" | "CLOSED";
export type LmsAccessDurationType =
  | "NEVER_EXPIRES"
  | "DAYS_AFTER_ENROLLMENT"
  | "SPECIFIC_DATE";

export type LmsCategory = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parent: string | null;
};

export type LmsCourse = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  featuredImage: string | null;
  category: LmsCategory | string;
  subcategory: LmsCategory | string | null;
  tags: string[];
  instructor: LmsUser | string;
  difficultyLevel: LmsDifficultyLevel;
  duration: string;
  language: string;
  price: number;
  salePrice: number | null;
  currency: string;
  status: LmsCourseStatus;
  isFeatured: boolean;
  accessType: LmsAccessType;
  accessDurationType: LmsAccessDurationType;
  accessDurationDays: number | null;
  accessExpiryDate: string | null;
  enrollmentStartDate: string | null;
  enrollmentEndDate: string | null;
  prerequisites: string[];
  certificateEnabled: boolean;
  completionMinProgressPercent: number;
  createdAt: string;
  updatedAt: string;
};

export type LmsModuleStatus = "DRAFT" | "PUBLISHED";

export type LmsModule = {
  _id: string;
  title: string;
  description: string;
  course: string;
  order: number;
  status: LmsModuleStatus;
};

export type LmsTopic = {
  _id: string;
  title: string;
  content: string;
  order: number;
};

export type LmsLesson = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  module: string;
  course: string;
  videoType: "YOUTUBE";
  youtubeUrl: string | null;
  youtubeVideoId: string | null;
  duration: string;
  order: number;
  requirePreviousLesson: boolean;
  allowFreePreview: boolean;
  topics: LmsTopic[];
};

export type LmsCurriculumLesson = {
  _id: string;
  title: string;
  slug: string;
  duration: string;
  order: number;
  allowFreePreview: boolean;
  locked: boolean;
  completed: boolean;
};

export type LmsCurriculumQuiz = {
  _id: string;
  title: string;
  order: number;
  locked: boolean;
  passed: boolean;
};

export type LmsCurriculumModule = {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: LmsCurriculumLesson[];
  quizzes: LmsCurriculumQuiz[];
};

export type LmsCurriculum = {
  modules: LmsCurriculumModule[];
  finalQuizzes: LmsCurriculumQuiz[];
};

export type LmsQuestionType = "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";

export type LmsQuestionOption = {
  _id: string;
  text: string;
  isCorrect?: boolean;
};

export type LmsQuestion = {
  _id: string;
  quiz: string;
  text: string;
  type: LmsQuestionType;
  options: LmsQuestionOption[];
  correctAnswers: string[];
  points: number;
  order: number;
};

export type LmsQuiz = {
  _id: string;
  title: string;
  description: string;
  course: string;
  module: string | null;
  order: number;
  passingPercentage: number;
  timeLimitMinutes: number | null;
  maxAttempts: number | null;
  retakeDelayMinutes: number | null;
  randomizeQuestions: boolean;
  randomizeAnswers: boolean;
  showCorrectAnswers: boolean;
  showResults: boolean;
};

export type LmsQuizAttemptSummary = {
  attemptNumber: number;
  submittedAt: string;
  percentage: number;
  passed: boolean;
};

export type LmsQuizForViewer = {
  _id: string;
  title: string;
  description: string;
  passingPercentage: number;
  timeLimitMinutes: number | null;
  maxAttempts: number | null;
  locked: boolean;
  attemptsUsed: number;
  attemptsRemaining: number | null;
  passed: boolean;
  attempts: LmsQuizAttemptSummary[];
};

export type LmsQuizStartQuestion = {
  _id: string;
  text: string;
  type: LmsQuestionType;
  points: number;
  options: { _id: string; text: string }[];
};

export type LmsQuizStartResult = {
  attempt: {
    _id: string;
    attemptNumber: number;
    startedAt: string;
    timeLimitMinutes: number | null;
  };
  questions: LmsQuizStartQuestion[];
};

export type LmsQuizAnswerResult = {
  question: string;
  selectedOptionIds?: string[];
  textAnswer?: string | null;
  isCorrect: boolean;
  pointsAwarded: number;
};

export type LmsQuizSubmitResult = {
  attemptNumber: number;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  expired: boolean;
  showResults: boolean;
  answers: LmsQuizAnswerResult[];
};

export type LmsQuizAttempt = {
  _id: string;
  attemptNumber: number;
  status: "IN_PROGRESS" | "SUBMITTED";
  startedAt: string;
  submittedAt: string | null;
  timeSpentSeconds: number | null;
  score: number | null;
  maxScore: number | null;
  percentage: number | null;
  passed: boolean | null;
};

export type LmsPaginated<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type LmsApiResponse<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; errorCode: string };
