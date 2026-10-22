export type ProjectCategory =
  | "Reels & Shorts"
  | "YouTube Videos"
  | "Podcasts"
  | "Commercial Ads"
  | "Cinematic Edits"
  | "Motion Design";

export type Project = {
  title: string;
  description: string;
  tag: string;
  category: ProjectCategory;
  art: "portrait" | "type" | "orbit" | "mono";
  href: string;
};

export const categories: ("All Projects" | ProjectCategory)[] = [
  "All Projects",
  "Reels & Shorts",
  "YouTube Videos",
  "Podcasts",
  "Commercial Ads",
  "Cinematic Edits",
  "Motion Design",
];

// These are visual demo cards, not real client projects.
// Replace them with Muhammed's real videos and project details before launch.
export const projects: Project[] = [
  {
    title: "Social Reel",
    description: "Demo layout · Replace with your video",
    tag: "REELS & SHORTS",
    category: "Reels & Shorts",
    art: "type",
    href: "#contact",
  },
  {
    title: "Podcast Edit",
    description: "Demo layout · Replace with your video",
    tag: "PODCAST",
    category: "Podcasts",
    art: "mono",
    href: "#contact",
  },
  {
    title: "Brand Film",
    description: "Demo layout · Replace with your video",
    tag: "COMMERCIAL",
    category: "Commercial Ads",
    art: "portrait",
    href: "#contact",
  },
  {
    title: "Motion Design",
    description: "Demo layout · Replace with your video",
    tag: "MOTION",
    category: "Motion Design",
    art: "orbit",
    href: "#contact",
  },
];
