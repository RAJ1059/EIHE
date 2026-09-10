import { SectionHead } from "@/components/sections/SectionHead";
import { processSteps as defaultProcessSteps } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

type ProcessStep = { num: string; title: string; description: string };

export function ProcessSection({
  id = "how-it-works",
  eyebrow = "How It Works",
  title = "How your case moves forward",
  description = "Every Dossios case follows the same attorney-reviewed process — so nothing gets filed without a licensed lawyer's judgment behind it.",
  steps = defaultProcessSteps,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  steps?: ProcessStep[];
}) {
  return (
    <section className="bg-white" id={id}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <SectionHead
            align="center"
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
        </Reveal>

        <RevealGroup className="relative mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          <div
            aria-hidden="true"
            className="absolute top-5 right-[10%] left-[10%] hidden border-t border-dashed border-ink/15 lg:block"
          />
          {steps.map((step) => (
            <RevealItem key={step.num} className="group relative">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-cream text-sm font-semibold text-sage shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-teal group-hover:text-white">
                {step.num}
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                {step.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
