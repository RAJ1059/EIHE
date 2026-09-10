import { partnershipsQuote } from "@/data/partnerships";
import { Reveal } from "@/components/motion/Reveal";

export function PartnershipsQuoteSection() {
  return (
    <section className="bg-white">
      <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center lg:px-10 lg:py-20">
        <blockquote className="text-2xl leading-relaxed text-sage italic sm:text-3xl">
          &ldquo;{partnershipsQuote.quote}&rdquo;
        </blockquote>
        <div className="mx-auto mt-6 h-px w-16 bg-teal" />
        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-ink/50 uppercase">
          {partnershipsQuote.footer}
        </p>
      </Reveal>
    </section>
  );
}
