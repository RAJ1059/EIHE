import type { Metadata } from "next";
import { FamilyHero } from "@/components/sections/FamilyHero";
import { StatsBar } from "@/components/sections/StatsBar";
import { WhySection } from "@/components/sections/WhySection";
import { CoverageSection } from "@/components/sections/CoverageSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASection } from "@/components/sections/CTASection";
import {
  familyCoverageColumns,
  familyFaqs,
  familyProcessSteps,
  familyWhyItems,
} from "@/data/families";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Dossios | Family-Based Immigration" },
  description:
    "Dossios pairs licensed immigration attorneys at Dossios Legal Services with a real-time case platform for marriage-based green cards, fiancé visas, adjustment of status, consular processing, and naturalization.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/families`,
    title: "Dossios | Family-Based Immigration",
    description:
      "Licensed attorneys lead every family case. Track your petition, interview prep, and citizenship path in one place.",
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
};

export default function FamiliesPage() {
  return (
    <>
      <FamilyHero />
      <StatsBar />
      <WhySection
        eyebrow="Why Families Choose Dossios"
        title="Peace of mind for the whole family"
        description="A family petition touches your marriage, your children, and your future in the U.S. — it deserves an attorney's judgment at every step, not a generic online form."
        items={familyWhyItems}
      />
      <CoverageSection
        title="Every family pathway, under one legal team"
        description="From the first petition to the oath of citizenship, Dossios Legal Services attorneys manage the full process — not just a slice of it."
        columns={familyCoverageColumns}
        footText="Not sure which path fits your family's situation? Our legal team will help you find the strongest option before you commit to anything."
      />
      <ProcessSection
        title="How your family's case moves forward"
        steps={familyProcessSteps}
      />
      <FaqSection
        title="Common questions from families"
        items={familyFaqs}
      />
      <CTASection
        id="start"
        title="Ready to see exactly where your family's case stands?"
        description="Tell us your story. A Dossios Legal Services attorney will review it and recommend your strongest path forward."
        buttonLabel="Start My Case"
        buttonHref="/contact"
        secondaryLabel="Schedule a Legal Consultation"
        secondaryHref="/contact"
      />
    </>
  );
}
