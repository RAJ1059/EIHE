import type { Metadata } from "next";
import { EmployerHero } from "@/components/sections/EmployerHero";
import { StatsBar } from "@/components/sections/StatsBar";
import { WhySection } from "@/components/sections/WhySection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASection } from "@/components/sections/CTASection";
import {
  employerCoverageColumns,
  employerFaqs,
  employerProcessSteps,
  employerWhyItems,
} from "@/data/employers";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Dossios | Employer-Sponsored Immigration" },
  description:
    "Dossios pairs licensed immigration attorneys at Dossios Legal Services with a real-time case platform for H-1B, L-1, O-1, EB-1C, and E-2 sponsorship cases — built for HR teams that need visibility.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/employers`,
    title: "Dossios | Employer-Sponsored Immigration",
    description:
      "Licensed attorneys lead every sponsorship case. Give your HR team a clear, real-time view of every filing.",
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
};

export default function EmployersPage() {
  return (
    <>
      <EmployerHero />
      <StatsBar />
      <WhySection
        eyebrow="Why Employers Choose Dossios"
        title="Sponsorship your HR team can rely on"
        description="Sponsoring global talent means compliance risk, tight timelines, and employees who want answers. Dossios pairs licensed attorneys with a shared portal so nothing falls through the cracks."
        items={employerWhyItems}
      />
      <CoverageSection
        title="Every sponsorship pathway, under one legal team"
        description="From a first-time H-1B to an intracompany transfer program, Dossios Legal Services attorneys manage the full process — not just a slice of it."
        columns={employerCoverageColumns}
        footText="Not sure which category fits your role or candidate? Our legal team will help you find the strongest option before you commit to anything."
      />
      <ProcessSection
        title="How your sponsorship case moves forward"
        steps={employerProcessSteps}
      />
      <FaqSection
        title="Common questions from employers"
        items={employerFaqs}
      />
      <CTASection
        id="start"
        title="Ready to see exactly where your team's cases stand?"
        description="Tell us about your open roles and current sponsorships. A Dossios Legal Services attorney will review them and recommend the strongest path forward."
        buttonLabel="Start a Case"
        buttonHref="/contact"
        secondaryLabel="Schedule a Legal Consultation"
        secondaryHref="/contact"
      />
    </>
  );
}
