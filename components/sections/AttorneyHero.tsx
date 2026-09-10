import { Button } from "@/components/ui/Button";
import { StarIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/Reveal";

const snapshotRows = [
  { label: "Licensed attorneys confirmed", value: "4 of 8", pill: true },
  { label: "States represented", value: "CA · PA · FL · MO", pill: false },
  { label: "Filings signed by an attorney", value: "100%", pill: false },
  { label: "Practice scope", value: "Federal, nationwide", pill: false },
];

export function AttorneyHero() {
  return (
    <section className="relative overflow-hidden bg-lime">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:radial-gradient(circle,rgba(0,0,0,0.05)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-16 h-96 w-96 rounded-full bg-teal/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-white/40 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:py-24">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-sage uppercase shadow-sm backdrop-blur-sm">
              Dossios Legal Services &middot; Our Attorneys
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 text-5xl leading-[1.05] font-semibold tracking-tight text-ink sm:text-6xl">
              The attorneys behind every filing.
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/80">
              Dossios cases are led by licensed, practicing immigration
              attorneys — never by case managers alone. Meet the panel
              responsible for your strategy, your filings, and your
              outcome.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button href="/contact">Start My Case</Button>
              <Button href="/#how-it-works" variant="ghost">
                See How It Works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-8 inline-flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm text-ink/80 shadow-sm backdrop-blur-sm">
              <div className="flex gap-0.5 text-sage" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </div>
              <span>
                <strong className="font-semibold text-ink">4.4/5</strong>{" "}
                from 208 Google reviews &middot; 26+ years serving Bay Area
                families
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.36}>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-ink/50">
              Dossios provides technology and case-support services and is
              not a law firm. Legal services are provided by Dossios Legal
              Services, a California professional corporation, and other
              independent licensed counsel.
            </p>
          </Reveal>
        </div>

        <Reveal
          delay={0.15}
          className="relative mx-auto w-full max-w-md pb-14 lg:max-w-none lg:pb-16"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-white/60 to-teal/10 blur-2xl"
          />
          <div className="relative rounded-2xl border border-ink/5 bg-white p-5 shadow-[0_20px_60px_-15px_rgba(32,116,96,0.35)] transition-transform duration-500 ease-out hover:-translate-y-1">
            <div className="flex items-center justify-between text-xs text-ink/60">
              <span className="font-medium tracking-[0.1em] uppercase">
                Dossios Legal Services
              </span>
              <span className="rounded-full bg-teal px-3 py-1 text-xs font-semibold text-white">
                Growing
              </span>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              Attorney Panel Snapshot
            </h3>
            <ul className="mt-4 space-y-3 border-t border-ink/10 pt-4">
              {snapshotRows.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-ink">{row.label}</span>
                  {row.pill ? (
                    <span className="rounded-full bg-teal px-2.5 py-1 text-xs font-semibold text-white">
                      {row.value}
                    </span>
                  ) : (
                    <span className="text-ink/60">{row.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute left-1/2 bottom-0 w-[85%] -translate-x-1/2 rounded-2xl bg-teal px-6 py-4 shadow-[0_16px_40px_-10px_rgba(32,116,96,0.5)] transition-transform duration-500 ease-out hover:-translate-y-1">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-white/60 uppercase">
              Managing Attorney
            </p>
            <p className="mt-0.5 text-lg font-semibold text-white">
              Sheetal Chopra, Esq.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
