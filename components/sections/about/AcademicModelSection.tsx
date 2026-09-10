import { Button } from "@/components/ui/Button";
import {
  BriefcaseIcon,
  CheckIcon,
  CompassIcon,
  GraduationCapIcon,
  LaptopIcon,
} from "@/components/ui/icons";
import { academicModel } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const modelIcons = {
  compass: CompassIcon,
  "graduation-cap": GraduationCapIcon,
  check: CheckIcon,
  laptop: LaptopIcon,
  briefcase: BriefcaseIcon,
};

export function AcademicModelSection() {
  return (
    <section className="bg-white" id="academic-model">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {academicModel.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            {academicModel.intro}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {academicModel.cards.map((card) => {
            const Icon = modelIcons[card.icon];
            return (
              <RevealItem
                key={card.title}
                className="flex flex-col items-center rounded-2xl border border-ink/5 bg-cream p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {card.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-2xl leading-relaxed text-ink/70">
            {academicModel.conclusion}
          </p>
        </Reveal>

        <Reveal delay={0.28} className="mt-8">
          <Button
            href={academicModel.buttonHref}
            withArrow={false}
            className="!rounded-full !bg-sage"
          >
            {academicModel.buttonLabel}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
