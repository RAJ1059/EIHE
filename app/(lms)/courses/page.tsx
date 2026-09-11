"use client";

import { CourseCatalogContent } from "@/components/lms/course/CourseCatalogContent";

export default function CoursesCatalogPage() {
  return (
    <CourseCatalogContent variant="public" coursePath={(slug) => `/courses/${slug}`} />
  );
}
