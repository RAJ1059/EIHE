import { Button } from "@/components/ui/Button";
import { PeopleIcon } from "@/components/ui/icons";
import { joinFaculty } from "@/data/faculty";
import { Reveal } from "@/components/motion/Reveal";

export function JoinFacultySection() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <Reveal className="mx-auto max-w-2xl rounded-3xl bg-white p-10 text-center shadow-sm">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-sage">
            <PeopleIcon className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-sage sm:text-3xl">
            {joinFaculty.title}
          </h2>
          <div className="mt-4 space-y-4">
            {joinFaculty.paragraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-ink/70">
                {paragraph}
              </p>
            ))}
          </div>
          <Button
            href={joinFaculty.buttonHref}
            withArrow={false}
            className="mt-8 !rounded-full !bg-sage"
          >
            {joinFaculty.buttonLabel}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
