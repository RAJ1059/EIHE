import Image from "next/image";
import { societies } from "@/data/faculty";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function SocietiesSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {societies.title}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-ink/70">
            {societies.subtitle}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {societies.logos.map((logo, index) => (
            <RevealItem
              key={logo}
              className="flex h-24 items-center justify-center rounded-xl border border-ink/10 bg-white p-4"
            >
              <Image
                src={logo}
                alt={`Professional society ${index + 1}`}
                width={160}
                height={80}
                className="h-full w-full object-contain"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
