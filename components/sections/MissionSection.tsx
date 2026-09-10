import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { mission } from "@/data/homepage";
import { Reveal } from "@/components/motion/Reveal";

export function MissionSection() {
  return (
    <section className="bg-lime" id="mission">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-ink/60 uppercase">
            {mission.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {mission.title}
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink/70">
            {mission.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              href={mission.primaryHref}
              withArrow={false}
              className="!rounded-none !bg-transparent !text-ink !shadow-none border border-ink/30 hover:!bg-white"
            >
              {mission.primaryLabel}
            </Button>
            <Button
              href={mission.secondaryHref}
              withArrow={false}
              className="!rounded-none !bg-transparent !text-ink !shadow-none border border-ink/30 hover:!bg-white"
            >
              {mission.secondaryLabel}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/mission-photo.png"
              alt="EIHE healthcare professional"
              width={800}
              height={800}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
