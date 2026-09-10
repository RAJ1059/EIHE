import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export function CTASection({
  title,
  description,
  buttonLabel = "Start My Case",
  buttonHref = "/contact",
  secondaryLabel,
  secondaryHref,
  id,
}: {
  title: string;
  description: string;
  buttonLabel?: string;
  buttonHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  id?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-lime" id={id}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/10 blur-3xl"
      />
      <Reveal className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-16 text-center lg:py-20">
        <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-xl text-ink/70">{description}</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button href={buttonHref} variant="primary">
            {buttonLabel}
          </Button>
          {secondaryLabel && secondaryHref && (
            <Link
              href={secondaryHref}
              className="text-sm font-medium text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </Reveal>
    </section>
  );
}
