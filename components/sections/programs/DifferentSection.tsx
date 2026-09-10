import { ClinicIcon, ClockIcon, EyeIcon, GraduationCapIcon, ShieldIcon } from "@/components/ui/icons";
import { differentSection } from "@/data/programs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const differentIcons = {
  shield: ShieldIcon,
  "graduation-cap": GraduationCapIcon,
  clock: ClockIcon,
  eye: EyeIcon,
  clinic: ClinicIcon,
};

export function DifferentSection() {
  return (
    <section className="bg-sage">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {differentSection.title} ✨
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {differentSection.items.map((item) => {
            const Icon = differentIcons[item.icon];
            return (
              <RevealItem
                key={item.text}
                className="flex flex-col items-center rounded-2xl border border-white/15 bg-white/5 p-6 text-center"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm leading-relaxed text-white/80">
                  {item.text}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
