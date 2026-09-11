"use client";

import { CartContent } from "@/components/lms/cart/CartContent";

export default function StudentCartPage() {
  return (
    <CartContent
      variant="portal"
      checkoutPath="/student/checkout"
      coursePath={(slug) => `/student/courses/browse/${slug}`}
      browseCoursesPath="/student/courses/browse"
    />
  );
}
