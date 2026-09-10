import { stats } from "@/data/homepage";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function StatsBar() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <RevealGroup className="grid grid-cols-2 divide-y divide-ink/10 overflow-hidden rounded-2xl border border-ink/10 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
          {stats.map((stat) => (
            <RevealItem
              key={stat.label}
              className="group px-6 py-8 transition-colors duration-300 hover:bg-cream"
            >
              <div className="text-3xl font-semibold text-teal transition-transform duration-300 group-hover:scale-105 sm:text-4xl">
                {stat.num}
              </div>
              <p className="mt-2 text-sm text-ink/70">{stat.label}</p>
            </RevealItem>
          ))}
        </RevealGroup>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-4xl text-xs leading-relaxed text-ink/50">
            Attorney licensing and coverage vary by matter and jurisdiction.
            Immigration is federal practice; confirm representation details
            with your assigned attorney. Google rating reflects Bay Area
            Immigration Services&rsquo; public listing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
