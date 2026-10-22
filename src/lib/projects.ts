export type Project = {
  title: string;
  description: string;
  tag: string;
  art: "portrait" | "type" | "orbit" | "mono";
  href: string;
};

// Placeholder projects for the first design pass.
// Replace these with your real projects and video URLs before publishing.
export const projects: Project[] = [
  { title: "After Hours", description: "Brand film · Color & edit", tag: "BRAND FILM", art: "portrait", href: "#contact" },
  { title: "No Static", description: "Social campaign · 9:16", tag: "SOCIAL", art: "type", href: "#contact" },
  { title: "In The Moment", description: "Podcast · Multi-camera edit", tag: "PODCAST", art: "mono", href: "#contact" },
  { title: "Motion Study 04", description: "Motion design · Experiment", tag: "MOTION", art: "orbit", href: "#contact" },
];
