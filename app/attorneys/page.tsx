import type { Metadata } from "next";
import { AttorneyHero } from "@/components/sections/AttorneyHero";
import { StatsBar } from "@/components/sections/StatsBar";
import { AttorneyRoster } from "@/components/sections/AttorneyRoster";
import { HowWeWorkSection } from "@/components/sections/HowWeWorkSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASection } from "@/components/sections/CTASection";
import { attorneyFaqs } from "@/data/attorneys";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: "Our Attorneys | Dossios" },
  description:
    "Meet the licensed immigration attorneys on the Dossios Legal Services panel — the counsel who review, strategize, and personally sign every filing.",
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/attorneys`,
    title: "Our Attorneys | Dossios",
    description:
      "Every Dossios case is led by a licensed, practicing immigration attorney. Meet the panel.",
    siteName: siteConfig.name,
    images: [siteConfig.ogImage],
  },
};

export default function AttorneysPage() {
  return (
    <>
      <AttorneyHero />
      <StatsBar />
      <AttorneyRoster />
      <HowWeWorkSection />
      <FaqSection
        eyebrow="FAQ"
        title="Questions about the panel"
        description="Straightforward answers about who handles your case and how the panel is licensed."
        items={attorneyFaqs}
      />
      <CTASection
        id="start"
        title="Ready to see exactly where your case stands?"
        description="Tell us your story. A Dossios Legal Services attorney will review it and recommend your strongest path forward."
        buttonLabel="Start My Case"
        buttonHref="/contact"
        secondaryLabel="Schedule a Legal Consultation"
        secondaryHref="/contact"
      />
    </>
  );
}
