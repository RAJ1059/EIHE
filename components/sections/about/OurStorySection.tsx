import Image from "next/image";
import { ourStory } from "@/data/about";
import { Reveal } from "@/components/motion/Reveal";

export function OurStorySection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="text-xs font-semibold tracking-[0.25em] text-teal uppercase">
            {ourStory.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-sage sm:text-4xl">
            {ourStory.title}
          </h2>
          <div className="mt-6 space-y-4">
            {ourStory.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Image
            src={ourStory.image}
            alt="EIHE healthcare professionals"
            width={1000}
            height={1000}
            className="h-auto w-full rounded-2xl object-cover shadow-lg"
          />
        </Reveal>
      </div>
    </section>
  );
}
