export type Course = {
  title: string;
  description: string;
  image: string;
  href?: string;
  badgeImage?: string;
  /** True for a course that's announced but not open yet — its dedicated page shows a "Coming Soon" status instead of enrollment. */
  comingSoon?: boolean;
};

export type AudienceProgramPage = {
  title: string;
  highlight: string;
  subtitle: string;
  features: string[];
  heroImage: string;
  courses: Course[];
};

export const doctorsProgram: AudienceProgramPage = {
  title: "Programs for Doctors",
  highlight: "Doctors",
  subtitle:
    "European-standard education designed for your professional background, scope of practice, and career goals.",
  features: [
    "European faculty",
    "Flexible online learning",
    "Optional hands-on training",
    "European certification",
  ],
  heroImage: "/images/programs/doctors-hero.jpg",
  courses: [
    {
      title: "Communication Excellence in Healthcare",
      description:
        "Boost your healthcare communication skills with this CPD-accredited course. Master patient interaction, teamwork, and professional strategies to improve care quality and outcomes.",
      image: "/images/courses/course1.webp",
      href: "/programs/doctors/communication-excellence-in-healthcare",
    },
    {
      title: "Master's Degree in Aesthetic Medicine",
      description:
        "Structured, practice-oriented training in aesthetic medicine. It combines foundational science, advanced clinical techniques, and practice management under European academic and quality standards.",
      image: "/images/courses/course2.webp",
      href: "/programs/doctors/masters-degree-in-aesthetic-medicine",
      badgeImage: "/images/courses/arp-seal.png",
    },
    {
      title: "Foundations of Aesthetic Medicine",
      description:
        "A comprehensive introduction to aesthetic medicine, covering its principles, ethical framework, patient assessment, anatomy, and clinical decision-making.",
      image: "/images/courses/course3.webp",
      href: "/programs/doctors/foundations-of-aesthetic-medicine",
    },
    {
      title: "Peelings & Mesotherapy in Clinical Practice",
      description:
        "Focused training, including skin assessment, product selection, protocols, indications, contraindications, and post-treatment care. Emphasis on safety, outcomes, and evidence-based practice.",
      image: "/images/courses/course4.webp",
      href: "/programs/doctors/peeling-mesotherapy",
    },
    {
      title: "Injectables & Threads",
      description:
        "In-depth training in injectable treatments and thread lifting, covering facial anatomy, product selection, injection techniques, complication management, and advanced safety considerations.",
      image: "/images/courses/course5.webp",
      href: "/programs/doctors/injectables-threads",
    },
    {
      title: "Medical Aesthetics & Body Treatments",
      description:
        "A multidisciplinary module addressing anti-aging medicine, obesity and localized fat, connective tissue disorders, vascular conditions and minor surgical procedures in aesthetic practice.",
      image: "/images/courses/course6.webp",
      href: "/programs/doctors/medical-aesthetics-body-treatments",
    },
    {
      title: "Energy-Based Devices in Aesthetic Medicine",
      description:
        "Comprehensive overview, including lasers, radiofrequency, ultrasound, and other technologies. Covers mechanisms of action, patient selection, treatment protocols, and safety considerations.",
      image: "/images/courses/course7.webp",
      href: "/programs/doctors/energy-based-devices-in-aesthetic-medicine",
    },
    {
      title: "Hair, Pigmentation and Intimate Aesthetics",
      description:
        "Specialized training in alopecia and hair transplantation, hair removal techniques, pigmentation disorders, and intimate aesthetics. Focuses on diagnosis, treatment planning, and integrated approaches.",
      image: "/images/courses/course8.webp",
      href: "/programs/doctors/hair-pigmentation-and-intimate-aesthetics",
    },
    {
      title: "Advanced Aesthetic Medicine & Practice Management",
      description:
        "An advanced module covering multimodal aesthetic protocols, treatment planning, complication management, and the strategic, legal, and ethical aspects of running an aesthetic medical practice.",
      image: "/images/courses/course9.webp",
      href: "/programs/doctors/advanced-aesthetic-medicine-practice-management",
    },
  ],
};

