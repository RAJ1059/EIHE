export const stats = [
  {
    num: "26+ yrs",
    label: "Heritage rooted in Bay Area Immigration Services",
  },
  {
    num: "4.4★ / 208",
    label: "Google reviews for Bay Area Immigration Services",
  },
  {
    num: "8",
    label: "Licensed attorneys on the Dossios Legal Services panel",
  },
  {
    num: "100%",
    label: "Filings reviewed and signed by a licensed attorney",
  },
];

export const whyItems = [
  {
    num: "01",
    title: "A clear strategy, from day one",
    description:
      "Every case starts with a licensed Dossios Legal Services attorney reviewing your facts and recommending the strongest path — not a generic checklist.",
  },
  {
    num: "02",
    title: "Real-time visibility into your case",
    description:
      "Log into your client portal anytime to see task status, documents, and what's happening with your file — no more guessing.",
  },
  {
    num: "03",
    title: "One team, start to finish",
    description:
      "Your intake specialist, production team, and legal counsel stay connected on a single file, so your case never loses context between hand-offs.",
  },
  {
    num: "04",
    title: "Built on real experience",
    description:
      "Dossios is built on 26+ years and 208 Google reviews at a 4.4-star average, earned by Bay Area Immigration Services — long-standing local trust, now paired with modern legal technology.",
  },
];

export const audiences = [
  {
    id: "doctors",
    icon: "stethoscope" as const,
    title: "Medical Doctors",
    description: "Postgraduate education, specialization & CPD.",
    linkLabel: "Know more",
    href: "/programs/doctors",
  },
  {
    id: "dentists",
    icon: "tooth" as const,
    title: "Dentists",
    description: "Advanced and interdisciplinary training.",
    linkLabel: "Know more",
    href: "/programs/dentists",
  },
  {
    id: "nurses",
    icon: "heart-pulse" as const,
    title: "Nurses & Allied Health Professionals",
    description: "Professional development & role expansion.",
    linkLabel: "Know more",
    href: "/programs/nurses",
  },
  {
    id: "students",
    icon: "graduation-cap" as const,
    title: "Healthcare Students",
    description: "Foundational education & early exposure.",
    linkLabel: "Know more",
    href: "/programs/students",
  },
  {
    id: "clinics",
    icon: "clinic" as const,
    title: "Clinics & Institutions",
    description: "Workforce training & educational partnerships.",
    linkLabel: "Know more",
    href: "/partnerships",
  },
];

export const coverageColumns = [
  {
    title: "High-Skill & Extraordinary Ability",
    items: [
      { label: "Extraordinary ability", tag: "O-1A" },
      { label: "Extraordinary ability green card", tag: "EB-1A" },
      { label: "Outstanding researcher/professor", tag: "EB-1B" },
      { label: "National interest waiver", tag: "EB-2 NIW" },
      { label: "Immigrant investor", tag: "EB-5" },
    ],
  },
  {
    title: "Employment & Sponsorship",
    items: [
      { label: "Specialty occupation", tag: "H-1B" },
      { label: "Intracompany transfer, exec/manager", tag: "L-1A" },
      { label: "Intracompany transfer, specialized", tag: "L-1B" },
      { label: "Multinational manager green card", tag: "EB-1C" },
      { label: "Treaty investor", tag: "E-2" },
    ],
  },
  {
    title: "Family & Citizenship",
    items: [
      { label: "Family-based green cards", tag: "I-130 / I-485" },
      { label: "Adjustment of status", tag: "I-485" },
      { label: "Consular processing", tag: "DS-260" },
      { label: "Naturalization & citizenship", tag: "N-400" },
      { label: "RFE & NOID response strategy", tag: "All categories" },
    ],
  },
];

export const processSteps = [
  {
    num: "01",
    title: "Tell us your story",
    description:
      "A Dossios intake specialist gathers the facts about your background, goals, and timeline.",
  },
  {
    num: "02",
    title: "Attorney strategy review",
    description:
      "A Dossios Legal Services lawyer reviews your case and recommends the strongest path forward.",
  },
  {
    num: "03",
    title: "Retainer & preparation",
    description:
      "Once you engage counsel, our production team prepares forms and evidence under direct legal supervision.",
  },
  {
    num: "04",
    title: "Final legal review",
    description:
      "Your attorney reviews the completed package line by line and routes any corrections back to production.",
  },
  {
    num: "05",
    title: "Approval & filing",
    description:
      "You give final sign-off, and your attorney of record authorizes and signs the filing.",
  },
];

