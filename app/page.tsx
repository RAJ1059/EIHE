import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { MissionSection } from "@/components/sections/MissionSection";
import { AudienceSection } from "@/components/sections/AudienceSection";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { WhyLearnSection } from "@/components/sections/WhyLearnSection";
import { FacultySection } from "@/components/sections/FacultySection";
import { LearningJourneySection } from "@/components/sections/LearningJourneySection";
import { PartnersSection } from "@/components/sections/PartnersSection";
import { QualityAssuranceSection } from "@/components/sections/QualityAssuranceSection";
import { CommunitySection } from "@/components/sections/CommunitySection";
import { PartnerInstitutionsSection } from "@/components/sections/PartnerInstitutionsSection";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";

export const metadata: Metadata = {
  title: {
    absolute:
      "European Institute For Healthcare Excellence | European-Standard Medical Education",
  },
  description:
    "EIHE designs and delivers European-aligned healthcare education, certifications, and institutional training programs for students, professionals, clinics and healthcare organizations worldwide.",
  openGraph: {
    type: "website",
    title: "European Institute For Healthcare Excellence",
    description:
      "Practice-oriented medical education, joint certifications, and institutional training programs aligned with European standards.",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <AudienceSection />
      <PartnersSection />
      <WhyLearnSection />
      <FacultySection />
      <LearningJourneySection />
      <MissionSection />
      <ProgramsSection />
      <QualityAssuranceSection />
      <CommunitySection />
      <PartnerInstitutionsSection />
      <HomeFaqSection />
    </>
  );
}
