import {
  CheckIcon,
  CompassIcon,
  DocumentIcon,
  EyeIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { certRepresents } from "@/data/certification";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const featureIcons = {
  compass: CompassIcon,
  shield: ShieldIcon,
  eye: EyeIcon,
  check: CheckIcon,
  document: DocumentIcon,
};

export function CertRepresentsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {certRepresents.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            {certRepresents.intro}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {certRepresents.features.map((feature) => {
            const Icon = featureIcons[feature.icon];
            return (
              <RevealItem
                key={feature.title}
                className="flex flex-col items-center rounded-2xl border border-ink/5 bg-cream p-6 text-center shadow-sm"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-sage">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">
                  {feature.description}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2}>
          <p className="mx-auto mt-12 max-w-2xl leading-relaxed text-ink/60">
            {certRepresents.footer}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
