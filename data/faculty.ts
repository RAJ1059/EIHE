export type FacultyLocation = { flag: string; place: string };

export type FacultyPerson = {
  name: string;
  title: string;
  locations: FacultyLocation[];
  bio: string[];
  photo: string;
  linkedin?: string;
  instagram?: string;
};

export const facultyHero = {
  eyebrow: "Leadership & Faculty",
  title: "Academic leadership and clinical expertise behind EIHE programs",
  subtitle:
    "EIHE is guided by a multidisciplinary leadership team and an international faculty of practicing healthcare professionals and educators.",
};

export const leadership: FacultyPerson[] = [
  {
    name: "Dr Carlota Alonso",
    title: "EIHE Founder & CEO",
    locations: [
      { flag: "🇪🇸", place: "Sevilla, Spain" },
      { flag: "🇮🇳", place: "Delhi, India" },
    ],
    bio: [
      "MBBS and Biologist with postgraduate training in aesthetic, regenerative, and anti-ageing medicine, and current doctoral research in Health Sciences with a focus on maxillofacial tissue engineering. Her professional background integrates clinical medicine, biology, and biomedical research.",
      "She combines clinical practice in aesthetic medicine with active involvement in scientific research and academic forums, contributing to national medical congresses and interdisciplinary scientific initiatives.",
    ],
    photo: "/images/faculty/carlota-face-comp1.jpg",
    linkedin: "https://www.linkedin.com/in/carlotaalonso/",
    instagram: "https://www.instagram.com/dr.carlota.alonso/",
  },
  {
    name: "Dr Eusebio Torres Carranza",
    title: "EIHE Medical Director",
    locations: [{ flag: "🇪🇸", place: "Sevilla, Spain" }],
    bio: [
      "Dr Eusebio Torres Carranza is an Oral and Maxillofacial Surgeon, PhD and Member of the Royal Academy of Physicians of Sevilla, based in Spain and a Fellow of the European Board of Oral and Maxillofacial Surgery (FEBOMS). As Medical Director of EIHE, he provides clinical and academic oversight across programs, ensuring alignment with European clinical standards and professional expectations.",
      "His role includes curriculum validation, faculty coordination, and academic supervision of clinical content.",
    ],
    photo: "/images/faculty/esbesios-face-comp1.jpg",
    linkedin:
      "https://www.linkedin.com/in/eusebio-torres-carranza-7164a4173/?locale=en_US",
    instagram: "https://www.instagram.com/eusebiotorrescarranza/",
  },
  {
    name: "Dr Sachit Anand Arora",
    title: "Head of Dental Sciences at EIHE",
    locations: [{ flag: "🇮🇳", place: "Haryana, India" }],
    bio: [
      "Dr Sachit Anand Arora is a periodontist, implantologist and dental academic leader with over 25 years of clinical and teaching experience. He served as Professor and Head of Periodontology at ITS Dental College GN for a decade, and subsequently as Principal and Dean. As Head of Dental Sciences at EIHE, Dr Sachit leads the design and academic oversight of the institute's dental education portfolio, bringing together clinical rigour, research literacy, and practical chairside relevance.",
    ],
    photo: "/images/faculty/sachit-face-comp1.jpg",
  },
];

export const facultyListHeading =
  "Global Leaders in Healthcare, Teaching, and Aesthetic Excellence.";

