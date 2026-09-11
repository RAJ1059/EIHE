"use client";

import { CourseCatalogContent } from "@/components/lms/course/CourseCatalogContent";

export default function StudentBrowseCoursesPage() {
  return (
    <CourseCatalogContent
      variant="portal"
      coursePath={(slug) => `/student/courses/browse/${slug}`}
    />
  );
}
