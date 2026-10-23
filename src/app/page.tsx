"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Play, Plus, MessageCircle } from "lucide-react";
import { categories, projects as demoProjects, type Project, type ProjectCategory } from "@/lib/projects";
import { listPublicProjects, type PortfolioProject } from "@/lib/supabase-rest";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card project-card-${index + 1}`}>
      <a className="project-card-link" href={project.video_url || project.href} target={project.video_url ? "_blank" : undefined} rel={project.video_url ? "noreferrer" : undefined} aria-label={`${project.title} project details`}>
        {project.thumbnail_url ? (
          <div className="project-art project-image-art"><img src={project.thumbnail_url} alt={project.title} loading="lazy" /><span className="art-play"><Play size={17} fill="currentColor" /></span><span className="art-tag">{project.tag}</span></div>
        ) : <div className={`project-art art-${project.art}`}>
          <div className="art-grain" />
          <span className="art-index">{String(index + 1).padStart(2, "0")} / PROJECT PREVIEW</span>
          {project.art === "portrait" && (
            <div className="portrait-shape"><span>BRAND<br />FILM</span></div>
          )}
          {project.art === "type" && <div className="type-shape">SOCIAL<br /><i>REEL.</i></div>}
          {project.art === "orbit" && <div className="orbit-shape"><span>MOTION<br />DESIGN</span></div>}
          {project.art === "mono" && <div className="mono-shape"><span>PODCAST<br />EDIT.</span></div>}
          <span className="art-play"><Play size={17} fill="currentColor" /></span>
          <span className="art-tag">{project.tag}</span>
        </div>}
      </a>
      <div className="project-meta">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <span className="project-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
      </div>
    </article>
  );
}

function Ticker() {
  const items = ["VIDEO EDITING", "REELS & SHORTS", "PODCASTS", "MOTION DESIGN", "VIDEO EDITING", "REELS & SHORTS", "PODCASTS", "MOTION DESIGN"];
  return (
    <div className="ticker" aria-label="Video editing categories">
      <div className="ticker-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}>{item}<i>✳</i></span>
        ))}
      </div>
    </div>
  );
}

function mapPortfolioProject(project: PortfolioProject, index: number): Project {
  const category = categories.includes(project.category as ProjectCategory)
    ? project.category as ProjectCategory
    : "Reels & Shorts";
  const artOptions: Project["art"][] = ["type", "mono", "portrait", "orbit"];
  return {
    title: project.title,
    description: project.description || "",
    tag: category.toUpperCase(),
    category,
    art: artOptions[index % artOptions.length],
    href: project.file_url || project.video_url || "#contact",
    thumbnail_url: project.thumbnail_url,
    video_url: project.video_url,
  };
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<"All Projects" | ProjectCategory>("All Projects");
  const [liveProjects, setLiveProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let active = true;
    listPublicProjects()
      .then((rows) => {
        if (active) setLiveProjects(rows.map(mapPortfolioProject));
      })
      .catch(() => {
        // Keep the demo cards visible if Supabase hasn't been configured yet.
      });
    return () => { active = false; };
  }, []);

  const projects = liveProjects ?? demoProjects;
  const visibleProjects = useMemo(
    () => selectedCategory === "All Projects"
      ? projects
      : projects.filter((project) => project.category === selectedCategory),
    [selectedCategory, projects]
  );

  return (
    <main id="top">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Muhammed Mustafa home">MUHAMMED <span>MUSTAFA</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">WORK <span>01</span></a>
          <a href="#services">SERVICES <span>02</span></a>
          <a href="#contact">CONTACT <span>03</span></a>
        </nav>
        <a className="header-contact" href="#contact">LET’S TALK <ArrowUpRight size={15} /></a>
        <a className="mobile-contact" href="#contact" aria-label="Contact"><ArrowUpRight size={20} /></a>
      </header>

      <section className="hero">
        <div className="hero-kicker reveal"><span className="cross">✳</span> VIDEO EDITOR <span className="kicker-line" /> MUHAMMED MUSTAFA</div>
        <h1 className="hero-title">
          <span className="title-line reveal">VIDEO</span>
          <span className="title-line title-middle reveal">EDITOR<span className="title-outline">.</span></span>
        </h1>
        <div className="hero-bottom reveal">
          <div className="hero-intro"><p>Reels, YouTube, podcasts, ads and cinematic edits — built around your story.</p><div className="hero-actions"><a href="#work" className="hero-work-link">EXPLORE MY WORK <ArrowDownRight size={17} /></a><a href="#contact" className="hero-contact-link">LET’S TALK <ArrowUpRight size={17} /></a></div></div>
          <div className="hero-side-note">EDITING · STORY · MOTION<br />BASED IN EGYPT · WORKING WORLDWIDE</div>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>MUHAMMED<br />MUSTAFA</span><i>↘</i></div>
      </section>

      <section className="contact-strip" id="contact">
        <div><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let’s make it <em>stand out.</em></h2></div>
        <a className="contact-strip-button" href="https://wa.me/201013531622" target="_blank" rel="noreferrer"><MessageCircle size={19} strokeWidth={2.4} /> <span>CHAT ON WHATSAPP</span> <ArrowUpRight size={18} /></a>
      </section>

      <Ticker />

      <section className="work-section section-pad" id="work">
        <div className="section-heading reveal">
          <div><span className="eyebrow">01 / PORTFOLIO</span><h2>SELECTED<br /><em>WORK.</em></h2></div>
          <p>Choose a video type to browse projects.</p>
        </div>

        <div className="project-filter">
          <label htmlFor="project-category">VIDEO TYPE</label>
          <div className="filter-select-wrap">
            <select
              id="project-category"
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value as "All Projects" | ProjectCategory)}
            >
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <span className="filter-chevron" aria-hidden="true">⌄</span>
          </div>
          <span className="filter-count">{visibleProjects.length} {visibleProjects.length === 1 ? "PROJECT" : "PROJECTS"}</span>
        </div>

        {visibleProjects.length > 0 ? (
          <div className="project-grid">
            {visibleProjects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
          </div>
        ) : (
          <div className="empty-projects">
            <span>NO PROJECTS IN THIS CATEGORY YET</span>
            <p>More videos will appear here when they are added.</p>
          </div>
        )}
        <div className="work-footnote"><span><Plus size={15} /> {liveProjects ? "PROJECTS FROM PORTFOLIO ADMIN" : "PORTFOLIO PREVIEW"}</span><span>MUHAMMED MUSTAFA</span></div>
      </section>

      <section className="manifesto" aria-labelledby="manifesto-title">
        <div className="manifesto-top">
          <span className="eyebrow">THE THINKING BEHIND THE CUT</span>
          <span className="manifesto-number">NOT JUST CUTS.<br />A CLEAR POINT OF VIEW.</span>
        </div>
        <h2 className="manifesto-copy" id="manifesto-title">
          GOOD EDITING<br />
          ISN’T JUST <span>SEEN.</span><br />
          IT’S <span>FELT.</span>
        </h2>
        <div className="manifesto-bottom">
          <p>Every frame has a job. Every cut should move the story forward. I bring rhythm, clarity and intention to videos people actually want to keep watching.</p>
          <a className="text-link" href="https://wa.me/201013531622" target="_blank" rel="noreferrer">HAVE A STORY TO TELL? <ArrowUpRight size={16} /></a>
        </div>
      </section>

      <section className="services section-pad" id="services">
        <span className="eyebrow">02 / SERVICES</span>
        <div className="service-list">
          {[
            ["01", "Reels & Shorts", "Short-form video editing."],
            ["02", "YouTube Videos", "Long-form video editing."],
            ["03", "Podcast Editing", "Multi-camera cuts and clean pacing."],
            ["04", "Commercial Ads", "Product and brand videos."],
            ["05", "Motion Design", "Titles, transitions and motion graphics."],
          ].map(([num, title, desc]) => (
            <div className="service-row" key={num}><span className="service-num">{num}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight className="service-arrow" size={20} /></div>
          ))}
        </div>
      </section>

      <footer className="footer" id="site-footer">
        <div className="footer-top"><span className="eyebrow">03 / CONTACT</span><span className="footer-note">VIDEO EDITOR · MUHAMMED MUSTAFA</span></div>
        <h2>HAVE A<br /><span>PROJECT?</span></h2>
        <a className="contact-cta" href="https://wa.me/201013531622" target="_blank" rel="noreferrer">
          <MessageCircle size={20} strokeWidth={2.4} /> <span>LET’S TALK ON WHATSAPP</span> <ArrowUpRight size={18} />
        </a>
        <div className="footer-bottom"><a className="wordmark" href="#top">MUHAMMED <span>MUSTAFA</span></a><span>VIDEO EDITOR</span><a href="#top" className="back-top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
