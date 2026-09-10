import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { certHero } from "@/data/certification";
import { Reveal } from "@/components/motion/Reveal";

export function CertHeroSection() {
  return (
    <section className="relative overflow-hidden bg-sage">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
            {certHero.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
            {certHero.titleLine1} <span className="text-teal">{certHero.titleHighlight}</span>
          </h1>
          <div className="mt-6 space-y-4">
            {certHero.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-white/80">
                {paragraph}
              </p>
            ))}
          </div>
          <Button
            href={certHero.buttonHref}
            withArrow={false}
            className="mt-8 !rounded-full !bg-teal"
          >
            {certHero.buttonLabel}
          </Button>

          <blockquote className="mt-8 border-l-2 border-teal pl-4 text-white/70 italic">
            &ldquo;{certHero.pullQuote}&rdquo;
          </blockquote>
        </Reveal>

        <Reveal delay={0.15}>
          <Image
            src={certHero.image}
            alt="EIHE professional"
            width={900}
            height={1100}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </Reveal>
      </div>
    </section>
  );
}
