import Image from "next/image";
import { partnershipsHero } from "@/data/partnerships";
import { Reveal } from "@/components/motion/Reveal";

export function PartnershipsHeroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {partnershipsHero.label}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-sage sm:text-4xl">
            {partnershipsHero.titleLine1}{" "}
            <span className="text-ink">{partnershipsHero.titleHighlight}</span>
          </h1>
          <p className="mt-6 leading-relaxed text-ink/70">
            {partnershipsHero.paragraph}
          </p>
          <blockquote className="mt-6 rounded-2xl border-l-4 border-teal bg-cream p-5 leading-relaxed text-ink/80 italic">
            &ldquo;{partnershipsHero.callout}&rdquo;
          </blockquote>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <Image
            src={partnershipsHero.image}
            alt="Healthcare professionals in a laboratory"
            width={1024}
            height={1024}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm">
            <p className="text-2xl font-extrabold text-sage">
              {partnershipsHero.stat.value}
            </p>
            <p className="text-xs font-medium text-ink/60">
              {partnershipsHero.stat.label}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
