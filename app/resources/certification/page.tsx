import type { Metadata } from "next";
import { CertHeroSection } from "@/components/sections/certification/CertHeroSection";
import { CertRepresentsSection } from "@/components/sections/certification/CertRepresentsSection";
import { CertAwardsSection } from "@/components/sections/certification/CertAwardsSection";
import { CertMockupsSection } from "@/components/sections/certification/CertMockupsSection";
import { LearningOutcomesSection } from "@/components/sections/certification/LearningOutcomesSection";
import { StudentSupportSection } from "@/components/sections/certification/StudentSupportSection";

export const metadata: Metadata = {
  title: "Certification & Recognition",
  description:
    "EIHE programs are developed under European educational quality principles, with certifications designed to validate structured postgraduate learning and professional development.",
};

export default function CertificationPage() {
  return (
    <>
      <CertHeroSection />
      <CertRepresentsSection />
      <CertAwardsSection />
      <CertMockupsSection />
      <LearningOutcomesSection />
      <StudentSupportSection />
    </>
  );
}
