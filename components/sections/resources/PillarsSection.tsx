import Link from "next/link";
import { ClockIcon, CompassIcon, CreditCardIcon } from "@/components/ui/icons";
import { pillars, pillarsIntro } from "@/data/resources";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const pillarIcons = {
  compass: CompassIcon,
  clock: ClockIcon,
  "credit-card": CreditCardIcon,
};

export function PillarsSection() {
  return (
    <section className="bg-cream" id="pillars">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {pillarsIntro.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {pillarsIntro.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillarIcons[pillar.icon];
            return (
              <RevealItem
                key={pillar.title}
                className="flex flex-col items-center rounded-2xl border border-ink/5 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {pillar.description}
                </p>
                <Link
                  href={pillar.href}
                  className="mt-4 text-xs font-semibold tracking-[0.2em] text-teal uppercase transition-colors hover:text-sage"
                >
                  Discover →
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
