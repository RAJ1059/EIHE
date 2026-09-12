"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { PortalTopBar } from "@/components/lms/ui/PortalTopBar";
import { PortalSidebarNav } from "@/components/lms/ui/PortalSidebarNav";
import { PortalPageTransition } from "@/components/lms/ui/PortalPageTransition";
import { PageLoader } from "@/components/lms/ui/PageLoader";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/courses/browse", label: "All Courses" },
  { href: "/student/courses", label: "My Courses" },
  { href: "/student/certificates", label: "My Certificates" },
  { href: "/student/profile", label: "Profile" },
  { href: "/student/cart", label: "My Cart" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <ThemeProvider>
        <div className="portal-shell min-h-screen bg-cream">
          <PageLoader label="Checking access…" />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="portal-shell flex min-h-screen flex-col bg-cream">
        <PortalTopBar
          label="Student Portal"
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
              <p className="mt-0.5 text-sm font-semibold text-white">Student Portal</p>
            </div>
            <PortalSidebarNav
              layoutId="student-nav-active"
              variant="dark"
              items={NAV_ITEMS}
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
