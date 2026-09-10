import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { programsByAudience } from "@/data/courses";
import { Reveal } from "@/components/motion/Reveal";

function findCourse(audience: string, courseSlug: string) {
  const program = programsByAudience[audience];
  if (!program) return null;

  const href = `/programs/${audience}/${courseSlug}`;
  const course = program.courses.find((c) => c.href === href);
  if (!course) return null;

  return { program, course };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ audience: string; course: string }>;
}): Promise<Metadata> {
  const { audience, course } = await params;
  const found = findCourse(audience, course);
  if (!found) return {};

  return {
    title: found.course.title,
    description: found.course.description,
  };
}

export default async function ComingSoonCoursePage({
  params,
}: {
  params: Promise<{ audience: string; course: string }>;
}) {
  const { audience, course } = await params;
  const found = findCourse(audience, course);

  if (!found) {
    notFound();
  }

  const { program, course: courseData } = found;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <Reveal>
          <Link
            href={`/programs/${audience}`}
            className="text-sm font-semibold text-teal hover:underline"
          >
            ← Back to {program.title}
          </Link>

          <span className="mt-6 inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-teal uppercase">
            Coming Soon
          </span>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-sage sm:text-4xl">
            {courseData.title}
          </h1>

          <p className="mt-6 leading-relaxed text-ink/70">{courseData.description}</p>

          <div className="mt-10 rounded-2xl border border-ink/10 bg-cream p-6">
            <p className="font-semibold text-ink">
              This course isn&rsquo;t open for enrollment yet.
            </p>
            <p className="mt-1 text-sm text-ink/60">
              We&rsquo;re still building this program. Check back soon, or explore{" "}
              <Link href={`/programs/${audience}`} className="text-teal hover:underline">
                other {program.title.toLowerCase()}
              </Link>{" "}
              in the meantime.
            </p>

            <button
              type="button"
              disabled
              className="mt-6 inline-flex w-fit cursor-not-allowed items-center rounded-full bg-ink/10 px-5 py-2.5 text-sm font-semibold text-ink/50"
            >
              Coming Soon
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
