import { ClockIcon, EyeIcon, ShieldIcon, StethoscopeIcon } from "@/components/ui/icons";
import { ourMission } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const missionIcons = {
  shield: ShieldIcon,
  eye: EyeIcon,
  stethoscope: StethoscopeIcon,
  clock: ClockIcon,
};

export function OurMissionSection() {
  return (
    <section className="bg-sage" id="our-mission">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-white/60 uppercase">
            {ourMission.eyebrow}
          </span>
          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {ourMission.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ourMission.pillars.map((pillar) => {
            const Icon = missionIcons[pillar.icon];
            return (
              <RevealItem
                key={pillar.title}
                className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-white">
                  {pillar.title}
                </h3>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-2xl leading-relaxed text-white/70">
            {ourMission.footer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
