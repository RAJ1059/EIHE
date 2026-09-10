import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { footerSocial } from "@/config/site";
import { community } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const instagramHref =
  footerSocial.find((item) => item.label === "Instagram")?.href ?? "#";
const linkedinHref =
  footerSocial.find((item) => item.label === "LinkedIn")?.href ?? "#";

export function CommunitySection() {
  return (
    <section className="bg-cream" id="community">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {community.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            {community.description}
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <RevealItem>
            <div className="flex h-full flex-col rounded-2xl border border-ink/5 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/Logo.png"
                  alt="EIHE"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-semibold text-ink">
                  @{community.instagram.handle}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                {community.instagram.bio}
              </p>
              <div className="mt-4 flex gap-6 border-t border-ink/10 pt-4 text-sm">
                <span>
                  <strong className="text-ink">
                    {community.instagram.posts}
                  </strong>{" "}
                  <span className="text-ink/60">posts</span>
                </span>
                <span>
                  <strong className="text-ink">
                    {community.instagram.followers}
                  </strong>{" "}
                  <span className="text-ink/60">followers</span>
                </span>
                <span>
                  <strong className="text-ink">
                    {community.instagram.following}
                  </strong>{" "}
                  <span className="text-ink/60">following</span>
                </span>
              </div>
              <Button
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                withArrow={false}
                className="mt-6 self-start !rounded-full !bg-teal"
              >
                Follow on Instagram
              </Button>
            </div>
          </RevealItem>

          <RevealItem>
            <div className="flex h-full flex-col rounded-2xl border border-ink/5 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/Logo.png"
                  alt="EIHE"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
                <span className="font-semibold text-ink">
                  {community.linkedin.name}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                {community.linkedin.tagline}
              </p>
              <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 text-sm text-ink/60">
                <p>{community.linkedin.industry}</p>
                <p>
                  {community.linkedin.followers} &middot;{" "}
                  {community.linkedin.size}
                </p>
              </div>
              <Button
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                withArrow={false}
                className="mt-6 self-start !rounded-full !bg-sage"
              >
                Join our LinkedIn page
              </Button>
            </div>
          </RevealItem>
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mt-10 text-sm leading-relaxed text-ink/60">
            Trusted by healthcare professionals and educators across Europe
            and beyond.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
