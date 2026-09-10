import {
  ClinicIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  ToothIcon,
} from "@/components/ui/icons";
import { whoWeWorkWith } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const groupIcons = {
  stethoscope: StethoscopeIcon,
  "heart-pulse": HeartPulseIcon,
  tooth: ToothIcon,
  "graduation-cap": GraduationCapIcon,
  clinic: ClinicIcon,
};

export function WhoWeWorkWithSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {whoWeWorkWith.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {whoWeWorkWith.groups.map((group) => {
            const Icon = groupIcons[group.icon];
            return (
              <RevealItem
                key={group.title}
                className="flex flex-col items-center rounded-2xl border border-ink/5 bg-cream p-6 text-center shadow-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-sm font-bold text-ink">
                  {group.title}
                </h3>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-2xl leading-relaxed text-ink/70">
            {whoWeWorkWith.footerBefore}
            <strong className="font-bold text-ink">
              {whoWeWorkWith.footerBold1}
            </strong>
            {whoWeWorkWith.footerMiddle}
            <strong className="font-bold text-ink">
              {whoWeWorkWith.footerBold2}
            </strong>
            {whoWeWorkWith.footerAfter}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
