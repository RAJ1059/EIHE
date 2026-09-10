import Image from "next/image";
import Link from "next/link";
import {
  footerAbout,
  footerAddress,
  footerDisclaimer,
  footerNav,
  footerPayment,
  footerSocial,
} from "@/config/site";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { Reveal } from "@/components/motion/Reveal";

const socialIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  LinkedIn: LinkedInIcon,
  WhatsApp: WhatsAppIcon,
  Twitter: TwitterIcon,
};

export function Footer() {
  return (
    <footer className="bg-sage text-white">
      <Reveal className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="text-sm font-semibold text-teal">
              {footerAbout.title}
            </h3>
            <div className="mt-4 space-y-4">
              {footerAbout.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm text-white/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {footerNav.quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-white/10 pt-6">
              <Image
                src={footerPayment.src}
                alt={footerPayment.alt}
                width={191}
                height={191}
                className="h-auto w-[170px]"
              />
              <p className="mt-3 text-xs text-white/60">
                {footerPayment.caption}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal">For Learners</h3>
            <ul className="mt-4 space-y-3">
              {footerNav.forLearners.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold text-white">
                {footerAddress.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {footerAddress.lines.map((line) => (
                  <li key={line} className="text-sm text-white/70">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal">
              Support &amp; Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNav.supportLegal.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block text-sm text-white/70 transition-all duration-300 hover:translate-x-1 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal">
              Contact &amp; Presence
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {footerSocial.map((item) => {
                const Icon = socialIcons[item.label as keyof typeof socialIcons];
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-teal hover:bg-teal hover:text-sage"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-2 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <span>
              &copy; {new Date().getFullYear()} European Institute For
              Healthcare Excellence
            </span>
            <span className="max-w-xl text-right sm:text-right">
              {footerDisclaimer}
            </span>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
