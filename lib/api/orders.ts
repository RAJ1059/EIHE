import { apiFetch } from "./client";
import type { LmsBillingInfo, LmsCreateOrderResult, LmsOrder } from "@/types/lms";

export function createOrder(
  accessToken: string,
  input: { courseIds: string[]; billingInfo: LmsBillingInfo },
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
