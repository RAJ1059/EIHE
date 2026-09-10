import { CheckIcon, InfoIcon } from "@/components/ui/icons";
import { offersVsNot } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function OffersVsNotSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {offersVsNot.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2">
          <RevealItem className="rounded-2xl border border-teal/20 bg-white p-8 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white">
              <CheckIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-sage">
              {offersVsNot.offers.label}
            </h3>
            <div className="mt-4 space-y-3">
              {offersVsNot.offers.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-ink/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </RevealItem>

          <RevealItem className="rounded-2xl border border-peach-ink/20 bg-white p-8 shadow-sm">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-peach text-peach-ink">
              <InfoIcon className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-sage">
              {offersVsNot.doesNot.label}
            </h3>
            <div className="mt-4 space-y-3">
              {offersVsNot.doesNot.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-ink/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