export const platformFeatures = [
  {
    title: "Guided intake",
    description:
      "A smart questionnaire tailored to your visa category collects the right facts the first time — no generic forms.",
  },
  {
    title: "Document checklist & e-signature",
    description:
      "Upload, sign, and track every required document in one secure place, with clear status on what's still needed.",
  },
  {
    title: "Real-time case timeline",
    description:
      "See your case status, tasks, and next steps update as your case team makes progress.",
  },
  {
    title: "Secure messaging",
    description:
      "Message your case team directly, with every conversation attached to your file for a clear record.",
  },
];

export const portalTimeline = [
  {
    title: "Intake call completed",
    sub: "Reviewed by case team",
    when: "Wk 1",
    state: "done" as const,
  },
  {
    title: "Attorney strategy set",
    sub: "O-1A recommended",
    when: "Wk 2",
    state: "done" as const,
  },
  {
    title: "Retainer signed",
    sub: "Production started",
    when: "Wk 2",
    state: "done" as const,
  },
  {
    title: "Evidence package in review",
    sub: "2 documents pending upload",
    when: "Now",
    state: "current" as const,
  },
  {
    title: "Final legal review",
    sub: "Not started",
    when: "Next",
    state: "pending" as const,
  },
];

export const faqs = [
  {
    question: "Is Dossios a law firm?",
    answer:
      "No. Dossios Inc. provides technology and case-support services and is not a law firm. Legal services are provided by Dossios Legal Services, a California professional corporation, and other independent licensed counsel.",
  },
  {
    question: "Who actually reviews and signs my case?",
    answer:
      "A licensed attorney from the Dossios Legal Services panel reviews your case at intake, reviews the completed filing package, and personally authorizes and signs every submission.",
  },
  {
    question: "What technology do you use to manage my case?",
    answer:
      "Every Dossios case runs on a dedicated case management platform — a client portal, document checklist, e-signature, and real-time timeline so you always know where your case stands.",
  },
  {
    question: "How much does it cost?",
    answer:
      "Legal fees are flat and outlined in writing before you engage counsel; government filing fees are separate and paid directly to USCIS. Your attorney will walk you through exact fees for your case type during your strategy review.",
  },
  {
    question: "Which states do you serve?",
    answer:
      "Immigration is federal law. Licensed attorneys on our panel can represent clients before USCIS regardless of where you live, subject to standard bar and case-specific requirements.",
  },
];

// --- EIHE homepage content below ---

export const mission = {
  eyebrow: "OUR MISSION",
  title: "Advancing Healthcare Professionals through European-Standard Education",
  description:
    "EIHE designs and delivers European-aligned healthcare education, certifications, and institutional training programs for students, professionals, clinics and healthcare organizations worldwide.",
  primaryLabel: "EXPLORE PROGRAMS",
  primaryHref: "/programs",
  secondaryLabel: "PARTNER WITH EIHE",
  secondaryHref: "/partnerships",
};

export const whyLearnItems = [
  {
    icon: "laptop" as const,
    title: "Flexible Learning Models",
    description:
      "100% online, hybrid or onsite programs, without compromising academic rigor.",
  },
  {
    icon: "shield" as const,
    title: "European Certification",
    description:
      "Programs designed and delivered with EU training standards, leading to a European Certificate.",
  },
  {
    icon: "lightbulb" as const,
    title: "Practice-Driven Education",
    description:
      "Clinically relevant training focused on real-world application, at your own pace.",
  },
  {
    icon: "clinic" as const,
    title: "For Individuals & Institutions",
    description:
      "Free and paid courses, as well as customized training solutions and workshops.",
  },
];

