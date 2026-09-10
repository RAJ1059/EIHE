import type { Metadata } from "next";
import { FacultyHeroSection } from "@/components/sections/faculty/FacultyHeroSection";
import { FacultyListSection } from "@/components/sections/faculty/FacultyListSection";
import { SocietiesSection } from "@/components/sections/faculty/SocietiesSection";
import { JoinFacultySection } from "@/components/sections/faculty/JoinFacultySection";

export const metadata: Metadata = {
  title: "Our Faculty",
  description:
    "EIHE is guided by a multidisciplinary leadership team and an international faculty of practicing healthcare professionals and educators.",
};

export default function OurFacultyPage() {
  return (
    <>
      <FacultyHeroSection />
      <FacultyListSection />
      <SocietiesSection />
      <JoinFacultySection />
    </>
  );
}
