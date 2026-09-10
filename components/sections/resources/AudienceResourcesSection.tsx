import Image from "next/image";
import { CheckIcon } from "@/components/ui/icons";
import { audienceSection } from "@/data/resources";
import { Reveal } from "@/components/motion/Reveal";

export function AudienceResourcesSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-lime px-3 py-1 text-xs font-semibold tracking-[0.2em] text-sage uppercase">
            {audienceSection.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {audienceSection.title}
          </h2>
          <p className="mt-4 leading-relaxed text-ink/70">
            {audienceSection.intro}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative mt-10 overflow-hidden rounded-2xl">
          <Image
            src={audienceSection.image}
            alt="Medical professionals collaborating"
            width={1400}
            height={500}
            className="h-64 w-full object-cover sm:h-80"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/10 to-transparent p-6">
            <p className="text-lg font-semibold text-white sm:text-xl">
              {audienceSection.overlay}
            </p>
          </div>
        </Reveal>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
          {audienceSection.items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 rounded-xl border border-ink/5 bg-cream px-4 py-3"
            >
              <CheckIcon className="h-4 w-4 shrink-0 text-teal" />
              <span className="text-sm font-medium text-ink">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
