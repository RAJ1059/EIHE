"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";

export default function CartPage() {
  const { items, removeItem, subtotal } = useCart();

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">My Cart</h1>

        <div className="mt-6 flex gap-4 text-sm font-semibold">
          <Link href="/account" className="text-ink/60 hover:text-teal">
            My Account
          </Link>
          <Link href="/account/courses" className="text-ink/60 hover:text-teal">
            My Courses
          </Link>
          <span className="text-teal">My Cart</span>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-8 text-center">
            <p className="text-ink/70">Your cart is empty.</p>
            <Link
              href="/courses"
              className="mt-4 inline-block text-sm font-semibold text-teal hover:underline"
            >
              Browse courses →
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.courseId}
                className="flex items-center justify-between rounded-2xl border border-ink/10 bg-white p-5"
              >
                <div>
                  <h3 className="font-bold text-sage">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink/60">
                    {item.salePrice != null
                      ? `${item.currency} ${item.salePrice}`
                      : `${item.currency} ${item.price}`}
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.courseId)}
                  className="text-sm font-semibold text-ink/50 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="rounded-2xl border border-ink/10 bg-white p-6">
              <div className="flex items-center justify-between text-base font-bold text-ink">
                <span>Subtotal</span>
                <span>USD {subtotal}</span>
              </div>
              <button
                disabled
                title="Payments (Razorpay) are not built yet in this phase"
                className="mt-4 w-full cursor-not-allowed rounded-full bg-ink/20 px-5 py-3 text-sm font-semibold text-ink/50"
              >
                Checkout — Coming Soon
              </button>
              <p className="mt-2 text-center text-xs text-ink/50">
                Checkout requires the Razorpay payments module, which isn&rsquo;t built
                yet in this phase.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
