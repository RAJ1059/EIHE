import { Button } from "@/components/ui/Button";
import {
  BriefcaseIcon,
  GraduationCapIcon,
  PersonIcon,
  StethoscopeIcon,
  ToothIcon,
} from "@/components/ui/icons";
import { programsCards, programsFootnote } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const programIcons = {
  stethoscope: StethoscopeIcon,
  person: PersonIcon,
  tooth: ToothIcon,
  briefcase: BriefcaseIcon,
  "graduation-cap": GraduationCapIcon,
};

export function ProgramsSection() {
  return (
    <section className="bg-white" id="programs">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
              Our Programs and Certifications
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              European-aligned education pathways for every stage of your
              healthcare career.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {programsCards.map((card) => {
            const Icon = programIcons[card.icon];
            return (
              <RevealItem
                key={card.id}
                id={card.id}
                className="flex flex-col items-center rounded-2xl border border-sage/15 bg-white p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal/30 hover:shadow-xl"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sage text-white">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {card.description}
                </p>
                <Button
                  href={card.href}
                  withArrow={false}
                  className="mt-auto !rounded-full !bg-sage"
                >
                  Know more
                </Button>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mt-12 text-center text-sm leading-relaxed text-ink/60">
            {programsFootnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
