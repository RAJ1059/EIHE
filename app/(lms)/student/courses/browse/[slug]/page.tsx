"use client";

import { useParams } from "next/navigation";
import { CourseDetailContent } from "@/components/lms/course/CourseDetailContent";

export default function StudentCourseDetailPage() {
  const params = useParams<{ slug: string }>();
  return (
    <CourseDetailContent
      slug={params.slug}
      variant="portal"
      cartPath="/student/cart"
      checkoutPath="/student/checkout"
      loginPath="/login"
      registerPath="/register"
    />
  );
}
