import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { OurStorySection } from "@/components/sections/about/OurStorySection";
import { WhoWeAreSection } from "@/components/sections/about/WhoWeAreSection";
import { OurMissionSection } from "@/components/sections/about/OurMissionSection";
import { AcademicModelSection } from "@/components/sections/about/AcademicModelSection";
import { AboutQualitySection } from "@/components/sections/about/AboutQualitySection";
import { FacultyLeadershipSection } from "@/components/sections/about/FacultyLeadershipSection";
import { OffersVsNotSection } from "@/components/sections/about/OffersVsNotSection";
import { WhoWeWorkWithSection } from "@/components/sections/about/WhoWeWorkWithSection";
import { aboutIntro } from "@/data/about";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "EIHE is an international healthcare education institute founded in Europe, delivering structured, high-quality educational programs for healthcare professionals worldwide.",
};

export default function AboutUsPage() {
  return (
    <>
      <PageHero eyebrow="About EIHE" title={aboutIntro.title} />
      <OurStorySection />
      <WhoWeAreSection />
      <OurMissionSection />
      <AcademicModelSection />
      <AboutQualitySection />
      <FacultyLeadershipSection />
      <OffersVsNotSection />
      <WhoWeWorkWithSection />
    </>
  );
}
