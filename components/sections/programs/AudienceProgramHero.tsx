import Image from "next/image";
import { CheckIcon } from "@/components/ui/icons";
import type { AudienceProgramPage } from "@/data/courses";
import { Reveal } from "@/components/motion/Reveal";

export function AudienceProgramHero({
  program,
}: {
  program: Pick<
    AudienceProgramPage,
    "title" | "highlight" | "subtitle" | "features" | "heroImage"
  >;
}) {
  const titleBefore = program.title.split(program.highlight)[0]?.trim();

  return (
    <section className="bg-sage">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-20">
        <Reveal>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
            {titleBefore ? `${titleBefore} ` : ""}
            <span className="text-teal">{program.highlight}</span>
          </h1>
          <p className="mt-6 max-w-lg leading-relaxed text-white/80">
            {program.subtitle}
          </p>

          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
            {program.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm font-medium text-white"
              >
                <CheckIcon className="h-4 w-4 shrink-0 text-teal" />
                {feature}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <Image
            src={program.heroImage}
            alt={program.title}
            width={1200}
            height={900}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </Reveal>
      </div>
    </section>
  );
}
