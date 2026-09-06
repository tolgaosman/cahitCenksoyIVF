// =============================================================================
// DUMMY DATASET — IVF Clinic Portfolio Showcase
// All names, photos, and data are fictional placeholders.
// =============================================================================

export const CLINIC = {
  name: "Nicosia Fertility Centre",
  tagline: "Where Science Meets Hope",
  description:
    "A leading fertility clinic in Nicosia, Cyprus, combining cutting-edge reproductive medicine with compassionate, personalised care for patients from around the world.",
  address: "45 Mehmet Akif Avenue, Nicosia, Cyprus",
  phone: "+357 22 123 456",
  whatsapp: "+357 99 123 456",
  email: "hello@nicosiaivf.com",
  founded: 2009,
  successRate: 68,
  patientCountries: 42,
  cyclesCompleted: 8400,
};

export const TEAM = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    title: "Medical Director & Reproductive Endocrinologist",
    specialty: "IVF, Egg Donation, PGT-A",
    bio: "Dr. Carter completed her fellowship in Reproductive Endocrinology at the University of Edinburgh. With over 18 years of clinical experience, she leads the clinic's medical team and has pioneered several advanced embryo selection protocols.",
    image: "https://i.pravatar.cc/480?img=47",
    languages: ["English", "French"],
    education: "University of Edinburgh, MD · Imperial College London, Fellowship",
  },
  {
    id: 2,
    name: "Dr. Sophia Meier",
    title: "Senior Embryologist",
    specialty: "ICSI, Embryo Cryopreservation, PGT",
    bio: "Dr. Meier holds a PhD in Developmental Biology from ETH Zurich and has been instrumental in establishing the clinic's world-class embryology laboratory, maintaining one of the highest blastocyst development rates in the region.",
    image: "https://i.pravatar.cc/480?img=5",
    languages: ["English", "German", "Greek"],
    education: "ETH Zurich, PhD Developmental Biology",
  },
  {
    id: 3,
    name: "Dr. Ariana Vasquez",
    title: "Gynaecologist & Fertility Specialist",
    specialty: "Endometriosis, PCOS, Recurrent Implantation Failure",
    bio: "A specialist in complex gynaecological conditions that affect fertility, Dr. Vasquez brings a deeply patient-centred approach to diagnosis and treatment, having treated patients from over 30 countries.",
    image: "https://i.pravatar.cc/480?img=9",
    languages: ["English", "Spanish", "Turkish"],
    education: "Universidad Complutense de Madrid, MD",
  },
  {
    id: 4,
    name: "Isabella Novak",
    title: "Patient Coordinator",
    specialty: "International Patient Liaison",
    bio: "Isabella coordinates the entire patient journey from first consultation to treatment completion, ensuring seamless communication and logistics for our international patients.",
    image: "https://i.pravatar.cc/480?img=44",
    languages: ["English", "Czech", "German"],
    education: "Charles University Prague, MSc Health Management",
  },
  {
    id: 5,
    name: "Ava Thornton",
    title: "Head Nurse & IVF Coordinator",
    specialty: "Fertility Nursing, Patient Support",
    bio: "Ava leads our dedicated nursing team, providing hands-on support throughout every stage of treatment. She is known for her warmth and her ability to put patients at ease during what can be an emotionally demanding process.",
    image: "https://i.pravatar.cc/480?img=41",
    languages: ["English", "Greek"],
    education: "King's College London, BSc Nursing",
  },
  {
    id: 6,
    name: "Mia Jensen",
    title: "Psychologist & Fertility Counsellor",
    specialty: "Fertility Psychology, Grief & Loss Counselling",
    bio: "Mia provides psychological support to patients and couples navigating the emotional landscape of fertility treatment. She runs both individual sessions and a monthly support group.",
    image: "https://i.pravatar.cc/480?img=25",
    languages: ["English", "Danish"],
    education: "Aarhus University, MSc Psychology",
  },
];

