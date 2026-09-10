import { SectionHead } from "@/components/sections/SectionHead";
import { whyItems as defaultWhyItems } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

type WhyItem = { num: string; title: string; description: string };

export function WhySection({
  eyebrow = "Why Dossios",
  title = "A better way to run an immigration case",
  description = "Traditional intake means phone tag, scattered emails, and radio silence between filings. Dossios pairs a dedicated case team with licensed attorneys, so nothing sits untouched and you always know what happens next.",
  items = defaultWhyItems,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: WhyItem[];
}) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <SectionHead eyebrow={eyebrow} title={title} description={description} />
          </Reveal>

          <RevealGroup className="relative space-y-3 before:absolute before:top-2 before:bottom-2 before:left-[27px] before:w-px before:bg-ink/10 before:content-['']">
            {items.map((item) => (
              <RevealItem
                key={item.num}
                className="group relative flex gap-5 rounded-2xl p-3 transition-colors duration-300 hover:bg-white hover:shadow-sm"
              >
                <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-lg font-semibold text-sage shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-teal group-hover:text-white">
                  {item.num}
                </span>
                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 leading-relaxed text-ink/70">
                    {item.description}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
