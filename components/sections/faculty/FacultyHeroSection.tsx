import Image from "next/image";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { facultyHero, leadership } from "@/data/faculty";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function FacultyHeroSection() {
  return (
    <section className="bg-lime">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-[0.25em] text-sage uppercase">
            {facultyHero.eyebrow}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
            {facultyHero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            {facultyHero.subtitle}
          </p>
        </Reveal>

        <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((person) => (
            <RevealItem
              key={person.name}
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-lg font-bold text-sage">{person.name}</h2>
                <p className="mt-1 text-sm font-semibold text-teal">
                  {person.title}
                </p>
                <div className="mt-3 space-y-3">
                  {person.bio.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-ink/70"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink/70">
                    {person.locations.map((location) => (
                      <span key={location.place}>
                        <span aria-hidden="true">{location.flag}</span>{" "}
                        {location.place}
                      </span>
                    ))}
                  </div>
                  <SocialLinks
                    linkedin={person.linkedin}
                    instagram={person.instagram}
                  />
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
