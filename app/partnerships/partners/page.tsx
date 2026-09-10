import type { Metadata } from "next";
import { PartnersIntroSection } from "@/components/sections/partnerships/PartnersIntroSection";
import { PartnersDirectoryGrid } from "@/components/sections/partnerships/PartnersDirectoryGrid";
import { PartnersTestimonialSection } from "@/components/sections/partnerships/PartnersTestimonialSection";
import { AdmissionsPartnersLogos } from "@/components/sections/admissions/AdmissionsPartnersLogos";

export const metadata: Metadata = {
  title: "Our Partners & Collaborators",
  description:
    "EIHE collaborates with a growing network of clinics, healthcare professionals, academic contributors, and organizations that share a commitment to high-quality education.",
};

export default function OurPartnersPage() {
  return (
    <>
      <PartnersIntroSection />
      <PartnersDirectoryGrid />
      <PartnersTestimonialSection />
      <AdmissionsPartnersLogos />
    </>
  );
}
