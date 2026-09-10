import Image from "next/image";
import { pathway } from "@/data/admissions";
import { Reveal } from "@/components/motion/Reveal";

export function PathwaySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {pathway.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {pathway.title}
          </h2>
          <p className="mt-6 leading-relaxed text-ink/70">{pathway.intro}</p>

          <p className="mt-6 font-semibold text-ink">{pathway.stepsLabel}</p>
          <ol className="mt-3 space-y-3">
            {pathway.steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="leading-relaxed text-ink/70">{step}</span>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.15}>
          <Image
            src={pathway.image}
            alt="A friendly nurse smiling with confidence"
            width={900}
            height={1100}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </Reveal>
      </div>
    </section>
  );
}
