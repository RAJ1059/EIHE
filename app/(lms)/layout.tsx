import { AuthProvider } from "@/lib/auth/AuthContext";

// Route group — wraps only the LMS routes (/login, /register, /courses,
// /admin/*) in AuthProvider. Does not touch the shared app/layout.tsx or
// affect URL paths: "(lms)" is stripped from the route.
export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
