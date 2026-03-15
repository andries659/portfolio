import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faGlobe,
  faRobot,
  faGamepad,
  faDownload,
  faBriefcase,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import projects from '../projects.json';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@600;800&display=swap');

  .portfolio-wrapper {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1.5rem 6rem;
  }

  /* ── Search ── */
  .search-wrap {
    position: relative;
    margin-bottom: 3rem;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #3dffa0;
    font-size: 0.85rem;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    background: rgba(61,255,160,0.04);
    border: 1px solid rgba(61,255,160,0.2);
    color: #e0ffe8;
    font-family: 'Space Mono', monospace;
    font-size: 0.82rem;
    padding: 0.85rem 1rem 0.85rem 2.8rem;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    letter-spacing: 0.04em;
  }

  .search-input::placeholder { color: #3a7a5a; }

  .search-input:focus {
    border-color: #3dffa0;
    box-shadow: 0 0 0 3px rgba(61,255,160,0.08);
  }

  /* ── Section label ── */
  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.28em;
    color: #3a7a5a;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(61,255,160,0.12);
  }

  /* ── Grid ── */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 900px) {
    .projects-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 560px) {
    .projects-grid { grid-template-columns: 1fr; }
  }

  /* ── Card ── */
  .project-card {
    background: rgba(5, 20, 12, 0.85);
    border: 1px solid rgba(61,255,160,0.14);
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
    cursor: default;
    position: relative;
  }

  .project-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at top left, rgba(61,255,160,0.05) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .project-card:hover {
    border-color: rgba(61,255,160,0.5);
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(61,255,160,0.08);
  }

  .project-card:hover::before { opacity: 1; }


  /* ── card banner (replaces image) ── */
  .card-banner {
    position: relative;
    width: 100%;
    height: 150px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .card-banner::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(61,255,160,0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(61,255,160,0.07) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: radial-gradient(ellipse at center, black 30%, transparent 80%);
  }

  .card-banner-icon {
    position: relative;
    z-index: 1;
    font-size: 2.8rem;
    filter: drop-shadow(0 0 18px currentColor);
    transition: transform 0.35s, filter 0.35s;
  }

  .project-card:hover .card-banner-icon {
    transform: scale(1.14);
    filter: drop-shadow(0 0 30px currentColor);
  }

  /* type badge */
  .card-type-badge {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    background: rgba(5,13,10,0.85);
    border: 1px solid rgba(61,255,160,0.3);
    color: #3dffa0;
    padding: 0.2rem 0.55rem;
    border-radius: 2px;
    z-index: 2;
  }

  /* body */
  .card-body {
    padding: 1.1rem 1.1rem 0.9rem;
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 0.6rem;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.05rem;
    color: #e8fff2;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  .card-desc {
    font-family: 'Space Mono', monospace;
    font-size: 0.75rem;
    line-height: 1.7;
    color: #6abf8f;
    flex: 1;
  }

  /* tags */
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .card-tag {
    font-family: 'Space Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    padding: 0.18rem 0.55rem;
    border: 1px solid rgba(61,255,160,0.2);
    color: #3dffa0;
    background: rgba(61,255,160,0.05);
    border-radius: 2px;
    text-transform: uppercase;
  }

  /* divider */
  .card-divider {
    height: 1px;
    background: rgba(61,255,160,0.1);
    margin: 0.2rem 0;
  }

  /* links row */
  .card-links {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .card-link {
    font-family: 'Space Mono', monospace;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
    padding: 0.4rem 0.8rem;
    border-radius: 3px;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    border: 1px solid transparent;
  }

  .card-link-primary {
    background: rgba(61,255,160,0.1);
    border-color: rgba(61,255,160,0.3);
    color: #3dffa0;
  }

  .card-link-primary:hover {
    background: rgba(61,255,160,0.18);
    border-color: #3dffa0;
  }

  .card-link-secondary {
    background: rgba(255,255,255,0.03);
    border-color: rgba(255,255,255,0.1);
    color: #7ecca4;
  }

  .card-link-secondary:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.25);
    color: #e0ffe8;
  }

  /* empty state */
  .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 4rem 1rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.8rem;
    color: #3a7a5a;
    letter-spacing: 0.1em;
  }

  /* scroll progress */
  .scroll-progress {
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: #3dffa0;
    transform-origin: left;
    z-index: 50;
    box-shadow: 0 0 8px #3dffa0;
  }
`;

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const [search, setSearch] = useState('');

  const filteredProjects = projects.filter((project) => {
    const s = search.toLowerCase();
    return (
      project.title.toLowerCase().includes(s) ||
      project.description.toLowerCase().includes(s) ||
      project.tags.some((t) => t.toLowerCase().includes(s))
    );
  });

  // Each type gets a unique gradient + FontAwesome icon + glow colour
  const getBannerInfo = (type) => {
    switch (type) {
      case 'bot':
        return {
          gradient: 'linear-gradient(135deg, #050d1a 0%, #0a1a2e 50%, #051a10 100%)',
          icon: faRobot,
          color: '#38bdf8',
        };
      case 'website':
        return {
          gradient: 'linear-gradient(135deg, #0a0d05 0%, #0d1a08 50%, #0a1205 100%)',
          icon: faGlobe,
          color: '#3dffa0',
        };
      case 'mod':
        return {
          gradient: 'linear-gradient(135deg, #150a0a 0%, #1f0d0d 50%, #0d0510 100%)',
          icon: faGamepad,
          color: '#f97316',
        };
      default:
        return {
          gradient: 'linear-gradient(135deg, #0a0a0d 0%, #101018 50%, #080d0a 100%)',
          icon: faBriefcase,
          color: '#a78bfa',
        };
    }
  };

  const getLinkInfo = (type) => {
    switch (type) {
      case 'bot':     return { label: 'Invite Bot',     icon: faRobot };
      case 'website': return { label: 'Website',        icon: faGlobe };
      case 'mod':     return { label: 'View Mod',       icon: faGamepad };
      default:        return { label: 'View Project',   icon: faBriefcase };
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* Scroll progress bar */}
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      <div className="portfolio-wrapper">
        {/* Search */}
        <div className="search-wrap">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            className="search-input"
            type="text"
            placeholder="search projects, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Label */}
        <p className="section-label">
          {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>

        {/* Grid */}
        <div className="projects-grid">
          {filteredProjects.length === 0 && (
            <div className="empty-state">// no projects found</div>
          )}

          {filteredProjects.map((project, index) => {
            const { label, icon } = getLinkInfo(project.type);
            const { gradient, icon: bannerIcon, color } = getBannerInfo(project.type);
            return (
              <motion.div
                key={index}
                className="project-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.07 }}
              >
                {/* Banner */}
                <div className="card-banner" style={{ background: gradient }}>
                  <FontAwesomeIcon
                    icon={bannerIcon}
                    className="card-banner-icon"
                    style={{ color }}
                  />
                  <span className="card-type-badge">{project.type || 'project'}</span>
                </div>

                {/* Body */}
                <div className="card-body">
                  <h2 className="card-title">{project.title}</h2>
                  <p className="card-desc">{project.description}</p>

                  {project.tags?.length > 0 && (
                    <div className="card-tags">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="card-tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="card-divider" />

                  <div className="card-links">
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="card-link card-link-primary">
                        <FontAwesomeIcon icon={icon} />
                        {label}
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link card-link-secondary">
                        <FontAwesomeIcon icon={faGithub} />
                        GitHub
                      </a>
                    )}
                    {project.download && (
                      <a href={project.download} target="_blank" rel="noopener noreferrer" className="card-link card-link-secondary">
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </>
  );
}