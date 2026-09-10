import { SectionHead } from "@/components/sections/SectionHead";
import { attorneyRoster, attorneyRosterMore } from "@/data/attorneys";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function AttorneyRoster() {
  return (
    <section className="bg-white" id="panel">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <SectionHead
            eyebrow="The Panel"
            title="Licensed. Vetted. Accountable."
            description="Every attorney on the Dossios Legal Services panel is independently licensed and personally accountable for the cases they sign. Here's who leads your case today."
          />
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attorneyRoster.map((attorney) => (
            <RevealItem
              key={attorney.name}
              className="group rounded-2xl border border-ink/10 bg-cream p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-teal/20 hover:shadow-xl"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lime text-sm font-semibold text-sage transition-all duration-300 group-hover:bg-teal group-hover:text-white">
                {attorney.initials}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ink">
                {attorney.name}
              </h3>
              <div className="mt-1 text-sm font-medium text-sage">
                {attorney.role}
              </div>
              {attorney.bio && (
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  {attorney.bio}
                </p>
              )}
              {attorney.barInfo && (
                <p className="mt-3 text-xs font-medium tracking-wide text-ink/50 uppercase">
                  {attorney.barInfo}
                </p>
              )}
            </RevealItem>
          ))}

          <RevealItem className="flex flex-col justify-center rounded-2xl border border-dashed border-ink/20 bg-cream/40 p-6 transition-colors duration-300 hover:border-teal/40">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-dashed border-ink/20 text-sm font-semibold text-sage">
              {attorneyRosterMore.initials}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              {attorneyRosterMore.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              {attorneyRosterMore.bio}
            </p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
