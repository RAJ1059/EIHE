"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "INSTRUCTOR"];
const MANAGEMENT_ROLES = ["SUPER_ADMIN", "ADMIN"];

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/course-approval", label: "Course Approval", managementOnly: true },
  { href: "/admin/users", label: "Users", managementOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  const isManager = MANAGEMENT_ROLES.includes(user.role);

  return (
    <div className="flex min-h-[80vh] bg-cream">
      <aside className="w-56 shrink-0 border-r border-ink/10 bg-white px-4 py-8">
        <p className="px-2 text-xs font-semibold tracking-[0.15em] text-ink/40 uppercase">
          Admin
        </p>
        <nav className="mt-4 space-y-1">
          {NAV_ITEMS.filter((item) => !item.managementOnly || isManager).map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-sage/10 text-sage" : "text-ink hover:bg-cream"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 px-8 py-8">{children}</div>
    </div>
  );
}
