import { programsFaqs } from "@/data/programs";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function ProgramsFaqSection() {
  return (
    <section className="bg-cream" id="faq">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-sage sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 space-y-3">
          {programsFaqs.map((faq, index) => (
            <RevealItem key={faq.question}>
              <details
                open={index === 0}
                className="group rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-all duration-300 hover:border-teal/20 hover:shadow-md sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:content-none">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-lg leading-none text-sage transition-all duration-300 group-open:rotate-45 group-open:bg-teal group-open:text-white">
                    +
                  </span>
                </summary>
                <p className="mt-3 border-t border-ink/10 pt-3 leading-relaxed text-ink/70">
                  {faq.answer}
                </p>
              </details>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
