import { CheckIcon } from "@/components/ui/icons";
import { certAwards } from "@/data/certification";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function CertAwardsSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {certAwards.title}
          </h2>
          <p className="mt-4 leading-relaxed text-ink/70">
            {certAwards.intro}
          </p>
          <ul className="mt-6 space-y-3">
            {certAwards.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-teal" />
                <span className="text-ink/70">{bullet}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <RevealGroup className="space-y-4">
          {certAwards.credentials.map((credential) => (
            <RevealItem
              key={credential.title}
              className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm"
            >
              <h3 className="font-bold text-sage">{credential.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink/70">
                {credential.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