export const dentistsProgram: AudienceProgramPage = {
  title: "Programs for Dentists",
  highlight: "Dentists",
  subtitle:
    "European-standard education designed for your professional background, scope of practice, and career goals.",
  features: [
    "European faculty",
    "Flexible online learning",
    "Optional hands-on training",
    "European certification",
  ],
  heroImage: "/images/programs/dentists-hero.webp",
  courses: [
    {
      title: "Periodontics for Daily Practice",
      description:
        "The Periodontics for Daily Practice course is a practical program designed to help general dentists confidently incorporate evidence-based periodontal care into their daily clinical practice.",
      image: "/images/courses/dentist-periodontics.jpg",
      href: "/programs/dentists/periodontics-for-daily-practice",
    },
    {
      title: "CBCT for General Dentists",
      description:
        "A practical online course designed for General Dentists to develop confidence in CBCT interpretation, diagnosis, and treatment planning using real clinical cases and evidence-based protocols.",
      image: "/images/courses/dentist-cbct.jpg",
      href: "/programs/dentists/cbct-for-general-dentists",
    },
    {
      title: "Implant Essentials for General Dentists",
      description:
        "A practical online course that teaches General Dentists the fundamentals of implant dentistry, including diagnosis, treatment planning, surgical concepts, prosthetic restorations, and maintenance using real clinical cases.",
      image: "/images/courses/dentist-implant.jpg",
      href: "/programs/dentists/implant-essentials-for-general-dentists",
    },
  ],
};

export const nursesProgram: AudienceProgramPage = {
  title: "Programs for Nurses",
  highlight: "Nurses",
  subtitle:
    "European-standard education designed for your professional background, scope of practice, and career goals.",
  features: [
    "European faculty",
    "Flexible online learning",
    "Optional hands-on training",
    "European certification",
  ],
  heroImage: "/images/programs/nurses-hero.webp",
  courses: [
    {
      title: "Communication Excellence in Healthcare",
      description:
        "Boost your healthcare communication skills with this CPD-accredited course. Master patient interaction, teamwork, and professional strategies to improve care quality and outcomes.",
      image: "/images/courses/course1.webp",
      href: "/programs/doctors/communication-excellence-in-healthcare",
    },
    {
      title: "New Courses Coming Soon",
      description:
        "We are currently developing a new suite of courses designed to help you advance your skills and reach your goals. New courses are coming soon. Keep an eye out for updates!",
      image: "/images/courses/course2.webp",
      href: "/programs/nurses/new-courses-coming-soon",
      comingSoon: true,
    },
  ],
};

export const alliedProgram: AudienceProgramPage = {
  title: "Programs for Allied Healthcare Professionals",
  highlight: "Allied Healthcare Professionals",
  subtitle:
    "European-standard education designed for your professional background, scope of practice, and career goals.",
  features: [
    "European faculty",
    "Flexible online learning",
    "Optional hands-on training",
    "European certification",
  ],
  heroImage: "/images/programs/allied-hero.webp",
  courses: [
    {
      title: "Communication Excellence in Healthcare",
      description:
        "Boost your healthcare communication skills with this CPD-accredited course. Master patient interaction, teamwork, and professional strategies to improve care quality and outcomes.",
      image: "/images/courses/course1.webp",
      href: "/programs/doctors/communication-excellence-in-healthcare",
    },
    {
      title: "New Courses Coming Soon",
      description:
        "We are currently developing a new suite of courses designed to help you advance your skills and reach your goals. New courses are coming soon. Keep an eye out for updates!",
      image: "/images/courses/course2.webp",
      href: "/programs/allied-healthcare/new-courses-coming-soon",
      comingSoon: true,
    },
  ],
};

export const studentsProgram: AudienceProgramPage = {
  title: "Programs for Students",
  highlight: "Students",
  subtitle:
    "European-standard education designed for your professional background, scope of practice, and career goals.",
  features: [
    "European faculty",
    "Flexible online learning",
    "Optional hands-on training",
    "European certification",
  ],
  heroImage: "/images/programs/students-hero.webp",
  courses: [
    {
      title: "Communication Excellence in Healthcare",
      description:
        "Boost your healthcare communication skills with this CPD-accredited course. Master patient interaction, teamwork, and professional strategies to improve care quality and outcomes.",
      image: "/images/courses/course1.webp",
      href: "/programs/doctors/communication-excellence-in-healthcare",
    },
    {
      title: "New Courses Coming Soon",
      description:
        "We are currently developing a new suite of courses designed to help you advance your skills and reach your goals. New courses are coming soon. Keep an eye out for updates!",
      image: "/images/courses/course2.webp",
      href: "/programs/students/new-courses-coming-soon",
      comingSoon: true,
    },
  ],
};

// Keyed by the URL segment used under /programs/[audience]/..., so a course
// detail page can resolve `audience` from the route back to its dataset.
export const programsByAudience: Record<string, AudienceProgramPage> = {
  doctors: doctorsProgram,
  dentists: dentistsProgram,
  nurses: nursesProgram,
  "allied-healthcare": alliedProgram,
  students: studentsProgram,
};
