import type { Metadata } from "next";
import { HomeFaqSection } from "@/components/sections/HomeFaqSection";
import { FaqTestimonialSection } from "@/components/sections/faqs/FaqTestimonialSection";
import { AdmissionsPartnersLogos } from "@/components/sections/admissions/AdmissionsPartnersLogos";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Frequently asked questions about EIHE's programs, fees, admissions, and certifications.",
};

export default function FaqsPage() {
  return (
    <>
      <HomeFaqSection />
      <FaqTestimonialSection />
      <AdmissionsPartnersLogos />
    </>
  );
}
