import Image from "next/image";
import { partnersTestimonial } from "@/data/partnersDirectory";
import { Reveal } from "@/components/motion/Reveal";

export function PartnersTestimonialSection() {
  return (
    <section className="bg-white">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center lg:px-10 lg:py-24">
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={partnersTestimonial.photo}
            alt={partnersTestimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-xl leading-relaxed text-ink italic sm:text-2xl">
          &ldquo;{partnersTestimonial.quote}&rdquo;
        </p>
        <div>
          <p className="font-bold text-sage">{partnersTestimonial.name}</p>
          <p className="text-sm text-ink/60">{partnersTestimonial.title}</p>
        </div>
      </Reveal>
    </section>
  );
}
