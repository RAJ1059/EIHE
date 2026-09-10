import type { Metadata } from "next";
import { AudienceProgramHero } from "@/components/sections/programs/AudienceProgramHero";
import { CourseGrid } from "@/components/sections/programs/CourseGrid";
import { studentsProgram } from "@/data/courses";

export const metadata: Metadata = {
  title: "Programs for Students",
  description: studentsProgram.subtitle,
};

export default function StudentsProgramsPage() {
  return (
    <>
      <AudienceProgramHero program={studentsProgram} />
      <CourseGrid courses={studentsProgram.courses} />
    </>
  );
}
