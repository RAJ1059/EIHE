import Image from "next/image";
import { programsHero } from "@/data/programs";
import { Reveal } from "@/components/motion/Reveal";

export function ProgramsHeroSection() {
  return (
    <section className="relative overflow-hidden bg-sage">
      <div className="absolute inset-0">
        <Image
          src={programsHero.image}
          alt=""
          fill
          className="object-cover object-right"
          priority
        />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <Reveal className="max-w-xl">
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
            <span className="text-teal">{programsHero.highlight}</span>{" "}
            {programsHero.title.replace(programsHero.highlight, "").trim()}
          </h1>
          <p className="mt-6 leading-relaxed text-white/80">
            {programsHero.description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
