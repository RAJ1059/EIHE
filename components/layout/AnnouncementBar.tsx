import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import { footerSocial } from "@/config/site";

const socialOrder = ["Instagram", "Facebook", "LinkedIn", "Twitter", "WhatsApp"];

const socialIcons = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
  Twitter: TwitterIcon,
  WhatsApp: WhatsAppIcon,
};

const announcement = "Courses for Dentists - Register Now, Last Spots!";

export function AnnouncementBar() {
  const socials = socialOrder
    .map((label) => footerSocial.find((item) => item.label === label))
    .filter((item): item is { label: string; href: string } => Boolean(item));

  return (
    <div className="flex items-center gap-4 bg-teal px-4 py-2 text-white">
      <div className="flex-1 overflow-hidden">
        <div className="flex w-max animate-[marquee-rtl_16s_linear_infinite]">
          <span className="mr-16 shrink-0 text-sm font-medium whitespace-nowrap">
            {announcement}
          </span>
          <span
            aria-hidden="true"
            className="mr-16 shrink-0 text-sm font-medium whitespace-nowrap"
          >
            {announcement}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {socials.map((item) => {
          const Icon = socialIcons[item.label as keyof typeof socialIcons];
          return (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="flex h-6 w-6 items-center justify-center rounded border border-white/50 text-white transition-colors hover:bg-white hover:text-teal"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
