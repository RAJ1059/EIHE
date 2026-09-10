import { SectionHead } from "@/components/sections/SectionHead";
import { Button } from "@/components/ui/Button";
import { coverageColumns as defaultCoverageColumns } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

type CoverageColumn = {
  title: string;
  items: { label: string; tag: string }[];
};

export function CoverageSection({
  id = "coverage",
  eyebrow = "Coverage",
  title = "All the pathways you need, under one legal team",
  description = "From extraordinary ability to permanent residency, Dossios Legal Services attorneys manage the full process — not just a slice of it.",
  columns = defaultCoverageColumns,
  footText = "Not sure which path fits your situation? Our legal team will help you find the strongest option before you commit to anything.",
  buttonLabel = "Get an Eligibility Review",
  buttonHref = "/contact",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  columns?: CoverageColumn[];
  footText?: string;
  buttonLabel?: string;
  buttonHref?: string;
}) {
  return (
    <section className="bg-cream" id={id}>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <SectionHead eyebrow={eyebrow} title={title} description={description} />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3">
          {columns.map((col) => (
            <RevealItem
              key={col.title}
              className="rounded-2xl border border-ink/10 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-ink">{col.title}</h3>
              <ul className="mt-4 space-y-3 border-t border-ink/10 pt-4">
                {col.items.map((item) => (
                  <li
                    key={item.label}
                    className="group flex flex-wrap items-center justify-between gap-2 text-sm text-ink/80"
                  >
                    <span>{item.label}</span>
                    <span className="shrink-0 rounded-full bg-lime px-2.5 py-0.5 text-xs font-semibold text-sage transition-colors duration-300 group-hover:bg-teal group-hover:text-white">
                      {item.tag}
                    </span>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.15}>
          <div className="relative mt-10 flex flex-col items-start gap-6 overflow-hidden rounded-2xl bg-teal p-8 shadow-[0_20px_50px_-15px_rgba(32,116,96,0.4)] transition-transform duration-300 ease-out hover:-translate-y-1 sm:flex-row sm:items-center sm:justify-between">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            />
            <p className="relative max-w-xl text-white/90">{footText}</p>
            <Button href={buttonHref} variant="inverse" className="relative shrink-0">
              {buttonLabel}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
