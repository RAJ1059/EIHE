import { Reveal } from "@/components/motion/Reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="bg-lime">
      <Reveal className="mx-auto max-w-3xl px-6 py-16 text-center lg:py-20">
        <div className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-sage uppercase">
          <span className="h-px w-8 bg-sage" aria-hidden="true" />
          {eyebrow}
          <span className="h-px w-8 bg-sage" aria-hidden="true" />
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-ink sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-ink/80">
            {description}
          </p>
        )}
      </Reveal>
    </section>
  );
}
