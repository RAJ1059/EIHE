"use client";

import { CheckoutContent } from "@/components/lms/checkout/CheckoutContent";

export default function CheckoutPage() {
  return (
    <CheckoutContent variant="public" browseCoursesPath="/courses" loginRedirectPath="/checkout" />
  );
}
