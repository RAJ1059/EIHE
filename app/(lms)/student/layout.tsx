"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { PortalTopBar } from "@/components/lms/ui/PortalTopBar";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/courses", label: "My Courses" },
  { href: "/student/profile", label: "Profile" },
  { href: "/cart", label: "My Cart" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-ink/60">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <PortalTopBar
        label="Student Portal"
        userName={user.name}
        onLogout={() => logout().then(() => router.push("/login"))}
      />
      <div className="flex flex-1 flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-ink/10 bg-white px-4 py-4 lg:w-56 lg:border-r lg:border-b-0 lg:py-8">
          <p className="hidden px-2 text-xs font-semibold tracking-[0.15em] text-ink/40 uppercase lg:block">
            Student
          </p>
          <nav className="mt-0 flex gap-1 lg:mt-4 lg:flex-col lg:space-y-1">
            {NAV_ITEMS.map((item) => {
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
        <div className="flex-1 px-6 py-8 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
