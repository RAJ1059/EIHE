import Image from "next/image";
import { Button } from "@/components/ui/Button";
import type { Course } from "@/data/courses";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function CourseGrid({ courses }: { courses: Course[] }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <RevealItem
              key={course.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-ink/5 bg-cream shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {course.badgeImage && (
                  <Image
                    src={course.badgeImage}
                    alt="ARP accredited"
                    width={56}
                    height={56}
                    className="absolute top-3 right-3 h-14 w-14 drop-shadow-md"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-sage">
                  {course.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                  {course.description}
                </p>
                {course.href ? (
                  <Button
                    href={course.href}
                    className="mt-6 self-start !rounded-full !bg-sage"
                  >
                    Know more!
                  </Button>
                ) : (
                  <span className="mt-6 inline-flex w-fit items-center rounded-full bg-ink/10 px-5 py-2.5 text-sm font-medium text-ink/60">
                    Coming Soon
                  </span>
                )}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
