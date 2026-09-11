import { apiFetch } from "./client";
import type {
  LmsAdminOrder,
  LmsBillingInfo,
  LmsCreateOrderResult,
  LmsOrder,
  LmsOrderStatus,
  LmsPaginated,
} from "@/types/lms";

export function createOrder(
  accessToken: string,
  input: {
    courseIds: string[];
    billingInfo: LmsBillingInfo;
    couponCode?: string;
    notes?: string;
  },
) {
  return apiFetch<LmsCreateOrderResult>("/orders", {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function verifyPayment(
  accessToken: string,
  input: {
    orderId: string;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
) {
  return apiFetch<LmsOrder>("/orders/verify", {
    method: "POST",
    accessToken,
    body: input,
  });
}

export function getOrder(accessToken: string, id: string) {
  return apiFetch<LmsOrder>(`/orders/${id}`, { accessToken });
}

export function getMyOrders(accessToken: string) {
  return apiFetch<LmsOrder[]>("/orders/my", { accessToken });
}

// --- Admin ---

export function listAllOrdersAdmin(
  accessToken: string,
  query?: { status?: LmsOrderStatus; page?: number; limit?: number },
) {
  const params = new URLSearchParams();
  if (query?.status) params.set("status", query.status);
  if (query?.page) params.set("page", String(query.page));
  if (query?.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return apiFetch<LmsPaginated<LmsAdminOrder>>(`/admin/orders${qs ? `?${qs}` : ""}`, {
    accessToken,
  });
}

export function getAdminOrder(accessToken: string, id: string) {
  return apiFetch<LmsAdminOrder>(`/admin/orders/${id}`, { accessToken });
}
