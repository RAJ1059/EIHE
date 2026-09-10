import {
  ClinicIcon,
  LaptopIcon,
  LightbulbIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { whyLearnItems } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const whyLearnIcons = {
  laptop: LaptopIcon,
  shield: ShieldIcon,
  lightbulb: LightbulbIcon,
  clinic: ClinicIcon,
};

export function WhyLearnSection() {
  return (
    <section className="bg-cream" id="why-eihe">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-sage sm:text-4xl">
            Why Learn With EIHE?
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyLearnItems.map((item) => {
            const Icon = whyLearnIcons[item.icon];
            return (
              <RevealItem
                key={item.title}
                className="rounded-2xl border border-ink/5 bg-white p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-base font-bold text-sage">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {item.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