export const programsCards = [
  {
    id: "doctors",
    icon: "stethoscope" as const,
    title: "Doctors",
    description:
      "European-standard postgraduate programs, certifications, and advanced courses designed for medical doctors seeking clinical excellence, specialization, and international exposure.",
    href: "/programs/doctors",
  },
  {
    id: "nurses",
    icon: "person" as const,
    title: "Nurses",
    description:
      "Practice-oriented education and certification programs supporting nurses in skill enhancement, role expansion, and leadership within modern healthcare systems.",
    href: "/programs/nurses",
  },
  {
    id: "dentists",
    icon: "tooth" as const,
    title: "Dentists",
    description:
      "Specialized programs for dental professionals focused on clinical advancement and interdisciplinary training aligned with European educational standards.",
    href: "/programs/dentists",
  },
  {
    id: "allied",
    icon: "briefcase" as const,
    title: "Other Healthcare Professionals",
    description:
      "Continuing professional development programs for allied healthcare professionals (physiotherapists, pharmacists, psychologists...), designed to strengthen clinical practice, communication, and system-based care.",
    href: "/programs/allied-healthcare",
  },
  {
    id: "students",
    icon: "graduation-cap" as const,
    title: "Students",
    description:
      "Structured educational pathways for healthcare students seeking early exposure to European-aligned training, professional skills, and future specialization.",
    href: "/programs/students",
  },
];

export const programsFootnote =
  "Programs are delivered through flexible online or hybrid formats and designed to be compatible with academic studies or clinical practice.";

export const learningJourneySteps = [
  {
    num: 1,
    icon: "person" as const,
    title: "Create your EIHE profile",
    description:
      "Register as a healthcare professional and access our learning platform. You will be invited to join our members-only LinkedIn group.",
  },
  {
    num: 2,
    icon: "calendar" as const,
    title: "Select Course",
    description:
      "Choose from structured courses and programs aligned with European training standards.",
  },
  {
    num: 3,
    icon: "chevron-right" as const,
    title: "Learn through structured, practice-driven content",
    description:
      "Access lectures, clinical insights and case-based learning designed by active European clinicians.",
  },
  {
    num: 4,
    icon: "credit-card" as const,
    title: "Earn a European Certificate",
    description:
      "Receive certificates of completion and joint certifications aligned with European academic frameworks.",
  },
];

export const learningJourneyFootnote =
  "Programs are designed for working healthcare professionals and can be completed alongside clinical practice.";

export const partnerClinics = [
  {
    name: "Torres Carranza",
    location: "Seville, Spain",
    logo: "/images/partners/torreslogo.jpg",
  },
  {
    name: "Clínica Viller",
    location: "Alicante, Spain",
    logo: "/images/partners/partnerpage2.png",
  },
  {
    name: "Barberá Clinic",
    location: "Madrid, Spain",
    logo: "/images/partners/partnerpage3.png",
  },
  {
    name: "Mentes Estéticas",
    location: "Valencia, Spain",
    logo: "/images/partners/partnerpage4.png",
  },
  {
    name: "CG Medicina Estética",
    location: "Madrid, Spain",
    logo: "/images/partners/partnerpage5.png",
  },
  {
    name: "Pretty Clinic",
    location: "Barcelona, Spain",
    logo: "/images/partners/partnerpage6.png",
  },
  {
    name: "KOS Clinic",
    location: "Madrid, Spain",
    logo: "/images/partners/partnerpage7.png",
  },
  {
    name: "Clínica Guzmán",
    location: "Valencia, Spain",
    logo: "/images/partners/partnerpage8.png",
  },
  {
    name: "ITS Dental College",
    location: "Greater Noida, India",
    logo: "/images/partners/partnerpage9.png",
  },
  {
    name: "Arora's Dental Clinic",
    location: "Haryana, India",
    logo: "/images/partners/aroradental.png",
  },
  {
    name: "Designer Smile Studio",
    location: "Haryana, India",
    logo: "/images/partners/designersmilestudio.png",
  },
  {
    name: "Smile By Design",
    location: "Gurugram, India",
    logo: "/images/partners/smilebydesign.png",
  },
];

