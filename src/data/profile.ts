export const PROFILE = {
  name: "Mohammad Affan Shofi",
  username: "Affan",
  tagline: "Aspiring Full‑Stack Developer",
  avatar: "/avatar.jpg",
  about:
    "A 7th-semester Information Systems student at ITS with a strong interest in Frontend development, DevOps engineering, and mobile apps, and a passion for digital transformation and public information systems. Proficient with Next.js, Node.js, Flutter, and Laravel in building functional, aesthetically pleasing digital products. Contributed to real-world projects such as PLN Insight Generative at PT Wiratek Solusi Asia, ISE! 2024, and NotedPak!, serving as a Front-End Developer, DevOps Engineer, Deployment Engineer, and Project Manager. Adept at teamwork, analytical thinking, and solving problems with a data-driven, user-focused approach.",
  socials: {
    github: "https://github.com/mas663",
    linkedin: "https://www.linkedin.com/in/mohammad-affan-shofi-4108ba249",
    mail: "mailto:affan.shofi62@gmail.com",
    instagram: "https://instagram.com/maffanshofi",
  },
};

export const EDUCATION: { school: string; program: string; period?: string }[] =
  [
    {
      school: "Institut Teknologi Sepuluh Nopember (ITS)",
      program: "S1 Information Systems",
      period: "2022 – Present",
    },
    {
      school: "SMA Al Izzah Leadership School",
      program: "Science (IPA)",
      period: "2019 – 2022",
    },
    {
      school: "SMPIT Al Hidayah",
      program: "General Education",
      period: "2015 – 2018",
    },
    {
      school: "SDN Pajagalan 2",
      program: "Primary Education",
      period: "2009 – 2015",
    },
  ];

export const SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "Ant Design",
  "Node.js",
  "Express",
  "Laravel",
  "PHP",
  "Python",
  "Flutter",
  "Dart",
  "PostgreSQL",
  "Git",
  "CI/CD",
  "Docker",
  "REST API",
  "OAuth",
  "JWT",
];

export const PROJECTS: {
  title: string;
  desc: string;
  href?: string;
  image?: string;
  tags?: string[];
}[] = [
  {
    title: "Website Personal Portofolio | MAS",
    desc: "A responsive, dynamic personal portfolio website built for showcasing branding, skills, experiences, and projects.",
    href: "#",
    image: "/projects/portofolio1.png",
    tags: ["Next.js", "Tailwind", "TypeScript"],
  },
  {
    title: "Website ISE! 2024 | Information System, ITS",
    desc: "Official event website built collaboratively using modern web tech, optimized for performance and CI/CD.",
    href: "#",
    image: "/projects/ise.png",
    tags: ["Next.js", "Vercel", "CI/CD"],
  },
  {
    title: "PrayTimeNow | PSO",
    desc: "Lightweight Laravel web app to check prayer times by city & date. No login or GPS.",
    href: "#",
    image: "/projects/praytime.png",
    tags: ["Laravel", "Bootstrap"],
  },
  {
    title: "NotedPak! | Tether",
    desc: "Flutter + Firebase notes app with tagging, real‑time sync, and responsive design.",
    href: "#",
    image: "/projects/notedpak.png",
    tags: ["Flutter", "Firebase"],
  },
  {
    title: "FOUND IT | PPPL",
    desc: "Laravel web app to report lost & found items with search, complaints, and chat.",
    href: "#",
    image: "/projects/foundit.png",
    tags: ["Laravel", "MySQL"],
  },
  {
    title: "PLN Insight Generative | PT Wiratek Solusi Asia",
    desc: "AI & data analytics platform for PLN — built full‑stack pages, integrated 25+ modules and APIs.",
    href: "#",
    image: "/projects/plnig.png",
    tags: ["Next.js", "TypeScript", "Tailwind", "REST"],
  },
];

export const CERTS = [
  {
    name: "Belajar Menggunakan Terminal atau CMD untuk Development – CodePolitan",
    href: "#",
  },
  { name: "Mahiri Menggunakan Text Editor – CodePolitan", href: "#" },
  { name: "Mengenal Pemrograman Komputer – CodePolitan", href: "#" },
  { name: "Algoritma dan Pemrograman Dasar – CodePolitan", href: "#" },
  { name: "Belajar JavaScript Dasar – CodePolitan", href: "#" },
];
