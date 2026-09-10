import { eligibility } from "@/data/admissions";
import { Reveal } from "@/components/motion/Reveal";

export function EligibilitySection() {
  return (
    <section className="bg-sage">
      <Reveal className="mx-auto max-w-4xl px-6 py-16 text-center lg:px-10 lg:py-24">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {eligibility.title}
        </h2>
        <div className="mt-6 space-y-4">
          {eligibility.paragraphs.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-white/80">
              {paragraph}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
