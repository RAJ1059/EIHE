"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { ADMIN_ROLES, MANAGEMENT_ROLES, homePathForRole } from "@/lib/auth/roles";
import { PortalTopBar } from "@/components/lms/ui/PortalTopBar";
import { PortalSidebarNav } from "@/components/lms/ui/PortalSidebarNav";
import { PortalPageTransition } from "@/components/lms/ui/PortalPageTransition";
import { PageLoader } from "@/components/lms/ui/PageLoader";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/lessons", label: "Lessons" },
  { href: "/admin/quizzes", label: "Quizzes" },
  { href: "/admin/course-approval", label: "Course Approval", managementOnly: true },
  { href: "/admin/instructors", label: "Instructors", managementOnly: true },
  { href: "/admin/orders", label: "Orders", managementOnly: true },
  { href: "/admin/coupons", label: "Coupons", managementOnly: true },
  { href: "/admin/course-reports", label: "Course Reports", managementOnly: true },
  { href: "/admin/users", label: "Users", managementOnly: true },
  { href: "/admin/forms", label: "Forms", managementOnly: true },
  { href: "/admin/certificates", label: "Certificates", managementOnly: true },
  { href: "/admin/settings", label: "Site Settings", managementOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
    return (
      <ThemeProvider>
        <div className="portal-shell min-h-screen bg-cream">
          <PageLoader label="Checking access…" />
        </div>
      </ThemeProvider>
    );
  }

  const isManager = MANAGEMENT_ROLES.includes(user.role);

  return (
    <ThemeProvider>
      <div className="portal-shell flex min-h-screen flex-col bg-cream">
        <PortalTopBar
          label="Admin Portal"
          userName={user.name}
          onLogout={() => logout().then(() => router.push("/login"))}
          onMenuClick={() => setMobileNavOpen((v) => !v)}
        />
        <div className="relative flex flex-1">
          {mobileNavOpen && (
            <div
              className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
          )}
          <aside
            onClick={() => setMobileNavOpen(false)}
            className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto bg-gradient-to-b from-sage to-[#040f31] px-4 py-8 transition-transform duration-300 lg:static lg:z-auto lg:w-56 lg:translate-x-0 ${
              mobileNavOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="rounded-xl bg-white/10 px-3 py-2.5">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                Workspace
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">
                {isManager ? "Admin Portal" : "Instructor Portal"}
              </p>
            </div>
            <PortalSidebarNav
              layoutId="admin-nav-active"
              variant="dark"
              items={NAV_ITEMS.filter((item) => !item.managementOnly || isManager)}
              className="mt-4 space-y-1"
            />
          </aside>
          <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <PortalPageTransition>{children}</PortalPageTransition>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
