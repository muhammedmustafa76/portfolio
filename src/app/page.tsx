"use client";

import { useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Play, Plus, Check } from "lucide-react";
import { categories, projects, type Project, type ProjectCategory } from "@/lib/projects";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article className={`project-card project-card-${index + 1}`}>
      <a className="project-card-link" href={project.href} aria-label={`${project.title} project details`}>
        <div className={`project-art art-${project.art}`}>
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
        </div>
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<"All Projects" | ProjectCategory>("All Projects");
  const visibleProjects = useMemo(
    () => selectedCategory === "All Projects"
      ? projects
      : projects.filter((project) => project.category === selectedCategory),
    [selectedCategory]
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
        <a className="availability" href="#contact"><span className="status-dot" /> VIDEO EDITOR</a>
        <a className="mobile-contact" href="#contact" aria-label="Contact"><ArrowUpRight size={20} /></a>
      </header>

      <section className="hero">
        <div className="hero-kicker reveal"><span className="cross">✳</span> VIDEO EDITOR <span className="kicker-line" /> MUHAMMED MUSTAFA</div>
        <h1 className="hero-title">
          <span className="title-line reveal">VIDEO</span>
          <span className="title-line title-middle reveal">EDITOR<span className="title-outline">.</span></span>
        </h1>
        <div className="hero-bottom reveal">
          <p>Reels, YouTube, podcasts, ads<br className="desktop-break" /> and cinematic edits.</p>
          <a href="#work" className="round-link" aria-label="View projects"><ArrowDownRight size={24} /></a>
          <div className="hero-side-note">EDITING · STORY · MOTION</div>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>MUHAMMED<br />MUSTAFA</span><i>↘</i></div>
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
        <div className="work-footnote"><span><Plus size={15} /> DEMO CARDS — ADD YOUR REAL VIDEOS</span><span>MUHAMMED MUSTAFA</span></div>
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

      <footer className="footer" id="contact">
        <div className="footer-top"><span className="eyebrow">03 / CONTACT</span><span className="footer-note">VIDEO EDITOR · MUHAMMED MUSTAFA</span></div>
        <h2>HAVE A<br /><span>PROJECT?</span></h2>
        <p className="contact-note">Contact details will be added here.</p>
        <div className="footer-bottom"><a className="wordmark" href="#top">MUHAMMED <span>MUSTAFA</span></a><span>VIDEO EDITOR</span><a href="#top" className="back-top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