export const faculty = [
  {
    name: "Dr Carlota Alonso",
    title: "EIHE Founder & Chief Executive Officer",
    location: "Sevilla, Spain",
  },
  {
    name: "Dr Eusebio Torres",
    title: "EIHE Medical Director, Clínica Torres Carranza CEO",
    location: "Sevilla, Spain",
  },
  {
    name: "Dr Berta Villagordo",
    title: "MBBS & Director at Clínica Viller",
    location: "Alicante, Spain",
  },
  {
    name: "Dr Francisco Ubet",
    title: "MBBS & Director at Barberá Clinic",
    location: "Madrid, Spain",
  },
  {
    name: "Dr Irene Pinilla",
    title: "MBBS & Director at Kosclinic",
    location: "Madrid, Spain",
  },
  {
    name: "Dr Carlos Gómez",
    title: "MBBS & Director at Dr Carlos Gómez Clinic",
    location: "Madrid, Spain",
  },
  {
    name: "Dr Saray Sánchez",
    title: "MBBS & Specialist in Aesthetic Medicine",
    location: "Oviedo, Spain",
  },
  {
    name: "Dr Fabián Guardia",
    title: "MBBS & Director at Dr Fabián Guardia Clinic",
    location: "Alicante, Spain",
  },
  {
    name: "Dr Leticia Parejo",
    title: "MBBS & Nephrologist",
    location: "Madrid, Spain",
  },
  {
    name: "Dr Pablo Betrián",
    title: "MBBS & Aesthetic Medicine Specialist",
    location: "Madrid, Spain",
  },
  {
    name: "Jennyfer Revilla",
    title: "Nurse & Director at Mentes Estéticas",
    location: "Madrid, Spain",
  },
  {
    name: "Dr Enrique Ahulló",
    title: "MBBS & Aesthetic Medicine Specialist",
    location: "Valencia, Spain",
  },
  {
    name: "Dr Elena Granados",
    title: "MBBS & Allergologist and Aesthetic Medicine Specialist",
    location: "Madrid, Spain",
  },
  {
    name: "Dr Rubén Bermejo",
    title: "MBBS & Medical Director at Pretty Clinic",
    location: "Barcelona, Spain",
  },
  {
    name: "Dr Haizea Álvarez",
    title: "MBBS & Pulmonologist and Aesthetic Medicine Specialist",
    location: "Bilbao, Spain",
  },
  {
    name: "Dr Joan Guzmán",
    title: "MBBS & Medical Director, Clínica Guzmán; Coordinator, HealthyVal",
    location: "Valencia, Spain",
  },
  {
    name: "Dr Flavia Sorge",
    title: "MBBS & Biologist, and Aesthetic Medicine Specialist",
    location: "Oviedo, Spain",
  },
  {
    name: "Dr Sachit Anand Arora",
    title: "Head of Dental Sciences at EIHE, Director at Arora's Dental Clinic",
    location: "Haryana, India",
  },
  {
    name: "Dr Abhay Lambda",
    title: "BDS, MDS, Director at Designer Smile Studio",
    location: "Haryana, India",
  },
  {
    name: "Dr Gunjan Gupta",
    title: "BDS, MDS, Head of Periodontics at ITS Dental College, GN",
    location: "Delhi NCR, India",
  },
  {
    name: "Dr Manisha Lakhanpal",
    title: "BDS, MDS, Project Manager, Preventive Oncologist",
    location: "Delhi NCR, India",
  },
];

export const qualityAssurance = {
  title: "Quality Assurance and Transparency",
  paragraphs: [
    "EIHE has undergone independent evaluation by ARP Certificate, a European quality assurance body that reviews online education programs against pedagogical, technical, and transparency standards.",
    "This certification reflects EIHE's commitment to structured learning design, qualified faculty, learner support, and clear communication — ensuring that our programs meet internationally recognized benchmarks for online healthcare education. Regular audits and documentation reviews ensure ongoing compliance and transparency for healthcare professionals and students worldwide.",
    "Our commitment to excellence is verified through rigorous audits, ensuring full transparency for all medical students worldwide.",
  ],
  buttonLabel: "Download Sample Certificate",
  buttonHref:
    "https://carlotaalonsopardal.com/EIHEGRAPHY/DownloadCertificate/SampleEIHECertificate.pdf",
};

export const community = {
  title: "Join our Global Learning Community",
  description:
    "Follow EIHE for clinical insights, faculty perspectives, educational highlights, and updates on European-standard healthcare training programs.",
  instagram: {
    handle: "europeanihe",
    posts: 177,
    followers: 601,
    following: 292,
    bio: "European Healthcare Education: online & hybrid",
  },
  linkedin: {
    name: "EIHE - European Institute for Healthcare Excellence",
    tagline: "World Class Medical Training For A Healthier Tomorrow",
    industry: "Higher Education · Seville, Andalusia",
    followers: "1K followers",
    size: "2-10 employees",
  },
};

