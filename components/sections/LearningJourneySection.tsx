import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  CalendarIcon,
  ChevronRightIcon,
  CreditCardIcon,
  PersonIcon,
} from "@/components/ui/icons";
import { learningJourneyFootnote, learningJourneySteps } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const journeyIcons = {
  person: PersonIcon,
  calendar: CalendarIcon,
  "chevron-right": ChevronRightIcon,
  "credit-card": CreditCardIcon,
};

export function LearningJourneySection() {
  return (
    <section className="relative overflow-hidden bg-sage" id="learning-journey">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your Learning Journey with EIHE
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
          <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-full bg-teal/20 blur-2xl"
            />
            <Image
              src="/images/journey-photo.png"
              alt="Healthcare professional reviewing a European Certificate on the EIHE learning platform"
              width={820}
              height={820}
              className="relative h-auto w-full"
            />
          </Reveal>

          <RevealGroup className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {learningJourneySteps.map((step, index) => {
              const Icon = journeyIcons[step.icon];
              return (
                <RevealItem key={step.num} className="relative">
                  {index < learningJourneySteps.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="absolute top-6 left-[calc(100%-0.5rem)] hidden h-px w-[calc(2rem)] bg-white/20 lg:block"
                    />
                  )}
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-white">
                    {step.num} {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {step.description}
                  </p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <Reveal delay={0.2}>
          <p className="mt-14 text-center text-sm leading-relaxed text-white/70">
            {learningJourneyFootnote}
          </p>
        </Reveal>

        <Reveal delay={0.28} className="mt-6 flex justify-center">
          <Button href="/programs" withArrow={false} className="!bg-teal">
            Explore programs
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
