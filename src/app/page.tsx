import { ArrowDownRight, ArrowRight, ArrowUpRight, Play, Plus } from "lucide-react";
import { projects, type Project } from "@/lib/projects";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <a
      className={`project-card project-card-${index + 1}`}
      href={project.href}
      target={project.href.startsWith("http") ? "_blank" : undefined}
      rel={project.href.startsWith("http") ? "noreferrer" : undefined}
      aria-label={`View ${project.title} project`}
    >
      <div className={`project-art art-${project.art}`} aria-hidden="true">
        <div className="art-grain" />
        <span className="art-index">0{index + 1} / SELECTED WORK</span>
        {project.art === "portrait" && (
          <div className="portrait-shape"><span>FRAME<br />THE FEELING</span></div>
        )}
        {project.art === "type" && <div className="type-shape">NO<br /><i>STATIC.</i></div>}
        {project.art === "orbit" && <div className="orbit-shape"><span>MOVE<br />WITH<br />INTENT</span></div>}
        {project.art === "mono" && <div className="mono-shape"><span>STAY<br />IN THE<br />MOMENT.</span></div>}
        <span className="art-play"><Play size={17} fill="currentColor" /></span>
        <span className="art-tag">{project.tag}</span>
      </div>
      <div className="project-meta">
        <div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
        <span className="project-arrow"><ArrowUpRight size={19} /></span>
      </div>
    </a>
  );
}

function Ticker() {
  const items = ["STORY FIRST", "RHYTHM & FEELING", "DETAIL MATTERS", "STORY FIRST", "RHYTHM & FEELING", "DETAIL MATTERS"];
  return (
    <div className="ticker" aria-label="Creative approach">
      <div className="ticker-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`}>{item}<i>✳</i></span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#" aria-label="Muhammed Mustafa home">MUHAMMED <span>MUSTAFA</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#work">WORK <span>01</span></a>
          <a href="#about">ABOUT <span>02</span></a>
          <a href="#contact">CONTACT <span>03</span></a>
        </nav>
        <a className="availability" href="#contact"><span className="status-dot" /> AVAILABLE FOR PROJECTS</a>
        <a className="mobile-contact" href="#contact" aria-label="Contact"><ArrowUpRight size={20} /></a>
      </header>

      <section className="hero">
        <div className="hero-kicker reveal"><span className="cross">✳</span> INDEPENDENT VIDEO EDITOR <span className="kicker-line" /> 2026 — PRESENT</div>
        <h1 className="hero-title">
          <span className="title-line reveal">I MAKE</span>
          <span className="title-line title-middle reveal">VIDEOS <span className="title-outline">FEEL.</span></span>
        </h1>
        <div className="hero-bottom reveal">
          <p>Crafting stories through <strong>rhythm, emotion</strong><br className="desktop-break" /> and the details you can feel.</p>
          <a href="#work" className="round-link" aria-label="Scroll to selected work"><ArrowDownRight size={24} /></a>
          <div className="hero-side-note">CUT WITH INTENTION.<br />MADE TO BE REMEMBERED.</div>
        </div>
        <div className="hero-stamp" aria-hidden="true"><span>VISUAL<br />STORYTELLING</span><i>↘</i></div>
      </section>

      <Ticker />

      <section className="work-section section-pad" id="work">
        <div className="section-heading reveal">
          <div><span className="eyebrow">01 / THE PORTFOLIO</span><h2>SELECTED<br /><em>WORK.</em></h2></div>
          <p>A selection of projects built around a simple idea: <strong>make every frame count.</strong></p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
        </div>
        <div className="work-footnote"><span><Plus size={15} /> MORE PROJECTS COMING SOON</span><span>CURATED CUTS · 2026</span></div>
      </section>

      <section className="manifesto" id="about">
        <div className="manifesto-top"><span className="eyebrow">02 / THE APPROACH</span><span className="manifesto-number">A GOOD CUT<br />CHANGES EVERYTHING.</span></div>
        <p className="manifesto-copy">Not just cutting clips.<br />Finding the <span>feeling</span> between them.</p>
        <div className="manifesto-bottom"><p>From fast-paced social content to long-form conversations, every edit starts with the story — then we find its rhythm.</p><a href="#contact" className="text-link">LET’S MAKE SOMETHING <ArrowUpRight size={16} /></a></div>
      </section>

      <section className="services section-pad">
        <span className="eyebrow">03 / WHAT I DO</span>
        <div className="service-list">
          {[
            ["01", "Social & Reels", "Short-form content built to hold attention."],
            ["02", "Podcast Editing", "Clean pacing, thoughtful cuts, clear stories."],
            ["03", "Brand Films", "Visual storytelling with a distinct point of view."],
            ["04", "Motion & Finishing", "The final details that bring it all together."],
          ].map(([num, title, desc]) => (
            <div className="service-row" key={num}><span className="service-num">{num}</span><h3>{title}</h3><p>{desc}</p><ArrowUpRight className="service-arrow" size={20} /></div>
          ))}
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-top"><span className="eyebrow">04 / YOUR NEXT PROJECT</span><span className="footer-note">GOT SOMETHING IN MIND?</span></div>
        <h2>LET’S MAKE<br /><span>IT MOVE.</span></h2>
        <a className="contact-cta" href="mailto:hello@example.com">TELL ME ABOUT YOUR PROJECT <ArrowUpRight size={20} /></a>
        <div className="footer-bottom"><a className="wordmark" href="#">EDIT<span>OR</span><b>®</b></a><span>MUHAMMED MUSTAFA · VIDEO EDITOR · 2026</span><a href="#top" className="back-top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
