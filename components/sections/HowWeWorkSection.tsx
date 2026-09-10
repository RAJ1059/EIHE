import { SectionHead } from "@/components/sections/SectionHead";
import { CheckIcon } from "@/components/ui/icons";
import { howWeWorkPoints } from "@/data/attorneys";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function HowWeWorkSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <SectionHead
              eyebrow="How We Work"
              title="The structure behind every case"
              description="Dossios pairs independent licensed counsel with a dedicated case-support team, so legal judgment always sits with an attorney — and nothing else slows your case down."
            />
          </Reveal>

          <RevealGroup className="space-y-4">
            {howWeWorkPoints.map((point) => (
              <RevealItem
                key={point.title}
                className="group flex gap-4 rounded-2xl border border-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-teal/20 hover:shadow-md"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-sage transition-all duration-300 group-hover:scale-110 group-hover:bg-teal group-hover:text-white">
                  <CheckIcon className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{point.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-ink/70">
                    {point.description}
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
