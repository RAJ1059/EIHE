import { InstagramIcon, LinkedInIcon } from "@/components/ui/icons";

export function SocialLinks({
  linkedin,
  instagram,
}: {
  linkedin?: string;
  instagram?: string;
}) {
  if (!linkedin && !instagram) return null;

  return (
    <div className="flex items-center gap-2">
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sage/20 text-sage transition-colors hover:bg-sage hover:text-white"
        >
          <LinkedInIcon className="h-4 w-4" />
        </a>
      )}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sage/20 text-sage transition-colors hover:bg-sage hover:text-white"
        >
          <InstagramIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
