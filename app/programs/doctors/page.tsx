import type { Metadata } from "next";
import { AudienceProgramHero } from "@/components/sections/programs/AudienceProgramHero";
import { CourseGrid } from "@/components/sections/programs/CourseGrid";
import { doctorsProgram } from "@/data/courses";

export const metadata: Metadata = {
  title: "Programs for Doctors",
  description: doctorsProgram.subtitle,
};

export default function DoctorsProgramsPage() {
  return (
    <>
      <AudienceProgramHero program={doctorsProgram} />
      <CourseGrid courses={doctorsProgram.courses} />
    </>
  );
}
