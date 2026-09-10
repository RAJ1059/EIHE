import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { leadership, facultyList } from "@/data/faculty";
import {
  CheckIcon,
  ClockIcon,
  LaptopIcon,
  DocumentIcon,
  GraduationCapIcon,
  PersonIcon,
  ToothIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Periodontics for Daily Practice",
  description:
    "Learn to confidently diagnose, prevent, and manage periodontal disease in your daily practice — a 10-module, self-paced EIHE course for general dentists.",
};

const outcomes = [
  "Diagnose periodontal conditions accurately",
  "Develop evidence-based treatment plans",
  "Perform non-surgical periodontal therapy",
  "Establish supportive periodontal therapy protocols",
  "Identify cases requiring specialist referral",
  "Apply systematic clinical decision-making to everyday practice",
];

const topics = [
  "Periodontal diagnosis, charting, staging and grading",
  "Scaling and root planing",
  "Risk assessment and patient education",
  "Non-surgical therapy protocols",
  "Supportive periodontal therapy",
  "Implant-periodontal relationships and restorative considerations",
  "Recognising when specialist referral is appropriate",
];

const quickFacts = [
  { icon: ClockIcon, label: "2 weeks", sub: "~7–10 hrs/week" },
  { icon: LaptopIcon, label: "100% online", sub: "Self-paced + optional live sessions" },
  { icon: DocumentIcon, label: "10 modules", sub: "Assessments + final exam" },
  { icon: GraduationCapIcon, label: "No prerequisites", sub: "Built for general dentists" },
];

const instructorBySearchName = (query: string) =>
  [...leadership, ...facultyList].find((f) => f.name.includes(query));

const instructors = [
  instructorBySearchName("Sachit"),
  instructorBySearchName("Gunjan"),
  instructorBySearchName("Carlota"),
].filter((person): person is NonNullable<typeof person> => Boolean(person));

export default function PeriodonticsForDailyPracticePage() {
  return (
    <>
      <section className="bg-sage">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-10 lg:py-20">
          <Reveal>
            <Link
              href="/programs/dentists"
              className="text-sm font-semibold text-white/70 hover:text-white"
            >
              ← Programs for Dentists
            </Link>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-teal/20 px-3 py-1 text-xs font-semibold tracking-[0.15em] text-teal uppercase">
              <ToothIcon className="h-3.5 w-3.5" /> Dentistry · Periodontics
            </span>

            <h1 className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl">
              Periodontics for <span className="text-teal">Daily Practice</span>
            </h1>

            <p className="mt-6 max-w-lg leading-relaxed text-white/80">
              Learn to confidently diagnose, prevent, and manage periodontal disease in
              your daily practice.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="/courses/periodontics-for-daily-practice" withArrow>
                Enroll Now
              </Button>
              <div>
                <p className="text-2xl font-extrabold text-white">
                  ₹2,500{" "}
                  <span className="text-base font-medium text-white/50 line-through">
                    ₹7,500
                  </span>
                </p>
                <p className="text-xs font-semibold text-teal">67% off · limited spots</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <Image
              src="/images/courses/dentist-periodontics.jpg"
              alt="Periodontics for Daily Practice"
              width={1200}
              height={900}
              className="h-auto w-full rounded-2xl object-cover shadow-lg"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 lg:px-10 lg:py-24">
          <RevealGroup className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {quickFacts.map(({ icon: Icon, label, sub }) => (
              <RevealItem
                key={label}
                className="rounded-2xl border border-ink/10 bg-cream p-5 text-center"
              >
                <Icon className="mx-auto h-6 w-6 text-teal" />
                <p className="mt-3 text-sm font-bold text-ink">{label}</p>
                <p className="mt-1 text-xs text-ink/60">{sub}</p>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16">
            <h2 className="text-2xl font-bold text-sage">About This Course</h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              A practical program designed to help general dentists confidently
              incorporate evidence-based periodontal care into their daily clinical
              practice. You&rsquo;ll learn comprehensive periodontal assessments,
              accurate disease diagnosis, effective treatment planning, non-surgical
              periodontal therapy delivery, and long-term maintenance protocols using a
              systematic, case-based approach — no prior periodontal or implant
              experience required.
            </p>
          </Reveal>

          <Reveal className="mt-16">
            <h2 className="text-2xl font-bold text-sage">What You&rsquo;ll Learn</h2>
            <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {outcomes.map((outcome) => (
                <li key={outcome} className="flex items-start gap-3">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-teal" />
                  <span className="text-sm text-ink/80">{outcome}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-16">
            <h2 className="text-2xl font-bold text-sage">Course Structure</h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              Delivered across 10 modules with module-by-module assessments and a final
              comprehensive examination. Case-based learning uses real clinical
              radiographs and periodontal charts, with PDF notes and video lessons
              included, plus optional live mentorship sessions. Access runs for 2 weeks
              plus 2 additional months post-completion.
            </p>
            <ul className="mt-6 space-y-3">
              {topics.map((topic) => (
                <li key={topic} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  <span className="text-sm text-ink/80">{topic}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {instructors.length > 0 && (
            <Reveal className="mt-16">
              <h2 className="text-2xl font-bold text-sage">Meet Your Instructors</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {instructors.map((person) => (
                  <div
                    key={person.name}
                    className="rounded-2xl border border-ink/10 bg-cream p-5"
                  >
                    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-ink/5">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-4 flex items-center gap-1.5 font-bold text-ink">
                      <PersonIcon className="h-4 w-4 text-teal" /> {person.name}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-teal">
                      {person.title}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          )}

          <Reveal className="mt-16 rounded-2xl border border-ink/10 bg-cream p-8">
            <h2 className="text-xl font-bold text-sage">Certification</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/70">
              Graduates receive the EIHE Certificate in Periodontics for Daily
              Practice, validated by Clínica Torres Carranza (Seville, Spain).
            </p>
          </Reveal>

          <Reveal className="mt-16 rounded-2xl bg-sage p-8 text-center lg:p-12">
            <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
              Limited spots for the upcoming cohort. Full course fee payment — no
              installment plans available.
            </p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <Button href="/courses/periodontics-for-daily-practice" variant="inverse">
                Enroll Now
              </Button>
              <p className="text-xs text-white/50">₹2,500 · was ₹7,500</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
