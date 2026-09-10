import { admissionsHero } from "@/data/admissions";
import { Reveal } from "@/components/motion/Reveal";

export function AdmissionsHeroSection() {
  return (
    <section className="bg-lime">
      <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-20">
        <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {admissionsHero.title}
        </h1>
      </Reveal>
    </section>
  );
}
