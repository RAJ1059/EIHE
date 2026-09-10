import { Button } from "@/components/ui/Button";
import { PeopleIcon } from "@/components/ui/icons";
import { studentSupport } from "@/data/certification";
import { Reveal } from "@/components/motion/Reveal";

export function StudentSupportSection() {
  return (
    <section className="bg-cream">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 px-6 py-16 text-center lg:px-10 lg:py-20">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-sage">
          <PeopleIcon className="h-6 w-6" />
        </span>
        <h3 className="text-2xl font-extrabold tracking-tight text-sage">
          {studentSupport.title}
        </h3>
        <p className="font-semibold text-ink">{studentSupport.subtitle}</p>
        <p className="text-ink/70">{studentSupport.description}</p>
        <Button
          href={studentSupport.buttonHref}
          withArrow={false}
          className="mt-2 !rounded-full !bg-sage"
        >
          {studentSupport.buttonLabel}
        </Button>
      </Reveal>
    </section>
  );
}
