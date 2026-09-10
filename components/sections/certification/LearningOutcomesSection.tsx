import { CheckIcon } from "@/components/ui/icons";
import { learningOutcomes } from "@/data/certification";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function LearningOutcomesSection() {
  return (
    <section className="relative overflow-hidden bg-sage">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {learningOutcomes.title}
          </h2>
          <p className="mt-3 text-white/70">{learningOutcomes.subtitle}</p>
        </Reveal>

        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {learningOutcomes.items.map((item) => (
            <RevealItem
              key={item}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white">
                <CheckIcon className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium text-white">{item}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-3xl text-sm leading-relaxed text-white/60">
            {learningOutcomes.disclaimer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
