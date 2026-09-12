"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { listAllOrdersAdmin } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import type { LmsAdminOrder, LmsOrderStatus } from "@/types/lms";
import { Select } from "@/components/lms/ui/Input";
import { Reveal } from "@/components/motion/Reveal";

const STATUS_STYLES: Record<LmsOrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-teal/15 text-teal",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-ink/10 text-ink/60",
  REFUNDED: "bg-purple-100 text-purple-700",
};

export default function AdminOrdersPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<LmsAdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LmsOrderStatus | "">("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;

    listAllOrdersAdmin(accessToken, { status: status || undefined, page, limit: 20 })
      .then((result) => {
        if (cancelled) return;
        setOrders(result.items);
        setTotalPages(result.pagination.totalPages);
      })
      .catch((err) => {
        if (cancelled) return;
        setOrders([]);
        setError(err instanceof ApiError ? err.message : "Could not load orders.");
      });

    return () => {
      cancelled = true;
    };
  }, [accessToken, status, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Orders</h1>
      <p className="mt-1 text-sm text-ink/60">Every purchase, newest first.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as LmsOrderStatus | "");
            setPage(1);
          }}
          className="max-w-40"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </Select>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {orders === null &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={6}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {orders?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={6}>
                  No orders found.
                </td>
              </tr>
            )}

            {orders?.map((order) => (
              <tr key={order._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">
                    {order.user?.name ?? order.billingInfo.name}
                  </p>
                  <p className="text-xs text-ink/50">
                    {order.user?.email ?? order.billingInfo.email}
                    {!order.user && " (account deleted)"}
                  </p>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {order.items.length} course{order.items.length === 1 ? "" : "s"}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {order.currency} {order.total}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="text-sm font-semibold text-teal hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full border border-ink/10 px-3 py-1 font-semibold text-ink disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-ink/60">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-full border border-ink/10 px-3 py-1 font-semibold text-ink disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
