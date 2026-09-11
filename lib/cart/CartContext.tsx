"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { validateCoupon } from "@/lib/api/coupons";
import { ApiError } from "@/lib/api/client";
import type { LmsCouponValidation } from "@/types/lms";

// Pre-checkout cart, backed by localStorage — deliberately client-side only
// since it holds no server truth (price/ownership are re-validated by the
// backend when the real Order is created at checkout).

export type CartItem = {
  courseId: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number | null;
  currency: string;
  featuredImage: string | null;
};

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (courseId: string) => void;
  clear: () => void;
  subtotal: number;
  coupon: LmsCouponValidation | null;
  couponError: string | null;
  isApplyingCoupon: boolean;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => void;
  discountAmount: number;
  total: number;
};

const STORAGE_KEY = "eihe_cart";
const CartContext = createContext<CartState | null>(null);

function readStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Deliberate post-mount read: localStorage isn't available during SSR,
    // and reading it synchronously in render would cause a hydration
    // mismatch between the server-rendered empty cart and the client's
    // actual stored cart. Rendering empty-then-populated on mount is the
    // correct pattern here, not a state-sync-with-effect anti-pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (private mode, etc.) — cart just won't persist.
    }
  }, [items, hydrated]);

  // A coupon's discount is only valid for the subtotal it was checked
  // against, so any change to the cart contents invalidates it rather than
  // silently carrying a stale discount forward.
  const [coupon, setCoupon] = useState<LmsCouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.courseId === item.courseId) ? prev : [...prev, item]));
    setCoupon(null);
    setCouponError(null);
  }, []);

  const removeItem = useCallback((courseId: string) => {
    setItems((prev) => prev.filter((i) => i.courseId !== courseId));
    setCoupon(null);
    setCouponError(null);
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    setCoupon(null);
    setCouponError(null);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + (item.salePrice ?? item.price), 0),
    [items],
  );

  const applyCoupon = useCallback(
    async (code: string) => {
      setCouponError(null);
      setIsApplyingCoupon(true);
      try {
        const result = await validateCoupon(code, subtotal);
        setCoupon(result);
      } catch (err) {
        setCoupon(null);
        setCouponError(err instanceof ApiError ? err.message : "Could not apply this coupon.");
      } finally {
        setIsApplyingCoupon(false);
      }
    },
    [subtotal],
  );

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    setCouponError(null);
  }, []);

  const discountAmount = coupon?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discountAmount);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clear,
      subtotal,
      coupon,
      couponError,
      isApplyingCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount,
      total,
    }),
    [
      items,
      addItem,
      removeItem,
      clear,
      subtotal,
      coupon,
      couponError,
      isApplyingCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount,
      total,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