export const facultyList: FacultyPerson[] = [
  {
    name: "Dr Berta Villagordo",
    title: "Medical Director, Clínica Viller",
    locations: [{ flag: "🇪🇸", place: "Alicante, Spain" }],
    bio: [
      "MBBS, Psychiatrist, and Specialist in Aesthetic Medicine with a professional background combining mental health, clinical aesthetics, and patient-centered care. Her training integrates psychiatry and aesthetic medicine, supporting a holistic and ethically grounded approach to aesthetic practice.",
      "She serves as Medical Director of Clínica Viller and collaborates with multiple clinics across Spain. Her clinical and educational work focuses on emotional assessment, patient selection, and responsible aesthetic decision-making within professional practice.",
      "As a faculty member at EIHE, she contributes her expertise in emotional aesthetics and interdisciplinary care, supporting programs that emphasize ethical practice, patient safety, and integrated clinical reasoning.",
    ],
    photo: "/images/faculty/faculty3.png",
    linkedin:
      "https://www.linkedin.com/in/dra-berta-villagordo-pe%C3%B1alver-53994767/",
    instagram: "https://www.instagram.com/dra.bertavillagordo/",
  },
  {
    name: "Dr Francisco Ubet",
    title: "Aesthetic Medicine Director, Barberá Clinic",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "MBBS, Emergency Medicine Physician, and Specialist in Aesthetic Medicine with a professional background combining acute care, clinical management, and advanced aesthetic practice. His training includes family and community medicine, nutrition and anti-ageing medicine, and postgraduate studies in emergencies and clinical management.",
      "He currently combines frontline clinical work within hospital emergency services with leadership of the Aesthetic Medicine Unit at Barberá Clinic, where he applies innovative and minimally invasive aesthetic techniques. His academic activity includes authorship of scientific publications and active participation in national medical societies.",
      "As a faculty member at EIHE, he brings a multidisciplinary clinical perspective, contributing to programs that bridge emergency medicine, healthcare management, and aesthetic medicine within a structured educational framework.",
    ],
    photo: "/images/faculty/faculty6.png",
    linkedin: "https://www.linkedin.com/in/franciscoubet/",
    instagram: "https://www.instagram.com/dr_ubetbarbera/",
  },
  {
    name: "Dr Manisha Lakhanpal",
    title: "Project Manager, Preventive Oncology",
    locations: [{ flag: "🇮🇳", place: "Delhi-NCR, India" }],
    bio: [
      "BDS, MDS, Oral Medicine and Radiology, with over 20 years of experience in the diagnosis and management of orofacial disease. She has led the Dept. of Oral Medicine and Radiology at ITS Dental College and Hospital, GN. Her clinical and research interests centre around oral cancer awareness and the early interception of potentially malignant disorders, the therapeutic application of lasers, and diagnostic imaging, with particular emphasis on CBCT.",
      "As a faculty member at EIHE, she brings extensive expertise in oral medicine, diagnostic imaging, and evidence-based dental education.",
    ],
    photo: "/images/faculty/doc-manisha.png",
    linkedin:
      "https://www.linkedin.com/in/manisha-lakhanpal-963b53141",
    instagram: "https://www.instagram.com/lakhanpal.manisha",
  },
  {
    name: "Dr Carlos Gómez",
    title: "Medical Director, Dr Carlos Gómez Clinic",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "MBBS, Specialist in Family and Community Medicine, and Aesthetic Medicine Physician with a professional background integrating hospital-based acute care and advanced aesthetic practice. His postgraduate training includes emergencies, clinical ultrasound, and aesthetic medicine.",
      "He combines clinical activity in hospital emergency settings with practice in leading aesthetic clinics, where he specializes in facial harmonization and minimally invasive techniques. His work reflects a balance between technical precision, clinical judgment, and patient-centered care.",
      "As a faculty member at EIHE, he contributes expertise in acute care, clinical assessment, and aesthetic medicine, supporting programs that emphasize clinical rigor, safety, and applied aesthetic training.",
    ],
    photo: "/images/faculty/faculty7.png",
    linkedin:
      "https://www.linkedin.com/in/carlos-j-g%C3%B3mez-delgado-385418148/",
    instagram: "https://www.instagram.com/dr.carlosgomezdelgado/",
  },
  {
    name: "Dr Irene Pinilla",
    title: "Medical Director, Kosclinic",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "MBBS and Specialist in Family and Community Medicine with advanced postgraduate training in aesthetic medicine, nutrition and anti-ageing medicine, trichology, and hair transplantation. Her clinical career spans over 15 years, with a strong focus on minimally invasive aesthetic treatments and regenerative approaches.",
      "She is the Founder and Director of Kosclinic in Madrid, where she combines comprehensive patient care with advanced aesthetic and hair restoration techniques. Her professional activity bridges clinical medicine, aesthetics, and long-term patient management.",
      "As a lecturer and clinical educator at EIHE, she contributes a broad, integrative clinical perspective, supporting programs in aesthetic medicine, trichology, and patient-centered aesthetic care.",
    ],
    photo: "/images/faculty/faculty4.png",
    linkedin:
      "https://www.linkedin.com/in/irene-pinilla-garc%C3%ADa-b2a1a42b0/",
    instagram: "https://www.instagram.com/dra.irenepg/",
  },
  {
    name: "Dr Abhay Lambda",
    title: "Founder & Director, Designer Smile Studio",
    locations: [{ flag: "🇮🇳", place: "Faridabad, India" }],
    bio: [
      "BDS, Oral Implantologist, and Specialist in Cosmetic Dentistry with over 25 years of clinical experience in comprehensive dental rehabilitation, implantology, and digital smile design. He holds a M.Sc. in Oral Implantology from Goethe University, Germany. He currently leads Designer Smile Studio, where he combines advanced digital technologies, evidence-based clinical practice, and personalised patient care to deliver complex restorative and aesthetic dental treatments. His professional activity includes active membership in leading national and international implantology and restorative dentistry societies.",
      "As a faculty member at EIHE, he brings extensive expertise in implants, digital dentistry, and minimally invasive restorative techniques.",
    ],
    photo: "/images/faculty/doc-abhay1.png",
    instagram: "https://www.instagram.com/designersmilestudio/",
  },
  {
    name: "Dr Saray Sánchez",
    title: "Medical Doctor, Specialist in Aesthetic Medicine",
    locations: [{ flag: "🇪🇸", place: "Oviedo, Spain" }],
    bio: [
      "MBBS and Specialist in Aesthetic Medicine with a clinical background spanning hospital-based medicine, urgent care, and advanced aesthetic practice. Her training includes anti-ageing and regenerative medicine, integrating clinical medicine with minimally invasive aesthetic approaches.",
      "She has completed postgraduate training in dermo-aesthetics, hyaluronic acid treatments, neuromodulators, skin health, and orofacial harmonization. Her clinical work reflects a structured and comprehensive approach to aesthetic medicine, grounded in patient safety and evidence-informed practice.",
      "As a faculty member at EIHE, she contributes her expertise in regenerative and aesthetic medicine, supporting educational programs focused on safe clinical application, facial assessment, and patient-centered aesthetic care.",
    ],
    photo: "/images/faculty/faculty5.png",
    linkedin:
      "https://www.linkedin.com/in/saray-sanchez-megias-479580207/",
    instagram: "https://www.instagram.com/dra.sanchezmegias/",
  },
  {
    name: "Dr Fabián Guardia",
    title: "Medical Director, Dr Fabián Guardia Clinic",
    locations: [
      { flag: "🇪🇸", place: "Alicante, Spain" },
      { flag: "🇺🇾", place: "Montevideo, Uruguay" },
    ],
    bio: [
      "MBBS with specialization in aesthetic medicine and hair surgery, with an international professional background developed across Spain and Latin America. His clinical career spans nearly two decades, integrating aesthetic medicine, regenerative therapies, and advanced hair restoration techniques.",
      "He is Director of Clínica Dr Fabián Guardia in Alicante and has led hair surgery units in multiple clinical settings. His training includes advanced aesthetic medicine, regenerative therapies, and FUE/DHI hair transplantation, alongside active participation in national and international congresses.",
      "As a faculty member at EIHE, he contributes extensive expertise in injectables, regenerative medicine, and hair restoration, supporting programs with a strong clinical and procedural focus.",
    ],
    photo: "/images/faculty/faculty9.png",
    linkedin: "https://www.linkedin.com/in/fabian-guardia-de-leon-14630b71/",
    instagram: "https://www.instagram.com/dr.fabianguardia",
  },
  {
    name: "Dr Gunjan Gupta",
    title: "Professor and HOD, Periodontics",
    locations: [{ flag: "🇮🇳", place: "Noida, India" }],
    bio: [
      "BDS, MDS, periodontist and academician with 13 years of combined clinical and teaching experience. She currently serves as Professor and Head of the Department of Periodontics at ITS Dental College, GN, where she leads departmental teaching, clinical supervision and postgraduate training in periodontal therapy. Alongside her academic appointment, Dr Gupta maintains her private practice at Smile by Design Dental Clinics in Delhi NCR. At EIHE she brings this dual perspective, contributing to course content that grounds contemporary evidence in practical, reproducible clinical technique.",
    ],
    photo: "/images/faculty/doc-gunjan1.png",
  },
  {
    name: "Dr Pablo Betrián",
    title: "Medical Doctor, Family Medicine and Aesthetic Medicine Specialist",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "MBBS and Specialist in Family and Community Medicine, with postgraduate training in Aesthetic Medicine, Nutrition, Anti-Aging, and Trichology. His medical background is rooted in primary care, providing a strong foundation in holistic and long-term patient management.",
      "Driven by curiosity and a passion for aesthetic medicine, he combines evidence-based techniques with a balanced, natural approach to aesthetic outcomes. His clinical work spans both primary care and aesthetic practice, allowing him to integrate prevention, health optimization, and aesthetics.",
      "Through his active involvement in scientific societies and continuous professional development, he contributes to EIHE's programs with a comprehensive, longitudinal perspective on patient care and aesthetic medicine.",
    ],
    photo: "/images/faculty/faculty16.png",
    linkedin:
      "https://www.linkedin.com/in/pablo-betri%C3%A1n-gonz%C3%A1lez-2a1513351/",
    instagram: "https://www.instagram.com/dr.pablobetrian/",
  },
  {
    name: "Dr Leticia Parejo",
    title: "Medical Doctor, Nephrologist and Aesthetic Medicine Specialist",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "MBBS with specialization in nephrology and aesthetic medicine, complemented by postgraduate training in healthcare management and innovation. Her professional background bridges clinical medicine with emerging technologies and interdisciplinary applications.",
      "She works as a consultant in artificial intelligence applied to medicine and sports, and has served as a Key Opinion Leader and international trainer for medical technology companies. Her activity combines clinical insight with strategic and technological perspectives.",
      "As a faculty member at EIHE, she contributes a multidisciplinary and forward-looking approach, supporting educational programs that integrate clinical expertise, innovation, and evidence-informed decision-making in aesthetic medicine.",
    ],
    photo: "/images/faculty/faculty13.png",
    linkedin:
      "https://www.linkedin.com/in/leticia-parejo-garc%C3%ADa-90098b56/",
    instagram: "https://www.instagram.com/dra.parejo/",
  },
  {
    name: "Dr Enrique Ahulló",
    title: "Medical Doctor, Family Medicine and Aesthetic Medicine Specialist",
    locations: [{ flag: "🇪🇸", place: "Valencia, Spain" }],
    bio: [
      "MBBS and Specialist in Family Medicine with professional experience spanning primary care and personalized aesthetic medicine. His clinical practice is guided by a holistic approach to patient wellbeing, with an emphasis on safety, natural outcomes, and individualized treatment planning.",
      "He combines clinical work with ongoing professional development, actively participating in medical training activities and professional meetings. This continuous engagement allows him to integrate current and innovative techniques into daily practice. As a faculty member at EIHE, he contributes a comprehensive and patient-centered clinical perspective, supporting programs that emphasize medical rigor, ethical practice, and individualized aesthetic care.",
    ],
    photo: "/images/faculty/faculty14.png",
    instagram: "https://www.instagram.com/dr.ahullo",
  },
  {
    name: "Jennyfer Revilla",
    title: "Director, Mentes Estéticas",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "Registered Nurse with over ten years of professional experience in aesthetic and reconstructive surgery, with a clinical focus on perioperative care, patient safety, and surgical assistance. Her background includes close collaboration with leading plastic surgery teams in Spain, contributing to high standards of clinical care and procedural support.",
      "She is the Founder and Director of Mentes Estéticas, a training platform dedicated to the education of healthcare professionals in surgical nursing and aesthetic procedures. Her work integrates hands-on clinical expertise with structured educational methodologies.",
      "As a faculty member at EIHE, she contributes a nursing-led, patient-centered perspective, supporting programs that emphasize surgical protocols, multidisciplinary collaboration, and the critical role of nursing in aesthetic and reconstructive medicine.",
    ],
    photo: "/images/faculty/faculty12.png",
    linkedin: "https://www.linkedin.com/in/jennyfer-revilla-rodriguez-807a70113/",
    instagram: "https://www.instagram.com/jennyfer_revrod",
  },
  {
    name: "Dr Drishti",
    title: "Director, Mentes Estéticas",
    locations: [{ flag: "🇮🇳", place: "Delhi NCR, India" }],
    bio: [],
    photo: "/images/faculty/doc-drishti.png",
  },
  {
    name: "Dr Rubén Bermejo",
    title: "Medical Director, Pretty Clinic",
    locations: [{ flag: "🇪🇸", place: "Barcelona, Spain" }],
    bio: [
      "MBBS with postgraduate training in aesthetic medicine and specialization in reconstructive and oncological aesthetics. His professional background combines advanced aesthetic practice with a strong focus on patient safety, functional restoration, and ethical clinical decision-making.",
      "He serves as Medical Director of Centro Sanitario Bermejo-Pérez and Head of Studies at Pretty Clinic Training Centre, and is also involved in academic teaching at Universidad Europea. His areas of expertise include micropigmentation, regenerative therapies, and oncological aesthetics.",
      "As a faculty member at EIHE, he contributes a patient-centered and academically grounded perspective, supporting educational programs that integrate innovation, reconstructive principles, and responsible aesthetic practice.",
    ],
    photo: "/images/faculty/faculty8.png",
    linkedin: "https://www.linkedin.com/in/drbermejoperez/",
    instagram: "https://www.instagram.com/doctor.bermejo/",
  },
  {
    name: "Dr Elena Granados",
    title: "Medical Doctor, Allergologist and Aesthetic Medicine Specialist",
    locations: [{ flag: "🇪🇸", place: "Madrid, Spain" }],
    bio: [
      "MBBS and Specialist in Allergology, with advanced postgraduate training in Aesthetic Medicine, Nutrition, and Anti-Aging. Her clinical background in immunology and allergy provides a solid scientific foundation for safe, individualized aesthetic treatments.",
      "She integrates evidence-based medicine with a holistic understanding of wellbeing, focusing on prevention, skin health, and long-term outcomes. Her growing academic and clinical involvement in aesthetic medicine reflects a commitment to continuous learning and cross-disciplinary integration.",
      "Dr Granados contributes to EIHE's programs with a nuanced perspective that bridges internal medicine, preventive care, and aesthetic medicine, combining scientific rigor with a patient-centred approach.",
    ],
    photo: "/images/faculty/faculty17.png",
    instagram: "https://www.instagram.com/draelenagranados",
    linkedin: "https://www.linkedin.com/in/elena-granados-alarc%C3%B3n/",
  },
  {
    name: "Dr Haizea Álvarez",
    title: "Medical Doctor, Pulmonologist and Aesthetic Medicine Specialist",
    locations: [{ flag: "🇪🇸", place: "Bilbao, Spain" }],
    bio: [
      "MBBS and Specialist in Pulmonology, with complementary training in aesthetic medicine, obesity management, and longevity-focused care. Her clinical background is rooted in hospital-based respiratory medicine within the public health system, where she combines diagnostic rigor with a strong patient-centred approach.",
      "Alongside her work as a pulmonologist, she has developed a parallel practice in medical aesthetics and metabolic health, integrating evidence-based aesthetic treatments with lifestyle, nutritional, and longevity strategies.",
      "Her multidisciplinary profile allows her to bridge internal medicine and aesthetic medicine, contributing to EIHE's programs with a holistic, medically grounded perspective focused on safety, long-term outcomes, and personalized care.",
    ],
    photo: "/images/faculty/faculty18.jpeg",
  },
  {
    name: "Dr Joan Guzmán",
    title: "Medical Director, Clínica Guzmán; Coordinator, HealthyVal",
    locations: [{ flag: "🇪🇸", place: "Valencia, Spain" }],
    bio: [
      "MBBS and Specialist in Aesthetic Medicine, with a clinical focus on natural rejuvenation, male aesthetics, and integrative anti-aging approaches. His professional profile combines aesthetic medicine with advanced training in nutrition, longevity, and regenerative strategies.",
      "He has led the development of innovative treatment protocols and the creation of new clinical units, applying a structured and evidence-based approach to aesthetic practice. His work emphasizes sustainable results, personalization, and long-term patient wellbeing.",
      "As Director of Clínica Guzmán and Coordinator at HealthyVal, he contributes to EIHE's programs with a strategic vision of aesthetic medicine that integrates clinical rigor, innovation, and healthy aging principles.",
    ],
    photo: "/images/faculty/faculty15.png",
    instagram: "https://www.instagram.com/_drguzman",
  },
  {
    name: "Dr Flavia Sorge",
    title: "Biologist, Medical Doctor and Aesthetic Medicine Specialist",
    locations: [{ flag: "🇪🇸", place: "Oviedo, Spain" }],
    bio: [
      "MBBS and Biologist with postgraduate training in aesthetic, regenerative, and anti-ageing medicine, and current doctoral research in Health Sciences with a focus on maxillofacial tissue engineering. Her professional background integrates clinical medicine, biology, and biomedical research.",
      "She combines clinical practice in aesthetic medicine with active involvement in scientific research and academic forums, contributing to national medical congresses and interdisciplinary scientific initiatives.",
      "As a faculty member at EIHE, she brings a research-oriented and innovation-driven perspective, supporting educational programs that connect regenerative medicine, scientific evidence, and clinical application.",
    ],
    photo: "/images/faculty/faculty10.png",
    linkedin: "https://www.linkedin.com/in/flavia-sorge/",
    instagram: "https://www.instagram.com/dra.flaviasorge/",
  },
];

export const societies = {
  title: "Professional Societies & Academic Affiliations",
  subtitle:
    "EIHE's faculty hold memberships in leading international medical societies, healthcare organisations, academic institutions, and professional associations. These affiliations reflect their ongoing commitment to clinical excellence, research, innovation, and continuous professional development.",
  logos: Array.from(
    { length: 24 },
    (_, i) => `/images/societies/PS${i + 1}.png`,
  ),
};

export const joinFaculty = {
  title: "Join Our Faculty Community",
  paragraphs: [
    "At EIHE, we are dedicated to advancing healthcare education through innovation and collaboration. We invite passionate educators and industry leaders to join our dynamic faculty community and play a pivotal role in shaping the future of healthcare professionals.",
    "Our faculty members enjoy a supportive environment that fosters interdisciplinary partnership, professional growth, and the opportunity to make a meaningful impact on the lives of students and the broader community. Explore our opportunities to contribute your expertise to our mission.",
  ],
  buttonLabel: "Explore Faculty & Teaching Opportunities",
  buttonHref: "/contact",
};