export const TREATMENTS = [
  {
    id: "ivf",
    icon: "flask",
    slug: "ivf",
    title: "IVF",
    subtitle: "In Vitro Fertilisation",
    description:
      "Our standard IVF protocol involves controlled ovarian stimulation, egg retrieval, fertilisation in our laboratory, and embryo transfer. We individualise every protocol based on your ovarian reserve and response.",
    duration: "4 to 6 weeks per cycle",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80",
    highlights: [
      "Personalised stimulation protocols",
      "State-of-the-art embryology lab",
      "Time-lapse embryo monitoring",
      "Single embryo transfer policy",
    ],
  },
  {
    id: "icsi",
    icon: "syringe",
    slug: "icsi-ile-ivf",
    title: "ICSI",
    subtitle: "Intracytoplasmic Sperm Injection",
    description:
      "ICSI is the gold standard for male-factor infertility. A single healthy sperm is injected directly into each mature egg, maximising the chance of fertilisation.",
    duration: "Same cycle duration as IVF",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
    highlights: [
      "Effective for severe male factor",
      "Used with surgically retrieved sperm",
      "High fertilisation rates",
      "Combined with PGT when needed",
    ],
  },
  {
    id: "egg-donation",
    icon: "egg",
    slug: "yumurta-bagisi",
    title: "Egg Donation",
    subtitle: "Donor Egg IVF",
    description:
      "Our egg donation programme offers hope to women who cannot use their own eggs. All donors are rigorously screened and matched by our dedicated team.",
    duration: "6 to 10 weeks",
    image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&q=80",
    highlights: [
      "Extensive donor screening",
      "Anonymous & open identity options",
      "Genetic matching available",
      "Fresh & frozen donor cycles",
    ],
  },
  {
    id: "sperm-donation",
    icon: "vial",
    slug: "sperm-bagisi",
    title: "Sperm Donation",
    subtitle: "Donor Sperm Insemination & IVF",
    description:
      "Donor sperm is available for single women, same-sex female couples, and heterosexual couples with severe male factor. All donors are fully screened and quarantined.",
    duration: "2 to 6 weeks",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&q=80",
    highlights: [
      "Extensive genetic & health screening",
      "Detailed donor profiles",
      "IUI and IVF options",
      "Legal framework in Cyprus",
    ],
  },
  {
    id: "pgt",
    icon: "dna",
    slug: "pgd-pgs",
    title: "PGT-A / PGT-M",
    subtitle: "Preimplantation Genetic Testing",
    description:
      "PGT allows us to screen embryos for chromosomal abnormalities (PGT-A) or single gene disorders (PGT-M) before transfer, significantly improving implantation rates and reducing miscarriage risk.",
    duration: "Adds 2 to 3 weeks to standard IVF",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&q=80",
    highlights: [
      "Next-generation sequencing",
      "Screens all 24 chromosomes",
      "Reduces miscarriage risk",
      "Identifies carrier embryos",
    ],
  },
  {
    id: "freezing",
    icon: "snowflake",
    slug: "sperm-ve-yumurta-dondurma",
    title: "Fertility Preservation",
    subtitle: "Egg & Sperm Freezing",
    description:
      "Whether for social reasons or before medical treatment, we offer vitrification (fast-freeze) technology for eggs, sperm, and embryos, with long-term secure storage.",
    duration: "1 to 2 weeks for egg freezing",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    highlights: [
      "Vitrification technology",
      "High survival rates post-thaw",
      "Long-term secure storage",
      "Available before cancer treatment",
    ],
  },
  {
    id: "embryo-donation",
    icon: "microscope",
    slug: "embriyo-donasyonu",
    title: "Embryo Donation",
    subtitle: "Embryo Adoption",
    description:
      "Families who have completed their family through IVF may choose to donate their remaining embryos. Recipients benefit from a faster, more affordable pathway to parenthood.",
    duration: "4 to 8 weeks",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
    highlights: [
      "Ethical & legally regulated",
      "Psychological support included",
      "Lower cost than full IVF",
      "Tandem cycle option available",
    ],
  },
  {
    id: "tandem",
    icon: "refresh",
    slug: "tandem-dongusu",
    title: "Tandem Cycle",
    subtitle: "Own Eggs + Donor Eggs",
    description:
      "A tandem cycle combines your own eggs with donor eggs in a single treatment, giving patients with low ovarian reserve the best possible chance while maintaining a genetic connection.",
    duration: "6 to 8 weeks",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    highlights: [
      "Simultaneous stimulation",
      "Maximises genetic chance",
      "Ideal for low AMH patients",
      "Reduces decision pressure",
    ],
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "After three failed cycles elsewhere, we came to Nicosia almost as a last resort. The team's attention to detail — adjusting our protocol based on my specific bloodwork — made all the difference. We now have a healthy two-year-old daughter.",
    author: "Laura & James",
    origin: "United Kingdom",
    treatment: "IVF with PGT-A",
  },
  {
    id: 2,
    quote:
      "As a single woman, I felt nervous about the process, but the support from Mia and Isabella made everything manageable. Clear communication at every step. I am currently 24 weeks pregnant.",
    author: "Charlotte",
    origin: "Germany",
    treatment: "Donor Sperm IUI",
  },
  {
    id: 3,
    quote:
      "We tried for six years. Dr. Carter identified an issue no other clinic had caught. On our first cycle here, we had two top-quality blastocysts. One is now our son.",
    author: "Fatima & Karim",
    origin: "UAE",
    treatment: "ICSI",
  },
  {
    id: 4,
    quote:
      "The egg donation programme is handled with such sensitivity. We felt fully informed and never pressured. Our twins were born in March and we cannot imagine life without them.",
    author: "Ingrid & Pieter",
    origin: "Netherlands",
    treatment: "Egg Donation IVF",
  },
];

