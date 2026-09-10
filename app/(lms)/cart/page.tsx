"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, subtotal } = useCart();
  const currency = items[0]?.currency ?? "USD";

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">My Cart</h1>

        <div className="mt-6 flex gap-4 text-sm font-semibold">
          <Link href="/student/dashboard" className="text-ink/60 hover:text-teal">
            My Dashboard
          </Link>
          <Link href="/student/courses" className="text-ink/60 hover:text-teal">
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
                <span>
                  {currency} {subtotal}
                </span>
              </div>
              <button
                onClick={() => router.push("/checkout")}
                className="mt-4 w-full rounded-full bg-sage px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
