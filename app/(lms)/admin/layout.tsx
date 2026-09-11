"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ADMIN_ROLES, MANAGEMENT_ROLES, homePathForRole } from "@/lib/auth/roles";
import { PortalTopBar } from "@/components/lms/ui/PortalTopBar";
import { PortalSidebarNav } from "@/components/lms/ui/PortalSidebarNav";
import { PortalPageTransition } from "@/components/lms/ui/PortalPageTransition";
import { PageLoader } from "@/components/lms/ui/PageLoader";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/quizzes", label: "Quizzes" },
  { href: "/admin/course-approval", label: "Course Approval", managementOnly: true },
  { href: "/admin/instructors", label: "Instructors", managementOnly: true },
  { href: "/admin/orders", label: "Orders", managementOnly: true },
  { href: "/admin/course-reports", label: "Course Reports", managementOnly: true },
  { href: "/admin/users", label: "Users", managementOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (!ADMIN_ROLES.includes(user.role)) {
      // Logged in, just the wrong portal — send them to their own, not to /login.
      router.replace(homePathForRole(user.role));
    }
  }, [isLoading, user, router]);

  if (isLoading || !user || !ADMIN_ROLES.includes(user.role)) {
    return <PageLoader label="Checking access…" />;
  }

  const isManager = MANAGEMENT_ROLES.includes(user.role);

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <PortalTopBar
        label="Admin Portal"
        userName={user.name}
        onLogout={() => logout().then(() => router.push("/login"))}
      />
      <div className="flex flex-1">
        <aside className="w-56 shrink-0 bg-gradient-to-b from-sage to-[#0f2a43] px-4 py-8">
          <p className="px-2 text-xs font-semibold tracking-[0.15em] text-white/40 uppercase">
            Admin
          </p>
          <PortalSidebarNav
            layoutId="admin-nav-active"
            variant="dark"
            items={NAV_ITEMS.filter((item) => !item.managementOnly || isManager)}
          />
        </aside>
        <div className="flex-1 px-8 py-8">
          <PortalPageTransition>{children}</PortalPageTransition>
        </div>
      </div>
    </div>
  );
}
