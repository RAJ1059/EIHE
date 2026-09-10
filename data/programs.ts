export const programsHero = {
  title: "Explore Programs by Professional Profile",
  highlight: "Explore",
  description:
    "At EIHE, our programs are designed around who you are as a healthcare professional — your background, scope of practice, and career goals. Whether you are advancing your clinical expertise, expanding into aesthetic medicine, or building a long-term professional pathway, our programs combine European academic standards, international faculty, and flexible learning formats adapted to real clinical practice. Select your professional category to explore tailored programs:",
  image: "/images/programs/hero-banner.webp",
};

export const pathwaysIntro = {
  eyebrow: "Program Pathways",
  title: "Programs by Professional Background",
  description:
    "Discover tailored academic journeys and specialized training opportunities designed for your healthcare profession.",
};

export const pathways = [
  {
    id: "doctors",
    icon: "stethoscope" as const,
    title: "Programs for Doctors",
    description:
      "Designed for MBBS and equivalent medical graduates seeking structured postgraduate training, clinical upskilling, or specialization pathways.",
    bullets: [
      "Master's and postgraduate diploma programs",
      "Modular certifications",
      "Evidence-based, practice-oriented training",
      "Optional hands-on workshops and fellowships",
    ],
    idealFor:
      "General practitioners, specialists, aesthetic physicians, hospital doctors, and clinic owners.",
    href: "/programs/doctors",
  },
  {
    id: "dentists",
    icon: "tooth" as const,
    title: "Programs for Dentists",
    description:
      "Programs adapted to dental training and scope of practice, with a strong focus on facial anatomy, safety, and interdisciplinary care.",
    bullets: [
      "Implantology courses",
      "Perioral and lower-face specialization",
      "Integrated medical–dental aesthetic approaches",
      "European-standard certification pathways",
    ],
    idealFor: "Dentists, oral surgeons, and maxillofacial specialists.",
    href: "/programs/dentists",
  },
  {
    id: "nurses",
    icon: "heart-pulse" as const,
    title: "Programs for Nurses",
    description:
      "Programs designed to enhance clinical competencies, procedural knowledge, and patient safety within regulated nursing practice.",
    bullets: [
      "Aesthetic nursing programs and certifications",
      "Peri-procedural and patient management training",
      "Regenerative and supportive aesthetic techniques",
      "Strong emphasis on ethics and safety",
    ],
    idealFor: "Registered nurses, aesthetic nurses, and surgical assistants.",
    href: "/programs/nurses",
  },
  {
    id: "allied",
    icon: "briefcase" as const,
    title: "Allied Health Professionals",
    description:
      "Programs designed for professionals working in health, wellness, and clinical support roles who seek formal, high-quality training.",
    bullets: [
      "Soft-skills for the healthcare professionals",
      "Interdisciplinary and multidisciplinary training",
      "Clinical management and leadership",
      "Flexible, modular certifications",
    ],
    idealFor:
      "Physiotherapists, pharmacists, nutritionists, biologists, biomedical scientists, and other allied professionals.",
    href: "/programs/allied-healthcare",
  },
  {
    id: "students",
    icon: "graduation-cap" as const,
    title: "Programs for Students",
    description:
      "Early-stage training designed to build strong academic and clinical foundations, and to support informed career decisions.",
    bullets: [
      "Introductory and foundation programs",
      "Academic exposure to healthcare management and leadership",
      "Mentored learning and career orientation",
      "Certificates aligned with European standards",
    ],
    idealFor: "Medical, dental, nursing, and health sciences students.",
    href: "/programs/students",
  },
];

export const advisorBanner = {
  title: "Not Sure Which Program Is Right for You?",
  description:
    "Our Academic Advisors can help you explore your options and answer your questions.",
  buttonLabel: "Request a Call",
  buttonHref: "/contact",
};

export const differentSection = {
  title: "Why EIHE Programs Are Different",
  items: [
    { icon: "shield" as const, text: "European academic standards and quality assurance" },
    {
      icon: "graduation-cap" as const,
      text: "International faculty with active clinical practice",
    },
    { icon: "clock" as const, text: "Modular, flexible learning for working professionals" },
    { icon: "eye" as const, text: "Transparent certification and progression pathways" },
    {
      icon: "clinic" as const,
      text: "Optional in-person training through partner clinics",
    },
  ],
};

export const programsFaqs = [
  {
    question: "What types of medical courses does EIHE offer?",
    answer:
      "EIHE offers a range of programs in healthcare management, clinical ethics, digital health, public health policy, and quality improvement, tailored for professionals at all levels.",
  },
  {
    question: "Are the courses online or in-person?",
    answer:
      "All EIHE courses are delivered fully online, with a blend of live sessions, recorded lectures, and interactive materials designed for flexible, self-paced learning.",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer:
      "Yes, upon successful completion of any course, students receive a certificate recognized across European and international healthcare institutions.",
  },
  {
    question: "Are there any prerequisites to enroll?",
    answer:
      "Most courses are open to medical and healthcare professionals. However, advanced programs may require prior qualifications or experience in a related field.",
  },
  {
    question: "How do I apply for a course?",
    answer:
      "You can apply directly on EIHE's official website. Just sign up, browse available programs, and enroll in the course of your choice with a few simple steps.",
  },
];
