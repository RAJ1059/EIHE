import type { Metadata } from "next";
import { AudienceProgramHero } from "@/components/sections/programs/AudienceProgramHero";
import { CourseGrid } from "@/components/sections/programs/CourseGrid";
import { dentistsProgram } from "@/data/courses";

export const metadata: Metadata = {
  title: "Programs for Dentists",
  description: dentistsProgram.subtitle,
};

export default function DentistsProgramsPage() {
  return (
    <>
      <AudienceProgramHero program={dentistsProgram} />
      <CourseGrid courses={dentistsProgram.courses} />
    </>
  );
}
