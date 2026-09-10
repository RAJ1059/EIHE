import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { resourcesIntro } from "@/data/resources";
import { Reveal } from "@/components/motion/Reveal";

export function ResourcesIntroSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-sage sm:text-4xl">
            {resourcesIntro.title}
          </h1>
          <div className="mt-6 space-y-4">
            {resourcesIntro.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
          <Button
            href={resourcesIntro.buttonHref}
            withArrow={false}
            className="mt-8 !rounded-full !bg-sage"
          >
            {resourcesIntro.buttonLabel}
          </Button>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <Image
            src={resourcesIntro.image}
            alt="EIHE healthcare professional"
            width={900}
            height={1100}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:right-auto sm:max-w-xs">
            <p className="text-xs font-semibold tracking-[0.15em] text-teal uppercase">
              {resourcesIntro.overlay.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">
              {resourcesIntro.overlay.text}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
