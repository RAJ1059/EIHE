import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { ShieldIcon, StarIcon } from "@/components/ui/icons";
import { values } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dossios has led immigration cases for individuals, families, and employers for over 26 years, backed by a secure, transparent case platform.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Dossios"
        title="Guided by law, driven by people."
        description="For over 26 years, our attorneys have walked with individuals, families, and employers through every stage of the immigration process — with the same care as day one."
      />

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-lime transition-transform duration-500 ease-out hover:-translate-y-1">
            <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
              <div className="flex gap-0.5 text-sage">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
              <span className="text-xs font-semibold text-ink">
                4.8/5 &middot; 208 Google reviews
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-sage uppercase">
              <span className="h-px w-8 bg-sage" aria-hidden="true" />
              Our Story
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">
              A Bay Area practice built on trust.
            </h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              Dossios began as a small immigration practice serving Bay Area
              families and has grown alongside the communities it works
              with. Today, licensed attorneys still lead every case
              personally — supported by a secure platform that keeps
              clients informed at every step, rather than left waiting for
              updates.
            </p>
            <p className="mt-4 leading-relaxed text-ink/80">
              Whether it&rsquo;s an individual petition, a family-based case,
              or an employer sponsoring critical talent, our approach stays
              the same: clear strategy, honest communication, and
              attentive advocacy from filing to decision.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-lime px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5">
              <ShieldIcon className="h-6 w-6 shrink-0 text-sage" />
              <p className="text-sm font-medium text-ink">
                Every case is led by a licensed, bar-admitted attorney.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <div className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                <span className="h-px w-8 bg-sage" aria-hidden="true" />
                What We Stand For
                <span className="h-px w-8 bg-sage" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-3xl font-semibold text-ink sm:text-4xl">
                Our values
              </h2>
            </div>
          </Reveal>

          <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, description }) => (
              <RevealItem
                key={title}
                className="rounded-2xl bg-cream p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {description}
                </p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection
        title="Ready to start your case?"
        description="Tell us about your situation and a licensed attorney will personally review it — not a call center script."
      />
    </>
  );
}
