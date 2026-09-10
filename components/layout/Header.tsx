import Image from "next/image";
import Link from "next/link";
import { mainNav, siteConfig } from "@/config/site";
import { CartIcon, ChevronDownIcon, SearchIcon } from "@/components/ui/icons";
import { MobileNav } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:gap-6 sm:px-6 sm:py-5 lg:px-10">
        <Link href="/" className="group flex items-center gap-2">
          <Image
            src={siteConfig.logo}
            alt="European Institute For Healthcare Excellence logo"
            width={40}
            height={40}
            className="h-9 w-9 transition-transform duration-300 group-hover:scale-110 sm:h-11 sm:w-11"
          />
          <span className="max-w-[170px] text-sm font-semibold leading-tight text-sage sm:max-w-[240px] sm:text-base">
            European Institute For Healthcare Excellence
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {mainNav.map((item, index) => (
            <div key={item.label} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  index === 0 ? "text-teal" : "text-ink group-hover:text-teal"
                }`}
              >
                {item.label}
                {item.children && (
                  <ChevronDownIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                )}
              </Link>

              {item.children && (
                <div className="invisible absolute left-0 top-full z-40 min-w-[240px] translate-y-1 rounded-xl border border-ink/10 bg-white p-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className="block rounded-lg px-3 py-2 text-sm text-ink transition-colors hover:bg-lime hover:text-sage"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-lime hover:text-sage"
          >
            <CartIcon className="h-5 w-5" />
          </Link>
          <button
            type="button"
            aria-label="Open search"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-lime hover:text-sage"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
