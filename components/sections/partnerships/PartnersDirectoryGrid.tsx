import Image from "next/image";
import { partnersDirectory } from "@/data/partnersDirectory";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function PartnersDirectoryGrid() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            Partners and Collaborations
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partnersDirectory.map((partner) => (
            <RevealItem
              key={partner.name}
              className="flex flex-col rounded-2xl border border-ink/5 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="flex h-16 items-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={140}
                  height={64}
                  className="h-full w-auto max-w-[140px] object-contain"
                />
              </div>
              <h3 className="mt-4 text-base font-bold text-sage">
                {partner.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink/60">
                <span aria-hidden="true">{partner.flag}</span>
                {partner.location}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">
                {partner.description}
              </p>
              {partner.href && (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-xs font-semibold tracking-[0.15em] text-teal uppercase transition-colors hover:text-sage"
                >
                  Visit Website →
                </a>
              )}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
