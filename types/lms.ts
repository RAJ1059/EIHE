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
