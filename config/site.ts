/**
 * Central site configuration — brand, navigation, and metadata defaults.
 */
export const siteConfig = {
  name: "EIHE",
  fullName: "European Institute For Healthcare Excellence",
  logo: "/images/Logo.png",
  tagline: "Medical Education for the Global Healthcare Workforce",
  description:
    "The European Institute For Healthcare Excellence designs and delivers practice-oriented medical education, joint certifications, and institutional training programs aligned with European standards — for doctors, clinics, and healthcare organizations worldwide.",
  ogDescription:
    "Practice-oriented medical education and certifications aligned with European standards — for healthcare professionals worldwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/images/og-default.png",
  links: {
    twitter: "",
  },
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    href: "/about-us",
    children: [
      { label: "Our Mission & Vision", href: "/about-us#our-mission" },
      { label: "Our Academic Model", href: "/about-us#academic-model" },
      { label: "Quality Assurance", href: "/about-us#quality-assurance" },
      { label: "Leadership & Faculty", href: "/our-faculty" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "All EIHE Courses", href: "/programs" },
      { label: "For Doctors", href: "/programs/doctors" },
      { label: "For Dentists", href: "/programs/dentists" },
      { label: "For Nurses", href: "/programs/nurses" },
      {
        label: "For Allied Healthcare Professionals",
        href: "/programs/allied-healthcare",
      },
      { label: "For Students", href: "/programs/students" },
      { label: "About Admissions", href: "/admissions" },
    ],
  },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "Free Resources", href: "/resources/free" },
      { label: "FAQS", href: "/faqs" },
      { label: "Certification & Recognition", href: "/resources/certification" },
      { label: "Support", href: "/contact" },
    ],
  },
  {
    label: "Partnerships",
    href: "/partnerships",
    children: [
      { label: "Our Partners & Collaborators", href: "/partnerships/partners" },
      { label: "Partnership For Institutions", href: "/partnerships#institutional" },
      { label: "Partnership For Professionals", href: "/partnerships#professionals" },
      { label: "Careers at EIHE", href: "/partnerships#careers" },
    ],
  },
  {
    label: "Account",
    href: "/student/dashboard",
    children: [
      { label: "Dashboard", href: "/student/dashboard" },
      { label: "My Courses", href: "/student/courses" },
      { label: "Profile", href: "/student/profile" },
      { label: "My Cart", href: "/cart" },
    ],
  },
];

export const footerAbout = {
  title: "About EIHE",
  paragraphs: [
    "The European Institute for Healthcare Excellence (EIHE) is an international healthcare education institute delivering European-aligned, practice-driven programs for healthcare professionals worldwide.",
    "EIHE is committed to academic rigor, transparency, and continuous quality assurance in online healthcare education.",
  ],
};

export const footerAddress = {
  title: "ADDRESS",
  lines: [
    "Sevilla, Spain & New Delhi, India",
    "Phone: +91 92205 00981",
    "Email: info@europeanihe.com",
  ],
};

export const footerPayment = {
  src: "/images/payment-badge.png",
  alt: "We accept Razorpay, Visa, Mastercard, Maestro, net banking, EMI, and other trusted payment providers",
  caption: "Secure payments supported via trusted providers",
};

export const footerDisclaimer =
  "EIHE programs provide education and professional development. They do not replace national licensing, medical registration, or regulatory requirements.";

export const footerNav = {
  quickLinks: [
    { label: "About EIHE", href: "/about-us" },
    { label: "Faculty & Academic Leadership", href: "/our-faculty" },
    { label: "Partners & Collaborations", href: "/partnerships/partners" },
    { label: "Quality Assurance", href: "/about-us#quality-assurance" },
    { label: "Admissions", href: "/admissions" },
  ],
  forLearners: [
    { label: "Programs & Certifications", href: "/programs" },
    { label: "My Account", href: "/student/dashboard" },
    { label: "Resources", href: "/resources" },
    { label: "FAQs", href: "/faqs" },
  ],
  supportLegal: [
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Legal Notice", href: "/legal-notice" },
    { label: "Refund & Return Policy", href: "/refund-and-return-policy" },
    { label: "Accessibility", href: "/accessibility" },
  ],
};

export const footerSocial: { label: string; href: string }[] = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/p/EIHE-European-Institute-for-Healthcare-Excellence-61579612136409/",
  },
  { label: "Instagram", href: "https://www.instagram.com/europeanihe" },
  {
    label: "LinkedIn",
    href: "https://es.linkedin.com/company/eihe-european-institute-for-healthcare-excellence",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/919220500981?text=Hi%2C%20I%27m%20interested%20in%20EIHE%20courses",
  },
  { label: "Twitter", href: "https://x.com/EuropeanIHE" },
];

export type SiteConfig = typeof siteConfig;
