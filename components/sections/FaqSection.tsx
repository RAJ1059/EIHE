import { SectionHead } from "@/components/sections/SectionHead";
import { faqs as defaultFaqs } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

type Faq = { question: string; answer: string };

export function FaqSection({
  id = "faq",
  eyebrow = "FAQ",
  title = "Common questions",
  description = "Straightforward answers about how Dossios works, who does what, and what to expect.",
  items = defaultFaqs,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  items?: Faq[];
}) {
  return (
    <section className="bg-cream" id={id}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <Reveal>
            <SectionHead eyebrow={eyebrow} title={title} description={description} />
          </Reveal>

          <RevealGroup className="space-y-3">
            {items.map((faq, index) => (
              <RevealItem key={faq.question}>
                <details
                  open={index === 0}
                  className="group rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-all duration-300 hover:border-teal/20 hover:shadow-md sm:p-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink marker:content-none">
                    {faq.question}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sage transition-all duration-300 group-open:rotate-45 group-open:bg-teal group-open:text-white">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-ink/70 border-t border-ink/10 pt-3">
                    {faq.answer}
                  </p>
                </details>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
