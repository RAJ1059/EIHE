import { ClockIcon, EyeIcon, ShieldIcon } from "@/components/ui/icons";
import { qualityAssuranceAbout } from "@/data/about";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const qualityIcons = {
  eye: EyeIcon,
  shield: ShieldIcon,
  clock: ClockIcon,
};

export function AboutQualitySection() {
  return (
    <section className="bg-cream" id="quality-assurance">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {qualityAssuranceAbout.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {qualityAssuranceAbout.title}
          </h2>
          <p className="mt-6 text-xl leading-relaxed text-ink/80 italic">
            &ldquo;{qualityAssuranceAbout.pullQuote}&rdquo;
          </p>
        </Reveal>

        <RevealGroup className="space-y-6">
          {qualityAssuranceAbout.items.map((item) => {
            const Icon = qualityIcons[item.icon];
            return (
              <RevealItem key={item.text} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="leading-relaxed text-ink/70">{item.text}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
