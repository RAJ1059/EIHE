import Image from "next/image";
import { whoWeAre } from "@/data/about";
import { Reveal } from "@/components/motion/Reveal";

export function WhoWeAreSection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal delay={0.15} className="order-2 lg:order-1">
          <Image
            src={whoWeAre.image}
            alt="EIHE healthcare professionals"
            width={1000}
            height={1200}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </Reveal>

        <Reveal className="order-1 lg:order-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {whoWeAre.title}
          </h2>
          <div className="mt-6 space-y-4">
            {whoWeAre.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
