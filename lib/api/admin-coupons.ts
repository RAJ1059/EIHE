import { apiFetch } from "./client";
import type { LmsCoupon, LmsCouponDiscountType } from "@/types/lms";

export type CreateCouponInput = {
  code: string;
  discountType: LmsCouponDiscountType;
  discountValue: number;
  maxRedemptions?: number;
  expiresAt?: string;
  minOrderAmount?: number;
};

export function listCoupons(accessToken: string) {
  return apiFetch<LmsCoupon[]>("/admin/coupons", { accessToken });
}

export function createCoupon(accessToken: string, input: CreateCouponInput) {
  return apiFetch<LmsCoupon>("/admin/coupons", { method: "POST", accessToken, body: input });
}

export function setCouponActive(accessToken: string, id: string, isActive: boolean) {
  return apiFetch<LmsCoupon>(`/admin/coupons/${id}/active`, {
    method: "PUT",
    accessToken,
    body: { isActive },
  });
}

export function deleteCoupon(accessToken: string, id: string) {
  return apiFetch<{ deleted: boolean }>(`/admin/coupons/${id}`, {
    method: "DELETE",
    accessToken,
  });
}
