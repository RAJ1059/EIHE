export const partnersIntro = {
  eyebrow: "Advancing Global Standards",
  title: "Working Together to Advance Healthcare Education",
  paragraph:
    "The European Institute for Healthcare Excellence (EIHE) collaborates with a growing network of clinics, healthcare professionals, academic contributors, and organizations that share a commitment to high-quality education, ethical practice, and professional development.",
  quote:
    "Our partnerships are built on mutual trust, shared standards, and long-term collaboration, supporting the delivery of structured, practice-driven healthcare education.",
  buttonLabel: "Explore Partnerships",
  buttonHref: "/contact",
  image: "/images/partnerships-intro.jpg",
  overlay: {
    title: "Academic Excellence",
    text: "Evidence-based clinical methodologies",
  },
};

function flagFor(location: string) {
  return location.includes("India") ? "🇮🇳" : "🇪🇸";
}

const rawPartners = [
  {
    name: "ARP",
    logo: "/images/courses/arp-seal.png",
    location: "Madrid, Spain",
    description:
      "EIHE is certified by ARP Certificate, the European entity that evaluates the quality of online programs under pedagogical, technical, and transparency standards.",
    href: "https://arpcertificate.com",
  },
  {
    name: "Clínica Torres Carranza",
    logo: "/images/partners/torreslogo.jpg",
    location: "Seville, Spain",
    description:
      "Clínica Torres Carranza is a reference center in oral and maxillofacial surgery, implantology, and dental aesthetics. With decades of experience and a multidisciplinary team, it combines advanced technology with personalized care.",
    href: "https://clinicatorrescarranza.es",
  },
  {
    name: "Clínica Viller",
    logo: "/images/partners/partnerpage2.png",
    location: "Alicante, Spain",
    description:
      "Clínica Viller uniquely integrates psyche and anatomy to offer a holistic approach to beauty and wellbeing. Founded by Dr. Berta Villagordo, it has developed the concept of Emotional Aesthetic Medicine.",
    href: "https://clinicaviller.es",
  },
  {
    name: "Barberá Clinic",
    logo: "/images/partners/partnerpage3.png",
    location: "Madrid, Spain",
    description:
      "With over 35 years of experience, Barberá Clinic in Madrid is a leading reference for health and aesthetics. Led by Dr. Francisco Ubet Barberá, the clinic emphasizes minimally invasive, safe, and personalized aesthetic treatments.",
    href: "https://barberaclinic.com",
  },
  {
    name: "Mentes Estéticas",
    logo: "/images/partners/partnerpage4.png",
    location: "Madrid, Spain",
    description:
      "Mentes Estéticas is an innovative online platform for advanced aesthetic surgery education. It provides healthcare professionals with high-quality courses combining updated knowledge and techniques.",
    href: "https://expertocirugiaestetica.es",
  },
  {
    name: "Clínica Dr Carlos Gómez",
    logo: "/images/partners/partnerpage5.png",
    location: "Madrid, Spain",
    description:
      "Clínica Dr. Carlos Gómez provides patient-centered aesthetic medicine, enhancing natural beauty while preserving individual features. Treatments are scientific, advanced, and responsible.",
  },
  {
    name: "Pretty Clinic",
    logo: "/images/partners/partnerpage6.png",
    location: "Barcelona, Spain",
    description:
      "Pretty Clinic, based in Barcelona, specializes in aesthetic medicine, micropigmentation, and advanced aesthetics, with a strong focus on professional education and training.",
    href: "https://prettyclinic.es",
  },
  {
    name: "Kosclinic",
    logo: "/images/partners/partnerpage7.png",
    location: "Madrid, Spain",
    description:
      "Kosclinic specializes in aesthetic medicine, trichology, and wellbeing. The clinic combines personalized clinical care with applied teaching, ensuring high standards of patient trust and safety.",
    href: "https://kosclinic.com",
  },
  {
    name: "Clínica Guzmán",
    logo: "/images/partners/partnerpage8.png",
    location: "Valencia, Spain",
    description:
      "Clínica Guzmán is a leading center for integrative, aesthetic, and wellness-focused healthcare. Known for innovation, scientific rigor, and holistic care, it offers services from aesthetic and anti-aging treatments to physiotherapy.",
    href: "https://clinicaguzman.com",
  },
  {
    name: "ITS Dental College, Hospital and Research Centre",
    logo: "/images/partners/partnerpage9.png",
    location: "Greater Noida, India",
    description:
      "Situated in Greater Noida, ITS Dental College is a premier DCI-recognized institution affiliated with Atal Bihari Vajpayee Medical University that offers comprehensive BDS and MDS programs. The college blends academic rigor with advanced technology and practical clinical application to train students within a modern infrastructure that is at par with the best in the country.",
    href: "https://itsdentalcollege.edu.in",
  },
  {
    name: "Arora's Dental Clinic",
    logo: "/images/partners/aroradental.png",
    location: "Faridabad, India",
    description:
      "Arora's Dental Clinic is a leading multi-speciality dental clinic in Faridabad, offering comprehensive dental care, implantology, cosmetic dentistry, and advanced restorative treatments. With over 25 years of experience, its specialist team combines modern technology with personalised, patient-centred care.",
    href: "https://arorasdentalclinic.com",
  },
  {
    name: "Designer Smile Studio",
    logo: "/images/partners/designersmilestudio.png",
    location: "Faridabad, India",
    description:
      "Designer Smile Studio is a leading dental centre in Faridabad, specialising in implantology, cosmetic dentistry, and smile design. Established in 1998, its experienced team combines advanced technology with personalised, high-quality patient care.",
    href: "https://designersmilestudio.com",
  },
  {
    name: "Chitkara University",
    logo: "/images/partners/chitkara-university.png",
    location: "Chandigarh, India",
    description:
      "Chitkara University is one of India's leading private universities, recognised for its industry-oriented education, multidisciplinary programmes, and strong emphasis on innovation, research, and experiential learning. Through close collaboration with industry and global partners, the university prepares students with the knowledge, skills, and professional competencies required to thrive in a rapidly evolving world.",
    href: "https://chitkara.edu.in",
  },
  {
    name: "Aryans Group of Colleges",
    logo: "/images/partners/aryan-group-of-colleges.png",
    location: "Chandigarh, India",
    description:
      "Aryans Group of Colleges is a multidisciplinary higher education institution in Punjab, India, offering programmes across healthcare, engineering, management, law, pharmacy, nursing, and allied sciences. With a strong emphasis on industry-oriented education, practical training, and skill development, Aryans prepares students for successful professional careers through innovation, academic excellence, and experiential learning.",
    href: "https://aryans.edu.in",
  },
  {
    name: "Futred Innovation Studios",
    logo: "/images/partners/futured-innovation.png",
    location: "Australia, UK & India",
    description:
      "Futred Innovation Studios is an innovation-driven education company specialising in AI-powered learning, industry partnerships, and global education pathways. Through experiential learning and real-world problem solving, Futred prepares students and professionals with the skills, mindset, and practical experience needed for the future of work.",
    href: "https://futred.com",
  },
  {
    name: "Dolphin Life Sciences",
    logo: "/images/partners/dolphin-life.png",
    location: "Chandigarh, India",
    description:
      "Dolphin Life Sciences is a leading higher education institution specialising in life sciences, allied health sciences, pharmacy, agriculture, and healthcare education. With a strong emphasis on academic excellence, practical training, research, and industry engagement, the institution prepares students with the knowledge, skills, and professional competencies required for successful careers in the healthcare and life sciences sectors.",
    href: "https://dolphinlifesciences.com",
  },
  {
    name: "Alcovia",
    logo: "/images/partners/alcovia.png",
    location: "Noida, India",
    description:
      "Alcovia is an innovation-focused education platform dedicated to developing future leaders through experiential learning, mentorship, and real-world problem solving. By combining entrepreneurship, career exploration, and leadership development, Alcovia empowers young learners to build the skills, resilience, and mindset needed to thrive in an ever-changing world.",
    href: "https://alcovia.life",
  },
];

export const partnersDirectory = rawPartners.map((partner) => ({
  ...partner,
  flag: flagFor(partner.location),
}));

export const partnersTestimonial = {
  quote:
    "EIHE is dedicated to setting new standards in healthcare education. We focus on excellence, innovation, and global perspective, needed to transform patient care.",
  name: "Dr Carlota Alonso",
  title: "EIHE Founder & Chief Executive Officer",
  photo: "/images/faculty/carlota-face-comp1.jpg",
};
