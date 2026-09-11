import type { ReactNode } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/motion/Reveal";

export function LegalPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="bg-white">
        <Reveal className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="text-sm font-semibold text-ink/50">Last updated: {updated}</p>
          <div className="mt-8">{children}</div>
        </Reveal>
      </section>
    </>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 text-xl font-bold text-sage first:mt-0">{children}</h2>;
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-3 leading-relaxed text-ink/70">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink/70">{children}</ul>;
}
