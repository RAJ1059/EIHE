"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  createCoupon,
  deleteCoupon,
  listCoupons,
  setCouponActive,
} from "@/lib/api/admin-coupons";
import { ApiError } from "@/lib/api/client";
import type { LmsCoupon, LmsCouponDiscountType } from "@/types/lms";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, Select, FieldError } from "@/components/lms/ui/Input";
import { Reveal } from "@/components/motion/Reveal";

export default function AdminCouponsPage() {
  const { accessToken } = useAuth();
  const [coupons, setCoupons] = useState<LmsCoupon[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<LmsCouponDiscountType>("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [maxRedemptions, setMaxRedemptions] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function load() {
    if (!accessToken) return;
    listCoupons(accessToken)
      .then(setCoupons)
      .catch((err) => {
        setCoupons([]);
        setError(err instanceof ApiError ? err.message : "Could not load coupons.");
      });
  }

  useEffect(load, [accessToken]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken) return;
    setFormError(null);
    setIsCreating(true);
    try {
      await createCoupon(accessToken, {
        code,
        discountType,
        discountValue: Number(discountValue),
        maxRedemptions: maxRedemptions ? Number(maxRedemptions) : undefined,
        expiresAt: expiresAt || undefined,
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : undefined,
      });
      setCode("");
      setDiscountValue("");
      setMaxRedemptions("");
      setExpiresAt("");
      setMinOrderAmount("");
      load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not create this coupon.");
    } finally {
      setIsCreating(false);
    }
  }

  async function handleToggleActive(coupon: LmsCoupon) {
    if (!accessToken) return;
    await setCouponActive(accessToken, coupon._id, !coupon.isActive);
    load();
  }

  async function handleDelete(coupon: LmsCoupon) {
    if (!accessToken) return;
    await deleteCoupon(accessToken, coupon._id);
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink">Coupons</h1>
      <p className="mt-1 text-sm text-ink/60">Create and manage discount codes for checkout.</p>

      <Card className="mt-6">
        <h2 className="font-bold text-ink">New Coupon</h2>
        <form onSubmit={handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="cp-code">Code</Label>
            <Input
              id="cp-code"
              required
              placeholder="WELCOME10"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-type">Discount type</Label>
            <Select
              id="cp-type"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as LmsCouponDiscountType)}
            >
              <option value="PERCENT">Percent off</option>
              <option value="FIXED">Fixed amount off</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="cp-value">
              {discountType === "PERCENT" ? "Percent (0-100)" : "Amount"}
            </Label>
            <Input
              id="cp-value"
              type="number"
              min={0}
              max={discountType === "PERCENT" ? 100 : undefined}
              required
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-max">Max redemptions (optional)</Label>
            <Input
              id="cp-max"
              type="number"
              min={1}
              value={maxRedemptions}
              onChange={(e) => setMaxRedemptions(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-expires">Expires on (optional)</Label>
            <Input
              id="cp-expires"
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="cp-min">Minimum order amount (optional)</Label>
            <Input
              id="cp-min"
              type="number"
              min={0}
              value={minOrderAmount}
              onChange={(e) => setMinOrderAmount(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <FieldError message={formError} />
            <FormButton type="submit" loading={isCreating} className="mt-2">
              Create Coupon
            </FormButton>
          </div>
        </form>
      </Card>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <Reveal className="mt-6 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-cream text-xs font-semibold tracking-wide text-ink/60 uppercase">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {coupons === null &&
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-4 py-4" colSpan={6}>
                    <div className="h-4 animate-pulse rounded bg-cream" />
                  </td>
                </tr>
              ))}

            {coupons?.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={6}>
                  No coupons yet. Create your first one above.
                </td>
              </tr>
            )}

            {coupons?.map((coupon) => (
              <tr key={coupon._id} className="transition-colors hover:bg-cream/60">
                <td className="px-4 py-3 font-mono font-semibold text-ink">{coupon.code}</td>
                <td className="px-4 py-3 text-ink/70">
                  {coupon.discountType === "PERCENT"
                    ? `${coupon.discountValue}%`
                    : coupon.discountValue}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {coupon.timesRedeemed}
                  {coupon.maxRedemptions ? ` / ${coupon.maxRedemptions}` : ""}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      coupon.isActive ? "bg-teal/15 text-teal" : "bg-ink/10 text-ink/60"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleToggleActive(coupon)}
                    className="mr-4 text-sm font-semibold text-teal hover:underline"
                  >
                    {coupon.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDelete(coupon)}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