export const FAQS = [
  {
    id: 1,
    question: "What is the difference between IVF and ICSI?",
    answer:
      "In standard IVF, eggs and sperm are placed together in a dish and fertilisation occurs naturally. In ICSI, a single sperm is injected directly into each egg. ICSI is typically recommended when sperm count, motility, or morphology is significantly below normal, or when previous IVF cycles have had unexpectedly low fertilisation.",
  },
  {
    id: 2,
    question: "How many embryos will you transfer?",
    answer:
      "We follow a single embryo transfer (SET) policy for most patients, particularly those under 38 with good-quality blastocysts. This minimises the risk of twin or higher-order pregnancies, which carry significant medical risks. Additional embryos are vitrified for future use.",
  },
  {
    id: 3,
    question: "Do I need to stay in Cyprus for the entire treatment cycle?",
    answer:
      "No. Most of the monitoring and stimulation can be done at a clinic near you, with results sent to us electronically. You will need to travel to Nicosia for approximately 4 to 7 days around your egg retrieval and embryo transfer. Our coordinators will plan your travel schedule precisely.",
  },
  {
    id: 4,
    question: "Is egg donation anonymous?",
    answer:
      "Cyprus law currently permits both anonymous and non-anonymous donation. In anonymous donation, identifying information is not shared, but basic physical characteristics and health data are provided. We will explain both options fully before you make a decision.",
  },
  {
    id: 5,
    question: "What are the success rates for donor egg IVF?",
    answer:
      "Donor egg IVF typically has higher success rates than own-egg IVF because donor eggs come from young, healthy, screened women. Our clinical pregnancy rate per transfer for donor egg cycles is approximately 72%, though individual outcomes depend on many factors.",
  },
  {
    id: 6,
    question: "What does PGT-A testing involve and is it always recommended?",
    answer:
      "PGT-A (preimplantation genetic testing for aneuploidy) involves taking a small biopsy from each blastocyst, which is then analysed for chromosomal abnormalities. We recommend it for patients over 38, those with recurrent miscarriage, or those with previous failed IVF cycles. It is not a mandatory part of every cycle.",
  },
  {
    id: 7,
    question: "How long should we wait between failed IVF cycles?",
    answer:
      "We generally advise at least one full menstrual cycle between IVF attempts to allow the body to recover and to assess the response to stimulation. If protocol changes are needed, we will discuss these with you during your follow-up consultation before proceeding.",
  },
  {
    id: 8,
    question: "Do you offer financial support or instalment plans?",
    answer:
      "We offer several financing options through our partner institutions, including instalment plans for treatment packages. Please ask our patient coordinators for current pricing and financing terms during your initial consultation.",
  },
];

export const QUICK_LINKS = [
  {
    id: "treatments",
    icon: "clipboard",
    title: "Treatment Options",
    cta: "View",
    href: "/treatments",
  },
  {
    id: "process",
    icon: "clock",
    title: "Our Process",
    cta: "View",
    href: "/#process",
  },
  {
    id: "guide",
    icon: "file",
    title: "Patient Guide",
    cta: "Read",
    href: "/faq",
  },
  {
    id: "glossary",
    icon: "book",
    title: "IVF Glossary",
    cta: "Explore",
    href: "/faq",
  },
] as const;

export const PROCESS = [
  {
    id: 1,
    icon: "calendar",
    title: "Initial Consultation",
    description:
      "We review your medical history, previous fertility treatment, and test results, either in person or via video call, to build an initial picture of your case.",
  },
  {
    id: 2,
    icon: "clipboard",
    title: "Treatment Planning",
    description:
      "Our medical team designs a personalised protocol based on your diagnosis, age, and ovarian reserve, and walks you through timelines, medications, and expected costs.",
  },
  {
    id: 3,
    icon: "globe",
    title: "Travel",
    description:
      "Our patient coordinators help arrange flights and provide a detailed itinerary, so your trip to Nicosia lines up precisely with your treatment calendar.",
  },
  {
    id: 4,
    icon: "hotel",
    title: "Accommodation",
    description:
      "We can recommend and book partner hotels close to the clinic, including options with kitchenettes for patients staying through their full stimulation cycle.",
  },
  {
    id: 5,
    icon: "stethoscope",
    title: "Treatment",
    description:
      "Monitoring, egg retrieval, fertilisation, and embryo transfer take place under the direct supervision of our medical and embryology teams throughout your cycle.",
  },
  {
    id: 6,
    icon: "baby",
    title: "Pregnancy Test",
    description:
      "Roughly two weeks after transfer, a blood test confirms your result. We stay in close contact for early monitoring and, where needed, ongoing referral support.",
  },
] as const;
