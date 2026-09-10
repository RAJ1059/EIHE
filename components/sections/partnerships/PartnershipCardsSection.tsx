import { Button } from "@/components/ui/Button";
import {
  BriefcaseIcon,
  CheckIcon,
  ClinicIcon,
  CompassIcon,
  GraduationCapIcon,
} from "@/components/ui/icons";
import { partnershipCards } from "@/data/partnerships";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const cardIcons = {
  compass: CompassIcon,
  clinic: ClinicIcon,
  "graduation-cap": GraduationCapIcon,
  briefcase: BriefcaseIcon,
};

export function PartnershipCardsSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <RevealGroup className="grid gap-6 lg:grid-cols-2">
          {partnershipCards.map((card) => {
            const Icon = cardIcons[card.icon];
            return (
              <RevealItem
                key={card.title}
                id={card.id}
                className="scroll-mt-24 flex flex-col rounded-2xl border border-ink/5 bg-white p-8 shadow-sm"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-xl font-bold text-sage">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {card.intro}
                </p>
                <ul className="mt-4 space-y-2">
                  {card.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-ink/70"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-ink/60 italic">
                  {card.footer}
                </p>
                <Button
                  href={card.buttonHref}
                  withArrow={false}
                  className="mt-6 self-start !rounded-full !bg-sage"
                >
                  {card.buttonLabel}
                </Button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
