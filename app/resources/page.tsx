import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ArrowIcon, CompassIcon, GraduationCapIcon, InfoIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Explore EIHE's free educational resources, certification details, and frequently asked questions.",
};

const resourceLinks = [
  {
    icon: CompassIcon,
    title: "Free Resources",
    description:
      "Selected educational materials to support continuous learning in healthcare and aesthetic medicine.",
    href: "/resources/free",
  },
  {
    icon: GraduationCapIcon,
    title: "Certification & Recognition",
    description:
      "How EIHE certifications are structured and what they represent for your professional development.",
    href: "/resources/certification",
  },
  {
    icon: InfoIcon,
    title: "FAQs",
    description: "Answers to common questions about our programs, fees, admissions, and certificates.",
    href: "/faqs",
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Resources for Healthcare Learners"
        description="Free materials, certification guidance, and answers to common questions — everything you need before and during your EIHE program."
      />

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-20">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {resourceLinks.map((item) => (
              <RevealItem key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-ink/5 bg-cream p-6 transition-shadow hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-lime text-sage">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-sage">{item.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/70">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                    Explore
                    <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal delay={0.15} className="mt-10 rounded-2xl bg-sage p-8 text-center text-white">
            <p className="text-lg font-semibold">Have a question we haven&rsquo;t answered?</p>
            <p className="mt-2 text-sm text-white/70">
              Our team is happy to help with anything about our programs or admissions.
            </p>
            <Link
              href="/contact"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-sage transition-transform hover:scale-[1.03] active:scale-[0.97]"
            >
              Contact Us
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
