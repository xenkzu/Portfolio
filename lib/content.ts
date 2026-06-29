/**
 * Single source of truth for all site content.
 * Swap placeholder values with real assets as they arrive.
 */

export const profile = {
  name: "Yash Kaul",
  firstName: "Yash",
  lastName: "Kaul",
  handle: "xenkzu",
  role: "Designer · Motion · Direction",
  location: "New Delhi, IN",
  // Hero anchor line (placeholder — finalize together once seen in context)
  heroLine: "Less. But louder.",
  heroSub:
    "Designer & motion director with 8 years behind the frame. I build visual systems that move — and ship them too.",
  email: "yashkaul777@gmail.com",
} as const;

/**
 * Editorial multi-line hero statement (Sui-style).
 * Each entry is one stacked line of the headline. The last line carries an
 * accent treatment (italic / outlined) for editorial contrast.
 */
export const heroStatement = {
  kicker: "Designer · Motion · Direction",
  lines: [
    { text: "Design that", accent: false },
    { text: "moves — and", accent: false },
    { text: "ships.", accent: true },
  ],
} as const;

export const rotatingPairs = [
  { first: "digital", second: "systems" },
  { first: "creative", second: "direction" },
  { first: "brand", second: "identity" },
  { first: "immersive", second: "web" },
  { first: "motion", second: "interactive" },
] as const;


export const nav = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Studio", href: "#capabilities" },
  { label: "Contact", href: "#contact" },
] as const;

export type WorkItem = {
  id: string;
  title: string;
  client: string;
  year: string;
  discipline: string;
  // Shown only in code layer
  tools: string[];
  poster: string; // path under /public
  aspect: "portrait" | "landscape" | "square";
};

export const work: WorkItem[] = [
  {
    id: "001",
    title: "Toronto Film Awards — Official Trailer",
    client: "Toronto Film Awards",
    year: "2024",
    discipline: "Direction · Motion · Edit",
    tools: ["After Effects", "Premiere Pro", "Audition"],
    poster: "/posters/poster-01.svg",
    aspect: "portrait",
  },
  {
    id: "002",
    title: "Chary — Visual Identity System",
    client: "Chary",
    year: "2024",
    discipline: "Brand · Motion",
    tools: ["Illustrator", "After Effects"],
    poster: "/posters/poster-02.svg",
    aspect: "landscape",
  },
  {
    id: "003",
    title: "Bikram Dosanjh — Promotional Campaign",
    client: "Bikram Dosanjh",
    year: "2023",
    discipline: "Direction · Edit",
    tools: ["Premiere Pro", "Photoshop"],
    poster: "/posters/poster-03.svg",
    aspect: "portrait",
  },
  {
    id: "004",
    title: "Untitled — Editorial Poster Series",
    client: "Personal",
    year: "2024",
    discipline: "Graphic · Typography",
    tools: ["Photoshop", "Illustrator"],
    poster: "/posters/poster-04.svg",
    aspect: "landscape",
  },
  {
    id: "005",
    title: "Freelance — Brand & Social Systems",
    client: "US Clients",
    year: "2023",
    discipline: "Brand · UI/UX",
    tools: ["Figma", "Illustrator"],
    poster: "/posters/poster-05.svg",
    aspect: "square",
  },
  {
    id: "006",
    title: "Reels — Short-form Motion Direction",
    client: "Various Creators",
    year: "2024",
    discipline: "Motion · Edit · Sound",
    tools: ["After Effects", "Premiere Pro", "Audition"],
    poster: "/posters/poster-06.svg",
    aspect: "portrait",
  },
];

export type Stat = {
  value: string;
  label: string;
};

export const stats: Stat[] = [
  { value: "20M+", label: "Views across platforms" },
  { value: "8 yrs", label: "Designing since 8th grade" },
  { value: "50+", label: "Projects shipped" },
  { value: "3rd yr", label: "B.Tech Computer Science" },
];

export const manifesto = [
  "I don't decorate —",
  "I direct.",
  "Every frame, every transition, every system —",
  "intentional. Eight years in, still obsessed.",
] as const;

export type Capability = {
  title: string;
  detail: string;
  tools: string[];
};

export const capabilities: Capability[] = [
  {
    title: "Motion Design",
    detail: "Title sequences, brand motion, short-form direction.",
    tools: ["After Effects", "Premiere Pro"],
  },
  {
    title: "Brand & Identity",
    detail: "Visual systems, logos, guidelines, social kits.",
    tools: ["Illustrator", "Photoshop"],
  },
  {
    title: "UI / UX",
    detail: "Interfaces, prototypes, design systems in Figma.",
    tools: ["Figma", "Photoshop"],
  },
  {
    title: "Video & Direction",
    detail: "Editing, color, sound, end-to-end creative direction.",
    tools: ["Premiere Pro", "Audition", "After Effects"],
  },
];

export const clients = [
  "Toronto Film Awards",
  "Chary",
  "Bikram Dosanjh",
  "US Freelance Clients",
] as const;

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const socials: SocialLink[] = [
  { label: "Instagram", href: "https://www.instagram.com/betterkaulyash/", handle: "@betterkaulyash" },
  { label: "YouTube", href: "https://www.youtube.com/@xenkzu", handle: "@xenkzu" },
  { label: "GitHub", href: "https://github.com/xenkzu", handle: "xenkzu" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yashkaul777/", handle: "/in/yashkaul777" },
  { label: "Behance", href: "https://www.behance.net/yashkaul", handle: "/yashkaul" },
];

export const codingHighlights = [
  "B.Tech CS — currently 3rd year",
  "Design Systems with React + TypeScript",
  "This site, built from scratch",
] as const;
