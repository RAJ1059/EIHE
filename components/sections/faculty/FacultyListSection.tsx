import Image from "next/image";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { facultyList, facultyListHeading } from "@/data/faculty";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function FacultyListSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal>
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-sage sm:text-3xl">
            {facultyListHeading}
          </h2>
        </Reveal>

        <RevealGroup className="mt-12 space-y-8">
          {facultyList.map((person) => (
            <RevealItem
              key={person.name}
              className="flex flex-col gap-6 rounded-2xl border border-ink/5 bg-cream p-6 shadow-sm sm:flex-row sm:p-8"
            >
              <div className="relative mx-auto h-56 w-44 shrink-0 overflow-hidden rounded-xl sm:mx-0">
                <Image
                  src={person.photo}
                  alt={person.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-sage">{person.name}</h3>
                <p className="mt-1 text-sm text-ink/80">
                  <strong className="font-semibold text-ink">
                    Designation:
                  </strong>{" "}
                  {person.title}
                </p>
                <p className="mt-1 text-sm text-ink/80">
                  <strong className="font-semibold text-ink">
                    Location:
                  </strong>{" "}
                  {person.locations
                    .map((location) => `${location.flag} ${location.place}`)
                    .join("  •  ")}
                </p>

                {person.bio.length > 0 && (
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
                )}

                <div className="mt-4">
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
