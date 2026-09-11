"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input } from "@/components/lms/ui/Input";
import { CloseIcon } from "@/components/ui/icons";

type CartContentProps = {
  /** "portal" renders inline inside the Student portal shell (no extra
   * page chrome, no breadcrumb row — the sidebar already covers that
   * navigation). "public" keeps the original standalone-page look. */
  variant: "public" | "portal";
  checkoutPath: string;
  coursePath: (slug: string) => string;
  browseCoursesPath: string;
};

export function CartContent(props: CartContentProps) {
  return (
    <Suspense fallback={null}>
      <CartContentInner {...props} />
    </Suspense>
  );
}

function CartContentInner({ variant, checkoutPath, coursePath, browseCoursesPath }: CartContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    items,
    removeItem,
    subtotal,
    coupon,
    couponError,
    isApplyingCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    total,
  } = useCart();
  const [couponInput, setCouponInput] = useState("");

  const currency = items[0]?.currency ?? "INR";
  const addedId = searchParams.get("added");
  const addedItem = addedId ? items.find((item) => item.courseId === addedId) : null;
  const isPortal = variant === "portal";

  function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
  }

  const body = (
    <div className={isPortal ? "" : "mx-auto max-w-5xl px-6 py-16"}>
      <h1 className="text-3xl font-extrabold tracking-tight text-sage">My Cart</h1>

      {!isPortal && (
        <div className="mt-6 flex gap-4 text-sm font-semibold">
          <Link href="/student/dashboard" className="text-ink/60 hover:text-teal">
            My Dashboard
          </Link>
          <Link href="/student/courses" className="text-ink/60 hover:text-teal">
            My Courses
          </Link>
          <span className="text-teal">My Cart</span>
        </div>
      )}

      {addedItem && (
        <div className="mt-6 flex flex-col gap-3 rounded-lg border-l-4 border-teal bg-teal/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink">
            &ldquo;{addedItem.title}&rdquo; has been added to your cart.
          </p>
          <Link
            href={browseCoursesPath}
            className="inline-flex items-center justify-center rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Continue shopping
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-8 text-center">
          <p className="text-ink/70">Your cart is empty.</p>
          <Link
            href={browseCoursesPath}
            className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
          >
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="text-xl font-bold text-ink">Cart Summary</h2>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-ink/10 bg-white">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="border-b border-ink/10 text-xs font-semibold tracking-wide text-ink/50 uppercase">
                  <tr>
                    <th className="px-4 py-3" />
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {items.map((item) => {
                    const price = item.salePrice ?? item.price;
                    return (
                      <tr key={item.courseId}>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => removeItem(item.courseId)}
                            aria-label={`Remove ${item.title}`}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-ink/40 hover:bg-red-50 hover:text-red-600"
                          >
                            <CloseIcon className="h-3.5 w-3.5" />
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                              {item.featuredImage && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.featuredImage}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>
                            <Link
                              href={coursePath(item.slug)}
                              className="font-medium text-teal hover:underline"
                            >
                              {item.title}
                            </Link>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-ink/70">
                          {item.currency} {price.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 text-ink/70">1</td>
                        <td className="px-4 py-4 font-semibold text-ink">
                          {item.currency} {price.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex flex-col gap-3 border-t border-ink/10 p-4 sm:flex-row sm:items-center">
                <Input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="sm:max-w-xs"
                />
                <FormButton
                  variant="secondary"
                  onClick={handleApplyCoupon}
                  loading={isApplyingCoupon}
                  disabled={!couponInput.trim()}
                >
                  Apply coupon
                </FormButton>
              </div>
            </div>

            {coupon && (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-teal/30 bg-teal/10 px-4 py-2.5 text-sm">
                <span className="text-ink">
                  Coupon <span className="font-semibold">{coupon.code}</span> applied — you save{" "}
                  {currency} {discountAmount.toLocaleString()}
                </span>
                <button
                  onClick={removeCoupon}
                  className="font-semibold text-ink/50 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            )}
            {couponError && <p className="mt-3 text-sm text-red-600">{couponError}</p>}
          </div>

          <div>
            <h2 className="text-xl font-bold text-ink">Cart totals</h2>
            <div className="mt-4 rounded-2xl border border-ink/10 bg-white p-6">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold text-ink">Subtotal</span>
                  <span className="text-ink/80">
                    {currency} {subtotal.toLocaleString()}
                  </span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-teal">
                    <span className="font-semibold">Discount</span>
                    <span>
                      &minus;{currency} {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-bold text-ink">
                  <span>Total</span>
                  <span>
                    {currency} {total.toLocaleString()}
                  </span>
                </div>
              </div>
              <FormButton className="mt-6 w-full" onClick={() => router.push(checkoutPath)}>
                Proceed to checkout
              </FormButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isPortal) return body;
  return <section className="bg-cream">{body}</section>;
}
