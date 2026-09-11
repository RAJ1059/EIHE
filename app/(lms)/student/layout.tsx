"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { PortalTopBar } from "@/components/lms/ui/PortalTopBar";
import { PortalSidebarNav } from "@/components/lms/ui/PortalSidebarNav";
import { PortalPageTransition } from "@/components/lms/ui/PortalPageTransition";
import { PageLoader } from "@/components/lms/ui/PageLoader";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

const NAV_ITEMS = [
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/courses", label: "All Courses" },
  { href: "/student/courses", label: "My Courses" },
  { href: "/student/profile", label: "Profile" },
  { href: "/cart", label: "My Cart" },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

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
        />
        <div className="flex flex-1 flex-col lg:flex-row">
          <aside className="w-full shrink-0 bg-gradient-to-b from-sage to-[#0f2a43] px-4 py-4 lg:w-56 lg:py-8">
            <div className="hidden rounded-xl bg-white/10 px-3 py-2.5 lg:block">
              <p className="text-[10px] font-semibold tracking-[0.15em] text-white/50 uppercase">
                Workspace
              </p>
              <p className="mt-0.5 text-sm font-semibold text-white">Student Portal</p>
            </div>
            <PortalSidebarNav
              layoutId="student-nav-active"
              variant="dark"
              items={NAV_ITEMS}
              className="mt-0 flex gap-1 lg:mt-4 lg:flex-col lg:space-y-1"
            />
          </aside>
          <div className="flex-1 px-6 py-8 lg:px-8">
            <PortalPageTransition>{children}</PortalPageTransition>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
