import { Button } from "@/components/ui/Button";
import {
  BriefcaseIcon,
  CheckIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  ToothIcon,
} from "@/components/ui/icons";
import { pathways, pathwaysIntro } from "@/data/programs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const pathwayIcons = {
  stethoscope: StethoscopeIcon,
  tooth: ToothIcon,
  "heart-pulse": HeartPulseIcon,
  briefcase: BriefcaseIcon,
  "graduation-cap": GraduationCapIcon,
};

export function PathwaysSection() {
  return (
    <section className="bg-white" id="pathways">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {pathwaysIntro.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {pathwaysIntro.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            {pathwaysIntro.description}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway) => {
            const Icon = pathwayIcons[pathway.icon];
            return (
              <RevealItem
                key={pathway.id}
                id={pathway.id}
                className="flex flex-col rounded-2xl border border-ink/5 bg-cream p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">
                  {pathway.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {pathway.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {pathway.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-ink/70"
                    >
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink/50">
                  <strong className="font-semibold text-ink/70">
                    Ideal for:
                  </strong>{" "}
                  {pathway.idealFor}
                </p>
                <Button
                  href={pathway.href}
                  withArrow={false}
                  className="mt-6 self-start !rounded-full !bg-sage"
                >
                  Explore Programs
                </Button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
