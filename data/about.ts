import { ClockIcon, EyeIcon, PeopleIcon, ShieldIcon } from "@/components/ui/icons";

// Legacy Dossios content, still used by app/about/page.tsx
export const values = [
  {
    icon: ShieldIcon,
    title: "Licensed Counsel, Always",
    description:
      "Every case is led by a bar-admitted attorney — never a call center script or an unsupervised paralegal.",
  },
  {
    icon: EyeIcon,
    title: "Radical Transparency",
    description:
      "Real-time visibility into your case status, documents, and next steps — no more guessing where things stand.",
  },
  {
    icon: PeopleIcon,
    title: "People First",
    description:
      "We treat every case as a person's future, not a file number — with the same care as day one.",
  },
  {
    icon: ClockIcon,
    title: "Timely & Responsive",
    description:
      "Clear timelines and prompt communication, so you're never left waiting for an update.",
  },
];

export const aboutIntro = {
  title: "About the European Institute for Healthcare Excellence",
};

export const ourStory = {
  eyebrow: "Our Story",
  title:
    "European-standard healthcare education for a global professional community.",
  paragraphs: [
    "EIHE is an international healthcare education institute founded in Europe, dedicated to delivering structured, high-quality educational programs for healthcare professionals worldwide.",
    "EIHE combines European academic principles with global accessibility, offering education that is rigorous, practical, and designed for real-world professional practice.",
  ],
  image: "/images/about/our-story.jpg",
};

export const whoWeAre = {
  title: "Who We Are",
  paragraphs: [
    "EIHE was established to address a growing need for transparent, well-structured, and practice-driven healthcare education in an increasingly global and digital learning environment.",
    "We design and deliver online and blended programs across multiple healthcare disciplines. Our programs are developed for healthcare professionals at different stages of their careers, from early postgraduate education to advanced professional development.",
    "EIHE operates with a strong international orientation, working with faculty, clinicians, and institutional partners across Europe and other regions.",
  ],
  image: "/images/about/who-we-are.webp",
};

export const ourMission = {
  eyebrow: "Our Mission",
  title:
    "Our mission is to raise standards in online healthcare education by integrating:",
  pillars: [
    { icon: "shield" as const, title: "European educational values" },
    { icon: "eye" as const, title: "Academic rigor and transparency" },
    {
      icon: "stethoscope" as const,
      title: "Practical relevance for clinical practice",
    },
    {
      icon: "clock" as const,
      title: "Flexible learning models for working professionals",
    },
  ],
  footer:
    "EIHE aims to support healthcare professionals in their continuous development through education that is ethical, structured, and aligned with international quality expectations.",
};

export const academicModel = {
  title: "Our Academic Model",
  intro:
    "EIHE programs are built on a defined academic framework designed to ensure consistency, relevance, and educational integrity.",
  cards: [
    {
      icon: "compass" as const,
      title: "Defined Learning Objectives",
      description: "Clearly defined learning objectives and curricula.",
    },
    {
      icon: "graduation-cap" as const,
      title: "Faculty-Led Content",
      description:
        "Faculty-led content developed by practicing clinicians and educators.",
    },
    {
      icon: "check" as const,
      title: "Aligned Assessment",
      description:
        "Assessment and evaluation methods aligned with learning outcomes.",
    },
    {
      icon: "laptop" as const,
      title: "Blended Delivery Models",
      description:
        "Blended delivery models combining asynchronous learning with live academic interaction.",
    },
    {
      icon: "briefcase" as const,
      title: "Practical Learning Structures",
      description:
        "Learning structures adapted to the realities of professional clinical practice.",
    },
  ],
  conclusion:
    "Programs are designed to balance flexibility with academic discipline, allowing participants to engage in meaningful learning without compromising professional responsibilities.",
  buttonLabel: "Explore Our Programs",
  buttonHref: "/programs",
};

export const qualityAssuranceAbout = {
  eyebrow: "Quality Assurance",
  title: "Quality Assurance & Transparency",
  pullQuote: "Quality assurance is a central pillar of EIHE's educational philosophy.",
  items: [
    {
      icon: "eye" as const,
      text: "EIHE is committed to transparency by making key quality metrics, student satisfaction data, and academic policies publicly available, fostering trust and information clarity.",
    },
    {
      icon: "shield" as const,
      text: "This approach allows prospective learners and stakeholders to understand the rigor of our programs and ensures that academic standards are upheld consistently across programs.",
    },
    {
      icon: "clock" as const,
      text: "EIHE views quality assurance as a dynamic, ongoing process of self-reflection and enhancement, rather than a static, one-time certification.",
    },
  ],
};

export const facultyLeadership = {
  title: "Faculty & Academic Leadership",
  subtitle:
    "EIHE programs are developed and delivered by an international faculty of healthcare professionals and academic educators. Faculty members are selected based on:",
  criteria: [
    {
      icon: "stethoscope" as const,
      text: "Active clinical practice or relevant professional expertise",
    },
    { icon: "graduation-cap" as const, text: "Teaching and academic experience" },
    {
      icon: "shield" as const,
      text: "Alignment with EIHE's educational values and standards",
    },
  ],
  footer:
    "Faculty involvement may include curriculum development, live teaching sessions, recorded lectures, mentoring, and academic oversight. This ensures that our programs remain clinically relevant, academically sound, and internationally informed.",
  buttonLabel: "Meet our Faculty",
  buttonHref: "/our-faculty",
};

export const offersVsNot = {
  title: "What EIHE Offers — and What It Does Not",
  offers: {
    label: "What EIHE Offers",
    paragraphs: [
      "EIHE provides education, training, and professional development programs for healthcare professionals and students.",
      "EIHE certifications confirm the successful completion of educational programs aligned with defined academic and quality standards. They reflect learning outcomes and professional development achievements.",
    ],
  },
  doesNot: {
    label: "What EIHE Does Not Offer",
    paragraphs: [
      "EIHE programs do not replace national licensing, professional registration, or regulatory authorization required to practice healthcare in any jurisdiction.",
      "All participants remain responsible for complying with the legal and professional requirements applicable in their country or region.",
    ],
  },
};

export const whoWeWorkWith = {
  title: "Who We Work With",
  groups: [
    { icon: "stethoscope" as const, title: "Medical Doctors" },
    { icon: "heart-pulse" as const, title: "Nurses & Allied Professionals" },
    { icon: "tooth" as const, title: "Dentists" },
    { icon: "graduation-cap" as const, title: "Healthcare Students" },
    { icon: "clinic" as const, title: "Clinics, Hospitals & Institutions" },
  ],
  footerBefore: "Our programs are designed to support both ",
  footerBold1: "individual learners",
  footerMiddle: " and ",
  footerBold2: "institutional partners",
  footerAfter:
    " through education, collaboration, and workforce development initiatives.",
};
