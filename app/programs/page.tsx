import type { Metadata } from "next";
import { ProgramsHeroSection } from "@/components/sections/programs/ProgramsHeroSection";
import { PathwaysSection } from "@/components/sections/programs/PathwaysSection";
import { AdvisorBanner } from "@/components/sections/programs/AdvisorBanner";
import { DifferentSection } from "@/components/sections/programs/DifferentSection";
import { ProgramsFaqSection } from "@/components/sections/programs/ProgramsFaqSection";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore EIHE programs by professional profile — for doctors, dentists, nurses, allied health professionals, and students.",
};

export default function ProgramsPage() {
  return (
    <>
      <ProgramsHeroSection />
      <PathwaysSection />
      <AdvisorBanner />
      <DifferentSection />
      <ProgramsFaqSection />
    </>
  );
}
