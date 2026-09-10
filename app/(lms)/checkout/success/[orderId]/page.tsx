"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { getOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import type { LmsOrder } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const { user, accessToken, isLoading } = useAuth();
  const [order, setOrder] = useState<LmsOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!accessToken) return;
    getOrder(accessToken, params.orderId)
      .then(setOrder)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : "Could not load this order.");
      });
  }, [accessToken, params.orderId]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Loading…</p>
      </div>
    );
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-2xl px-6 py-16">
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!order && !error && <div className="h-64 animate-pulse rounded-2xl bg-white" />}

        {order && (
          <Card className="text-center">
            {order.status === "PAID" ? (
              <>
                <span className="inline-flex items-center rounded-full bg-teal/15 px-4 py-1.5 text-sm font-bold text-teal">
                  ✓ Payment Successful
                </span>
                <h1 className="mt-4 text-2xl font-bold text-ink">Thanks, {order.billingInfo.name}!</h1>
                <p className="mt-2 text-sm text-ink/60">
                  Order #{order._id.slice(-8).toUpperCase()} &middot;{" "}
                  {order.paidAt && new Date(order.paidAt).toLocaleString()}
                </p>
              </>
            ) : (
              <>
                <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-1.5 text-sm font-bold text-amber-800">
                  {order.status}
                </span>
                <h1 className="mt-4 text-2xl font-bold text-ink">This order isn&rsquo;t paid yet</h1>
              </>
            )}

            <ul className="mt-6 space-y-2 border-t border-ink/10 pt-6 text-left">
              {order.items.map((item) => (
                <li key={item.course} className="flex items-center justify-between text-sm">
                  <span className="text-ink/80">{item.title}</span>
                  <span className="font-semibold text-ink">
                    {order.currency} {item.price}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3 text-base font-bold text-ink">
              <span>Total Paid</span>
              <span>
                {order.currency} {order.total}
              </span>
            </div>

            {order.status === "PAID" && (
              <Link
                href="/student/courses"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-sage px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Go to My Courses →
              </Link>
            )}
          </Card>
        )}
      </div>
    </section>
  );
}
