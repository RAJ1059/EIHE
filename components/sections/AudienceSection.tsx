import { Button } from "@/components/ui/Button";
import {
  ClinicIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  ToothIcon,
} from "@/components/ui/icons";
import { audiences } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const audienceIcons = {
  stethoscope: StethoscopeIcon,
  tooth: ToothIcon,
  "heart-pulse": HeartPulseIcon,
  "graduation-cap": GraduationCapIcon,
  clinic: ClinicIcon,
};

export function AudienceSection() {
  return (
    <section className="bg-white" id="paths">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
              Who is EIHE for?
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              Our programs are designed to empower healthcare professionals
              at every stage of their career journey.
            </p>
          </div>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((audience) => {
            const Icon = audienceIcons[audience.icon];
            return (
              <RevealItem
                key={audience.id}
                id={audience.id}
                className="flex flex-col rounded-2xl border border-ink/5 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal/20 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-sage">
                  {audience.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {audience.description}
                </p>
                <Button
                  href={audience.href}
                  withArrow={false}
                  className="mt-auto self-start !rounded-full !bg-sage"
                >
                  {audience.linkLabel}
                </Button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
