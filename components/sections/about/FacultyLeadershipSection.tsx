import { Button } from "@/components/ui/Button";
import { GraduationCapIcon, ShieldIcon, StethoscopeIcon } from "@/components/ui/icons";
import { facultyLeadership } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const criteriaIcons = {
  stethoscope: StethoscopeIcon,
  "graduation-cap": GraduationCapIcon,
  shield: ShieldIcon,
};

export function FacultyLeadershipSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {facultyLeadership.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            {facultyLeadership.subtitle}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-3">
          {facultyLeadership.criteria.map((item) => {
            const Icon = criteriaIcons[item.icon];
            return (
              <RevealItem
                key={item.text}
                className="flex flex-col items-center rounded-2xl border border-ink/5 bg-cream p-6 text-center shadow-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm leading-relaxed text-ink/70">
                  {item.text}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-2xl leading-relaxed text-ink/70">
            {facultyLeadership.footer}
          </p>
        </Reveal>

        <Reveal delay={0.28} className="mt-8">
          <Button
            href={facultyLeadership.buttonHref}
            withArrow={false}
            className="!rounded-full !bg-sage"
          >
            {facultyLeadership.buttonLabel}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
