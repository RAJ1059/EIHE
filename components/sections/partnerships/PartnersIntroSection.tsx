import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { partnersIntro } from "@/data/partnersDirectory";
import { Reveal } from "@/components/motion/Reveal";

export function PartnersIntroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {partnersIntro.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-sage sm:text-4xl">
            {partnersIntro.title}
          </h1>
          <p className="mt-6 leading-relaxed text-ink/70">
            {partnersIntro.paragraph}
          </p>
          <blockquote className="mt-6 rounded-2xl border-l-4 border-teal bg-cream p-5 leading-relaxed text-ink/80 italic">
            &ldquo;{partnersIntro.quote}&rdquo;
          </blockquote>
          <Button
            href={partnersIntro.buttonHref}
            withArrow={false}
            className="mt-8 !rounded-full !bg-sage"
          >
            {partnersIntro.buttonLabel}
          </Button>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <Image
            src={partnersIntro.image}
            alt="Medical professionals collaborating in a healthcare setting"
            width={900}
            height={1100}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:right-auto sm:max-w-xs">
            <p className="text-xs font-semibold tracking-[0.15em] text-teal uppercase">
              {partnersIntro.overlay.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">
              {partnersIntro.overlay.text}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
