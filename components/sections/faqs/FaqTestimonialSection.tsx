import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

const testimonial = {
  quote:
    "EIHE is dedicated to setting new standards in healthcare education. We focus on excellence, innovation, and global perspective, needed to transform patient care.",
  name: "Dr Carlota Alonso Pardal",
  title: "MBBS, EIHE CEO",
  photo: "/images/faculty/carlota-face-comp1.jpg",
};

export function FaqTestimonialSection() {
  return (
    <section className="bg-white">
      <Reveal className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center lg:px-10 lg:py-24">
        <div className="relative h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={testimonial.photo}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <p className="text-xl leading-relaxed text-ink italic sm:text-2xl">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        <div>
          <p className="font-bold text-sage">{testimonial.name}</p>
          <p className="text-sm text-ink/60">{testimonial.title}</p>
        </div>
      </Reveal>
    </section>
  );
}
