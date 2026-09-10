import { CheckIcon, EyeIcon } from "@/components/ui/icons";
import { platformFeatures, portalTimeline } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function PlatformSection() {
  return (
    <section className="bg-lime" id="platform">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-semibold text-sage shadow-sm">
            <EyeIcon className="h-4 w-4" />
            Case Technology
          </span>
        </Reveal>

        <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <Reveal delay={0.08}>
              <span className="text-xs font-semibold tracking-[0.2em] text-sage uppercase">
                The Dossios Platform
              </span>
              <h2 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">
                Real-time visibility, built in
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-ink/80">
                Every Dossios case runs on a purpose-built case management
                platform — so you&rsquo;re never left wondering what
                happens next, and your legal team never loses track of a
                detail.
              </p>
            </Reveal>

            <RevealGroup className="mt-10 space-y-6">
              {platformFeatures.map((feature) => (
                <RevealItem
                  key={feature.title}
                  className="group flex gap-4 rounded-xl p-2 -m-2 transition-colors duration-300 hover:bg-white/60"
                >
                  <span
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white text-sage shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-teal group-hover:text-white"
                    aria-hidden="true"
                  >
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-ink">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/70">
                      {feature.description}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <Reveal delay={0.2}>
            <div
              className="overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-[0_25px_60px_-20px_rgba(0,0,0,0.25)] transition-transform duration-500 ease-out hover:-translate-y-1"
              aria-hidden="true"
            >
              <div className="flex items-center gap-3 border-b border-ink/10 bg-cream/60 px-4 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
                </span>
                <span className="text-xs font-medium text-ink/40">
                  portal.dossios.com
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                  <EyeIcon className="h-4 w-4 text-sage" />
                  Dossios Case Portal
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-ink/50">
                  <span className="rounded-full bg-lime px-2.5 py-1 text-sage">
                    Timeline
                  </span>
                  <span>Documents</span>
                  <span>Messages</span>
                </div>
              </div>
              <div className="space-y-1 border-t border-ink/10 p-4">
                {portalTimeline.map((row) => (
                  <div
                    key={row.title}
                    className="flex items-center gap-3 rounded-xl px-2 py-3 transition-colors duration-300 hover:bg-cream"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                        row.state === "done"
                          ? "bg-teal text-white"
                          : row.state === "current"
                            ? "bg-peach text-peach-ink"
                            : "bg-lime text-sage"
                      }`}
                    >
                      {row.state === "done" ? (
                        <CheckIcon className="h-3.5 w-3.5" />
                      ) : row.state === "current" ? (
                        "3"
                      ) : (
                        "4"
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-ink">
                        {row.title}
                      </div>
                      <div className="truncate text-xs text-ink/50">
                        {row.sub}
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-ink/40">
                      {row.when}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
