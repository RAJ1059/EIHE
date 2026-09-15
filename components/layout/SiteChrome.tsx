"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { CookieConsent } from "@/components/layout/CookieConsent";

// The Admin and Student portals are full-screen apps with their own
// layout/nav — no marketing header, announcement bar, or footer around them.
const FULL_SCREEN_PREFIXES = ["/admin", "/student"];

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`),
  );

  if (isFullScreen) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
