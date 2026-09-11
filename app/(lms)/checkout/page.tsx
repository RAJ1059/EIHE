"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart, type CartItem } from "@/lib/cart/CartContext";
import { createOrder, verifyPayment } from "@/lib/api/orders";
import { registerRequest } from "@/lib/api/auth";
import { openRazorpayCheckout } from "@/lib/payments/razorpay";
import { ApiError } from "@/lib/api/client";
import { Card } from "@/components/lms/ui/Card";
import { FormButton } from "@/components/lms/ui/FormButton";
import { Input, Label, FieldError } from "@/components/lms/ui/Input";
import type { LmsUser } from "@/types/lms";

export default function CheckoutPage() {
  const { user, accessToken, isLoading } = useAuth();
  const { items } = useCart();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Loading…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-ink">Your cart is empty</h1>
          <p className="mt-2 text-ink/70">Add a course to your cart before checking out.</p>
          <Link href="/courses" className="mt-4 inline-block text-sm font-semibold text-teal hover:underline">
            Browse courses →
          </Link>
        </div>
      </section>
    );
  }

  // No `key` here: a guest's inline registration flips `user` from null to
  // a real object mid-checkout (see handlePlaceOrder), and remounting at
  // that exact moment would wipe the just-typed billing fields and any
  // in-flight payment error right as they need to be shown.
  return <CheckoutForm user={user} accessToken={accessToken} items={items} />;
}

function CheckoutForm({
  user,
  accessToken,
  items,
}: {
  user: LmsUser | null;
  accessToken: string | null;
  items: CartItem[];
}) {
  const router = useRouter();
  const { setSession } = useAuth();
  const { subtotal, clear } = useCart();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");

  // Guests create their account inline instead of being sent to a separate
  // login page — checked by default since an account is how they'll get
  // back into the course after paying.
  const [wantsAccount, setWantsAccount] = useState(true);
  const [password, setPassword] = useState("");

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelled, setCancelled] = useState(false);

  const currency = items[0]?.currency ?? "INR";
  const needsAccount = !user;

  async function handlePlaceOrder() {
    setError(null);
    setCancelled(false);

    if (needsAccount && !wantsAccount) {
      setError("Check the box to create your account, or log in to an existing one, to continue.");
      return;
    }

    setPaying(true);
    try {
      let token = accessToken;

      if (needsAccount) {
        try {
          const result = await registerRequest({ name, email, password });
          setSession(result.user, result.accessToken);
          token = result.accessToken;
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Could not create your account.");
          setPaying(false);
          return;
        }
      }

      const order = await createOrder(token as string, {
        courseIds: items.map((i) => i.courseId),
        billingInfo: { name, email, phone, country, address, city, zip },
      });

      const instance = await openRazorpayCheckout({
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "EIHE",
        description: items.map((i) => i.title).join(", "),
        prefill: { name, email, contact: phone },
        theme: { color: "#2f6f5e" },
        handler: async (response) => {
          try {
            await verifyPayment(token as string, {
              orderId: order.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clear();
            // Straight into the course, not a receipt page — that's what
            // someone who just paid to start learning actually wants.
            router.push(
              items.length === 1 ? `/student/courses/${items[0].slug}` : "/student/courses",
            );
          } catch (err) {
            setError(
              err instanceof ApiError
                ? err.message
                : "We couldn't confirm this payment. If money was deducted, contact support.",
            );
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setCancelled(true);
            setPaying(false);
          },
        },
      });
      instance.on("payment.failed", (response) => {
        setError(`Payment failed: ${response.error.description}`);
        setPaying(false);
      });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start checkout.");
      setPaying(false);
    }
  }

  const missingContactOrBilling =
    !name || !email || !phone || !country || !address || !city || !zip;
  const accountBlocked = needsAccount && (!wantsAccount || password.length < 8);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-sage">Checkout</h1>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {cancelled && !error && (
          <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
            Payment cancelled. Your cart is unchanged — try again whenever you&rsquo;re ready.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <h2 className="font-bold text-ink">Contact Information</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="co-name">Name</Label>
                  <Input id="co-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="co-email">Email</Label>
                  <Input
                    id="co-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="co-phone">Phone</Label>
                  <Input id="co-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
            </Card>

            {needsAccount && (
              <Card>
                <h2 className="font-bold text-ink">Account</h2>
                <label className="mt-3 flex items-start gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    checked={wantsAccount}
                    onChange={(e) => setWantsAccount(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 text-teal focus:ring-teal"
                  />
                  Create an account with this email so I can access my course right after paying
                </label>

                {wantsAccount ? (
                  <div className="mt-3">
                    <Label htmlFor="co-password">Password</Label>
                    <Input
                      id="co-password"
                      type="password"
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <FieldError
                      message={
                        password.length > 0 && password.length < 8
                          ? "Password must be at least 8 characters."
                          : null
                      }
                    />
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-ink/60">
                    Already have an account?{" "}
                    <Link
                      href="/login?next=/checkout"
                      className="font-semibold text-teal hover:underline"
                    >
                      Log in
                    </Link>{" "}
                    to continue instead.
                  </p>
                )}
              </Card>
            )}

            <Card>
              <h2 className="font-bold text-ink">Billing Information</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="co-country">Country</Label>
                  <Input id="co-country" value={country} onChange={(e) => setCountry(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="co-address">Address</Label>
                  <Input id="co-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="co-city">City</Label>
                    <Input id="co-city" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="co-zip">ZIP / Postal Code</Label>
                    <Input id="co-zip" value={zip} onChange={(e) => setZip(e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h2 className="font-bold text-ink">Your Course{items.length > 1 ? "s" : ""}</h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item.courseId} className="flex items-center justify-between text-sm">
                    <span className="text-ink/80">{item.title}</span>
                    <span className="font-semibold text-ink">
                      {item.currency} {item.salePrice ?? item.price}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm">
                <div className="flex justify-between text-ink/70">
                  <span>Subtotal</span>
                  <span>
                    {currency} {subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-ink">
                  <span>Total</span>
                  <span>
                    {currency} {subtotal}
                  </span>
                </div>
              </div>

              <FormButton
                className="mt-6 w-full"
                onClick={handlePlaceOrder}
                loading={paying}
                disabled={missingContactOrBilling || accountBlocked}
              >
                Place Order
              </FormButton>
              <p className="mt-2 text-center text-xs text-ink/50">
                You&rsquo;ll complete payment via Razorpay in a secure popup.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
