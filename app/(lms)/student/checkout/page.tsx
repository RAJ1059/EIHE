"use client";

import { CheckoutContent } from "@/components/lms/checkout/CheckoutContent";

export default function StudentCheckoutPage() {
  return (
    <CheckoutContent
      variant="portal"
      browseCoursesPath="/student/courses/browse"
      loginRedirectPath="/student/checkout"
    />
  );
}
