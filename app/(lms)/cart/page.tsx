"use client";

import { CartContent } from "@/components/lms/cart/CartContent";

export default function CartPage() {
  return (
    <CartContent
      variant="public"
      checkoutPath="/checkout"
      coursePath={(slug) => `/courses/${slug}`}
      browseCoursesPath="/courses"
    />
  );
}
