"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !ADMIN_ROLES.includes(user.role))) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || !ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] bg-cream">
      <aside className="w-56 shrink-0 border-r border-ink/10 bg-white px-4 py-8">
        <p className="px-2 text-xs font-semibold tracking-[0.15em] text-ink/40 uppercase">
          Admin
        </p>
        <nav className="mt-4 space-y-1">
          <Link
            href="/admin/dashboard"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-cream"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/courses"
            className="block rounded-lg px-3 py-2 text-sm font-medium text-ink hover:bg-cream"
          >
            Courses
          </Link>
        </nav>
      </aside>
      <div className="flex-1 px-8 py-8">{children}</div>
    </div>
  );
}
