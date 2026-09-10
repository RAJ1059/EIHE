import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export function PortalTopBar({
  label,
  userName,
  onLogout,
}: {
  label: string;
  userName: string;
  onLogout: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <Image src={siteConfig.logo} alt="EIHE logo" width={32} height={32} className="h-8 w-8" />
        <span className="text-sm font-semibold text-sage">{label}</span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-ink/70">{userName}</span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-ink/15 px-4 py-1.5 text-sm font-semibold text-ink hover:border-ink/30"
        >
          Log Out
        </button>
      </div>
    </header>
  );
}
