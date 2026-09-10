import type { Metadata } from "next";
import { AudienceProgramHero } from "@/components/sections/programs/AudienceProgramHero";
import { CourseGrid } from "@/components/sections/programs/CourseGrid";
import { nursesProgram } from "@/data/courses";

export const metadata: Metadata = {
  title: "Programs for Nurses",
  description: nursesProgram.subtitle,
};

export default function NursesProgramsPage() {
  return (
    <>
      <AudienceProgramHero program={nursesProgram} />
      <CourseGrid courses={nursesProgram.courses} />
    </>
  );
}
