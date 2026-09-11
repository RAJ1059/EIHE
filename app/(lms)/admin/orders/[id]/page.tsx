"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getAdminOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminOrder, LmsOrderStatus } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";

const STATUS_STYLES: Record<LmsOrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-teal/15 text-teal",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-ink/10 text-ink/60",
  REFUNDED: "bg-purple-100 text-purple-700",
};

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { accessToken } = useAuth();
  const [order, setOrder] = useState<LmsAdminOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    getAdminOrder(accessToken, params.id)
      .then((result) => {
        if (!cancelled) setOrder(result);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "Could not load this order.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, params.id]);

  return (
    <div>
      <Link href="/admin/orders" className="text-sm font-semibold text-teal hover:underline">
        ← All orders
      </Link>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      {!order && !error && <div className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />}

      {order && (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-ink">
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
              >
                {order.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink/60">
              Placed {new Date(order.createdAt).toLocaleString()}
              {order.paidAt && ` · Paid ${new Date(order.paidAt).toLocaleString()}`}
            </p>

            <ul className="mt-6 space-y-2 border-t border-ink/10 pt-6">
              {order.items.map((item) => (
                <li key={item.course} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{item.title}</span>
                  <span className="font-semibold text-ink">
                    {order.currency} {item.price}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-ink/10 pt-3 text-sm">
              <div className="flex items-center justify-between text-ink/70">
                <span>Subtotal</span>
                <span>
                  {order.currency} {order.subtotal}
                </span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex items-center justify-between text-teal">
                  <span>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                  <span>
                    &minus;{order.currency} {order.discountAmount}
                  </span>
                </div>
              )}
              {order.taxAmount > 0 && (
                <div className="flex items-center justify-between text-ink/70">
                  <span>Tax ({order.taxPercent}%)</span>
                  <span>
                    {order.currency} {order.taxAmount}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-base font-bold text-ink">
                <span>Total</span>
                <span>
                  {order.currency} {order.total}
                </span>
              </div>
            </div>

            {order.failureReason && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Failure reason: {order.failureReason}
              </p>
            )}
          </Card>

          <div className="space-y-6">
            <Card>
              <h2 className="text-sm font-semibold tracking-wide text-ink/60 uppercase">Buyer</h2>
              <p className="mt-2 font-medium text-ink">{order.user.name}</p>
              <p className="text-sm text-ink/60">{order.user.email}</p>
            </Card>

            <Card>
              <h2 className="text-sm font-semibold tracking-wide text-ink/60 uppercase">
                Billing Info
              </h2>
              <div className="mt-2 space-y-1 text-sm text-ink/80">
                <p>{order.billingInfo.name}</p>
                <p>{order.billingInfo.email}</p>
                <p>{order.billingInfo.phone}</p>
                <p>
                  {order.billingInfo.address}, {order.billingInfo.city}
                </p>
                <p>
                  {order.billingInfo.country} {order.billingInfo.zip}
                </p>
              </div>
            </Card>

            {order.razorpayOrderId && (
              <Card>
                <h2 className="text-sm font-semibold tracking-wide text-ink/60 uppercase">
                  Payment Reference
                </h2>
                <p className="mt-2 truncate text-xs text-ink/60">
                  Razorpay order: {order.razorpayOrderId}
                </p>
                {order.razorpayPaymentId && (
                  <p className="mt-1 truncate text-xs text-ink/60">
                    Payment: {order.razorpayPaymentId}
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