export const partnerInstitutions = [
  { name: "futred", logo: "/images/institutions/PI1.png" },
  { name: "CEMP", logo: "/images/institutions/PI2.png" },
  { name: "ITS Dental College", logo: "/images/institutions/PI3.png" },
  { name: "Aryans Group of Colleges", logo: "/images/institutions/PI4.png" },
  { name: "Dolphin (PG) Institute", logo: "/images/institutions/PI5.png" },
  { name: "VOH — Voice of Healthcare", logo: "/images/institutions/PI6.png" },
  { name: "Medical Fair India", logo: "/images/institutions/PI7.png" },
  {
    name: "India Health by Informa Markets",
    logo: "/images/institutions/PI8.png",
  },
  { name: "GOFCON", logo: "/images/institutions/PI9.png" },
  { name: "Global Schools Program", logo: "/images/institutions/PI10.png" },
  { name: "Smile By Design", logo: "/images/partners/smilebydesign.png" },
  { name: "Arora's Dental Clinic", logo: "/images/partners/aroradental.png" },
];

export const homeFaqs = [
  {
    question: "About EIHE",
    answer:
      "The European Institute for Healthcare Excellence (EIHE) is an international healthcare education institute founded in Europe, dedicated to delivering European-aligned, practice-driven medical education for healthcare professionals worldwide.\n\nEIHE differs from conventional online education platforms by operating as an academic institute rather than a content marketplace. Our programs are designed and reviewed by practicing European clinicians and academic leaders, with a strong focus on clinical relevance, structured learning pathways, and professional applicability.\n\nAll EIHE programs follow defined quality assurance frameworks, including external review of educational design, faculty qualifications, learner support, and transparency standards. This ensures consistency, rigor, and accountability across our training offerings.\n\nOur educational model is built specifically for working healthcare professionals or active students, combining flexible delivery formats with academically sound curricula.\n\nEIHE's core commitment is to raise standards in online healthcare education by aligning international accessibility with European educational principles, clinical ethics, and transparency.",
  },
  {
    question: "About the Courses",
    answer:
      "**How are EIHE programs structured and delivered?**\nEIHE programs are delivered through a structured learning model, designed specifically for healthcare professionals who need academic rigor combined with flexibility. Some programs are 100% online, others are hybrid, and others can be onsite/hands-on.\n\nEach program follows a clearly defined educational pathway that may include asynchronous learning, scheduled interactive activities, and formal assessment components, depending on the level and scope of the course.\n\nTypically, EIHE programs combine:\n- Pre-recorded lectures and learning modules developed by European clinicians and educators\n- Downloadable academic and clinical materials to support independent study\n- Live online sessions with faculty, focused on discussion, clinical insight, and case-based learning (recorded for later access)\n- Assessments and knowledge checks, such as quizzes, assignments, or evaluations aligned with learning outcomes\n\nPrograms are always designed to allow participants to study at their own pace within defined timeframes, while maintaining structured progression and academic coherence.\n\n**Are there practical training opportunities?**\nIn selected programs, EIHE also offers optional practical training opportunities through collaborating clinics and healthcare professionals. These practical components are separate from the online curriculum and are designed to complement theoretical learning where appropriate.\n\nOverall, EIHE's delivery model ensures accessibility without compromising educational standards, enabling healthcare professionals to engage in high-quality training alongside their clinical or academic responsibilities.\n\n**Who teaches the EIHE courses?**\nEIHE programs are designed, delivered, and reviewed by practicing healthcare professionals and academic faculty, primarily from Europe, with additional international contributors.\n\nOur faculty members combine active clinical practice, teaching experience, and subject-matter expertise, ensuring that all programs are academically sound, clinically relevant, and aligned with international healthcare education standards.\n\nFaculty involvement may vary by program and can include curriculum design, live teaching sessions, recorded lectures, mentoring, and assessment oversight.",
  },
  {
    question: "About Fees",
    answer:
      "**How much do EIHE programs cost and what is included in the fees?**\nEIHE program fees vary depending on the type, duration, and scope of the selected course or training activity.\n\nFor each program, fee details are communicated clearly in advance and typically include:\n- Access to learning materials and recorded content\n- Participation in live online sessions (where applicable)\n- Assessments and evaluation components\n- Certificates of completion or program certification\n\n**Are financial aid or scholarships available?**\nEIHE offers selective financial aid options, scholarships, and promotional conditions, depending on the program, cohort, and academic criteria.\n\nAvailability and eligibility vary by course. Prospective participants are encouraged to review the specific program information and contact EIHE directly for guidance on current funding or support opportunities.",
  },
  {
    question: "Admission and Learning Requirements",
    answer:
      "**Who can apply, and what are the academic or professional requirements?**\nEIHE programs are designed for a diverse international healthcare audience, and eligibility requirements vary depending on the level and nature of each program.\n\nSome programs are intended exclusively for licensed medical doctors (MBBS or equivalent), while others are open to nurses, dentists, allied healthcare professionals, or healthcare students. Each course clearly specifies its intended audience and any academic or professional prerequisites.\n\nAdmission criteria may include:\n- Relevant academic qualifications or professional degrees\n- Current professional status or clinical background\n- Language proficiency, where applicable\n\nDetailed eligibility requirements are provided on each program page and reviewed during the application process to ensure appropriate academic alignment.\n\n**Can I study while working full-time?**\nYes. EIHE's educational model is specifically designed for working healthcare professionals.\n\nPrograms are delivered primarily online, combining recorded learning content with scheduled live interactive sessions. This allows participants to progress at their own pace within defined timeframes, while balancing professional and personal responsibilities.\n\n**What is the language of instruction?**\nThe primary language of instruction for most EIHE programs is English, ensuring accessibility for an international audience.\n\nSome programs may also be offered in Spanish, and selected courses may include subtitles or learning materials in additional languages. Language details are clearly indicated in the description of each individual program.\n\n**How do I apply?**\nThe application process is straightforward and fully online:\n- Create your EIHE learner account\n- Select your program and submit the online application form\n- Eligibility review by EIHE (where applicable)\n- Confirmation of admission and enrolment instructions\n\nOnce enrolled, participants can access their learning materials and begin the program according to the course schedule.",
  },
  {
    question: "Support, Networking and Career Opportunities",
    answer:
      "**What support, certification, and professional opportunities will I receive?**\nEIHE programs are designed to support professional development and career progression, rather than guarantee specific employment outcomes.\n\nThrough structured education, certification, and exposure to international faculty and clinical perspectives, participants may strengthen their professional profile and be better prepared to:\n- Develop or expand their clinical practice in relevant fields\n- Engage in collaborations with clinics, institutions, or peers within EIHE's international network\n- Enhance their professional credibility through completion of European-aligned education programs\n\nCareer pathways and opportunities vary depending on individual background, location, regulatory context, and professional goals.\n\n**Are there opportunities to connect with peers and faculty?**\nYes. EIHE fosters an international academic and professional learning community.\n\nDepending on the program, participants may engage through:\n- Live online sessions and interactive discussions with faculty\n- Peer-to-peer learning environments and discussion forums\n- Educational events, workshops, or networking activities linked to EIHE programs or partner clinics\n\nThese interactions are designed to encourage knowledge exchange, professional dialogue, and international perspectives.\n\n**Will I receive support during my studies?**\nYes. EIHE provides academic and technical support throughout the duration of each program.\n\nSupport may include:\n- Guidance related to course structure, assessments, and learning materials\n- Technical assistance with the online learning platform\n- Clear communication channels for administrative or program-related queries\n\nEIHE's objective is to ensure that participants can focus on learning in a structured, accessible, and supportive environment, without unnecessary technical or administrative barriers.",
  },
  {
    question: "Certification and Recognition",
    answer:
      "**Are EIHE certificates recognized or accredited?**\nEIHE certificates confirm the successful completion of an educational program delivered in accordance with defined academic, pedagogical, and quality assurance standards.\n\nEIHE programs undergo independent quality review and certification related to educational design, faculty qualifications, learner support, and transparency. This reflects EIHE's commitment to European-aligned standards in online healthcare education.\n\nSome programs are jointly certified by other institutions, like hospitals, clinics or ARP Certificate (a certification mark from the European Union for High Quality Online Education).\n\nIt is important to note that recognition of certificates depends on context. EIHE certifications demonstrate educational achievement and professional development but do not constitute a statutory academic degree or professional license. Recognition for career progression, institutional acceptance, or professional development may vary by country, employer, or regulatory body.\n\n**Do EIHE programs replace national licensing or professional registration?**\nNo. EIHE programs do not replace national licensing, medical registration, or professional authorization required to practice healthcare in any country.\n\nEIHE education is intended to support continuing professional development, specialization, and academic growth. All participants remain responsible for complying with the legal, regulatory, and professional requirements applicable in their country or jurisdiction.",
  },
];

export const homeFaqCta = {
  title: "Still have questions?",
  description: "Our team is happy to help you.",
  primaryLabel: "CONTACT EIHE",
  primaryHref: "/contact",
  secondaryLabel: "BOOK AN INFORMATION CALL",
  secondaryHref: "/contact",
};
