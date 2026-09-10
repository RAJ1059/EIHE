import Image from "next/image";
import { certMockups } from "@/data/certification";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function CertMockupsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {certMockups.title}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-10 lg:grid-cols-2">
          {certMockups.items.map((item) => (
            <RevealItem key={item.title}>
              <Image
                src={item.image}
                alt={item.alt}
                width={1140}
                height={720}
                className="h-auto w-full rounded-2xl shadow-lg"
              />
              <h3 className="mt-6 text-lg font-bold text-sage">
                {item.title}
              </h3>
              <p className="mt-2 leading-relaxed text-ink/70">
                {item.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
