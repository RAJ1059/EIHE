import type { Metadata } from "next";
import { AdmissionsHeroSection } from "@/components/sections/admissions/AdmissionsHeroSection";
import { PathwaySection } from "@/components/sections/admissions/PathwaySection";
import { EligibilitySection } from "@/components/sections/admissions/EligibilitySection";
import { AdmissionsGallery } from "@/components/sections/admissions/AdmissionsGallery";
import { AdmissionsTestimonial } from "@/components/sections/admissions/AdmissionsTestimonial";
import { AdmissionsPartnersLogos } from "@/components/sections/admissions/AdmissionsPartnersLogos";

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Navigate EIHE admissions for online medical courses with step-by-step guidance on requirements, applications, and successful enrollment.",
};

export default function AdmissionsPage() {
  return (
    <>
      <AdmissionsHeroSection />
      <PathwaySection />
      <EligibilitySection />
      <AdmissionsGallery />
      <AdmissionsTestimonial />
      <AdmissionsPartnersLogos />
    </>
  );
}
