import { AuthProvider } from "@/lib/auth/AuthContext";
import { CartProvider } from "@/lib/cart/CartContext";

// Route group — wraps only the LMS routes (/login, /register, /courses,
// /student/*, /cart, /admin/*) in AuthProvider + CartProvider. Does not touch
// the shared app/layout.tsx or affect URL paths: "(lms)" is stripped from
// the route.
export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>{children}</CartProvider>
    </AuthProvider>
  );
}
