import { Carousel } from "@/components/ui/Carousel";
import { faculty } from "@/data/homepage";
import { Reveal } from "@/components/motion/Reveal";

function flagFor(location: string) {
  return location.includes("India") ? "🇮🇳" : "🇪🇸";
}

function initialsFor(name: string) {
  const parts = name.replace(/^Dr\.?\s*/i, "").split(" ");
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function FacultySection() {
  return (
    <section className="bg-cream" id="faculty">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
              Academic Leadership &amp; Faculty
            </h2>
            <p className="mt-3 text-ink/70">
              International experts behind EIHE&rsquo;s training programs
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <Carousel>
            {faculty.map((member) => (
              <div
                key={member.name}
                className="flex w-64 shrink-0 snap-start flex-col items-center rounded-2xl border border-ink/5 bg-white p-6 text-center shadow-sm sm:w-72"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sage text-xl font-bold text-white">
                  {initialsFor(member.name)}
                </span>
                <h3 className="mt-4 text-base font-bold text-sage">
                  {member.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/70">
                  {member.title}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-ink">
                  <span aria-hidden="true">{flagFor(member.location)}</span>
                  {member.location}
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-ink/60">
            All EIHE Faculty are practicing clinicians and educators involved
            in curriculum design and clinical training.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
