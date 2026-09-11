import { apiFetch } from "./client";
import type { LmsCouponValidation } from "@/types/lms";

export function validateCoupon(code: string, subtotal: number) {
  return apiFetch<LmsCouponValidation>("/coupons/validate", {
    method: "POST",
    body: { code, subtotal },
  });
}
