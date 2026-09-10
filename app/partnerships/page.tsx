import type { Metadata } from "next";
import { PartnershipsHeroSection } from "@/components/sections/partnerships/PartnershipsHeroSection";
import { PartnershipCardsSection } from "@/components/sections/partnerships/PartnershipCardsSection";
import { PartnershipsQuoteSection } from "@/components/sections/partnerships/PartnershipsQuoteSection";
import { PartnerInstitutionsSection } from "@/components/sections/PartnerInstitutionsSection";

export const metadata: Metadata = {
  title: "Partnerships",
  description:
    "EIHE works in collaboration with institutions, clinics, professionals, and organizations that share a commitment to high-quality healthcare education.",
};

export default function PartnershipsPage() {
  return (
    <>
      <PartnershipsHeroSection />
      <PartnershipCardsSection />
      <PartnershipsQuoteSection />
      <PartnerInstitutionsSection />
    </>
  );
}
