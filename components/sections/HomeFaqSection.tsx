import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
  ClinicIcon,
  ClockIcon,
  CreditCardIcon,
  GraduationCapIcon,
  PeopleIcon,
  ShieldIcon,
} from "@/components/ui/icons";
import { homeFaqCta, homeFaqs } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

const faqIcons = [
  ClinicIcon,
  ClockIcon,
  CreditCardIcon,
  GraduationCapIcon,
  PeopleIcon,
  ShieldIcon,
];

function renderAnswer(answer: string) {
  const elements: ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bulletBuffer.length) {
      elements.push(
        <ul key={key++} className="mt-2 list-disc space-y-1 pl-5">
          {bulletBuffer.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      );
      bulletBuffer = [];
    }
  };

  for (const rawLine of answer.split("\n")) {
    const line = rawLine.trim();
    if (line === "") {
      flushBullets();
      continue;
    }
    const heading = line.match(/^\*\*(.+)\*\*$/);
    if (heading) {
      flushBullets();
      elements.push(
        <h4 key={key++} className="mt-4 font-semibold text-ink first:mt-0">
          {heading[1]}
        </h4>,
      );
    } else if (line.startsWith("- ")) {
      bulletBuffer.push(line.slice(2));
    } else {
      flushBullets();
      elements.push(
        <p key={key++} className="mt-2 leading-relaxed text-ink/70">
          {line}
        </p>,
      );
    }
  }
  flushBullets();
  return elements;
}

export function HomeFaqSection() {
  return (
    <section className="bg-white" id="faq">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold uppercase tracking-tight text-sage sm:text-4xl">
            Frequently Asked Questions
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 space-y-3">
          {homeFaqs.map((faq, index) => {
            const Icon = faqIcons[index % faqIcons.length];
            return (
              <RevealItem key={faq.question}>
                <details
                  open={index === 0}
                  className="group overflow-hidden rounded-xl border border-sage/15"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 bg-sage px-5 py-4 font-semibold text-white marker:content-none">
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="uppercase tracking-wide">
                        {faq.question}
                      </span>
                    </span>
                    <span className="text-xl leading-none font-normal transition-transform duration-300 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="bg-white px-5 py-5 text-sm sm:px-6">
                    {renderAnswer(faq.answer)}
                  </div>
                </details>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal delay={0.2} className="mt-14 text-center">
          <h3 className="text-xl font-bold text-sage">{homeFaqCta.title}</h3>
          <p className="mt-2 text-ink/70">{homeFaqCta.description}</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              href={homeFaqCta.primaryHref}
              withArrow={false}
              className="!rounded-full !bg-sage"
            >
              {homeFaqCta.primaryLabel}
            </Button>
            <Button
              href={homeFaqCta.secondaryHref}
              withArrow={false}
              className="!rounded-full !bg-teal"
            >
              {homeFaqCta.secondaryLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
