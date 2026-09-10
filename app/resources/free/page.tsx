import type { Metadata } from "next";
import { ResourcesIntroSection } from "@/components/sections/resources/ResourcesIntroSection";
import { PillarsSection } from "@/components/sections/resources/PillarsSection";
import { AudienceResourcesSection } from "@/components/sections/resources/AudienceResourcesSection";

export const metadata: Metadata = {
  title: "Free Resources",
  description:
    "EIHE provides selected educational resources to support continuous learning, critical thinking, and informed decision-making in healthcare and aesthetic medicine.",
};

export default function FreeResourcesPage() {
  return (
    <>
      <ResourcesIntroSection />
      <PillarsSection />
      <AudienceResourcesSection />
    </>
  );
}
