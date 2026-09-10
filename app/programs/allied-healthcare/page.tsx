import type { Metadata } from "next";
import { AudienceProgramHero } from "@/components/sections/programs/AudienceProgramHero";
import { CourseGrid } from "@/components/sections/programs/CourseGrid";
import { alliedProgram } from "@/data/courses";

export const metadata: Metadata = {
  title: "Programs for Allied Healthcare Professionals",
  description: alliedProgram.subtitle,
};

export default function AlliedProgramsPage() {
  return (
    <>
      <AudienceProgramHero program={alliedProgram} />
      <CourseGrid courses={alliedProgram.courses} />
    </>
  );
}
