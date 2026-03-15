import React, { useEffect, useRef } from 'react';
import Portfolio from './components/Portfolio';

function App() {
  const canvasRef = useRef(null);

  // Animated starfield / particle grid background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      opacity: Math.random(),
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.y += s.speed;
        if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 220, 180, ${s.opacity * 0.6})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <>
      {/* Global styles injected via style tag */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #050d0a;
          color: #e0ffe8;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .app-root {
          min-height: 100vh;
          position: relative;
        }

        .bg-canvas {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.5;
        }

        /* Scanline overlay */
        .scanlines {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
        }

        /* Green glow vignette */
        .vignette {
          position: fixed;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background: radial-gradient(ellipse at 50% 0%, rgba(40,255,120,0.07) 0%, transparent 65%),
                      radial-gradient(ellipse at 50% 100%, rgba(20,180,80,0.05) 0%, transparent 60%);
        }

        .content {
          position: relative;
          z-index: 2;
        }

        /* Header */
        .header {
          padding: 3rem 2rem 3rem;
          max-width: 900px;
          margin: 0 auto;
          text-align: left;
        }

        .header-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.25em;
          color: #3dffa0;
          text-transform: uppercase;
          margin-bottom: 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-eyebrow::before {
          content: '';
          display: inline-block;
          width: 2.5rem;
          height: 1px;
          background: #3dffa0;
        }

        .header-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.8rem, 7vw, 5.5rem);
          line-height: 0.95;
          letter-spacing: -0.03em;
          color: #e8fff2;
          margin-bottom: 2rem;
        }

        .header-title .accent {
          color: #3dffa0;
          display: block;
        }

        .header-divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, #3dffa0 0%, rgba(61,255,160,0.1) 60%, transparent 100%);
          margin-bottom: 1.8rem;
        }

        .header-bio {
          font-family: 'Space Mono', monospace;
          font-size: 0.85rem;
          line-height: 1.9;
          color: #7ecca4;
          max-width: 520px;
        }

        .header-bio span {
          color: #3dffa0;
          font-style: italic;
        }

        .header-stack {
          margin-top: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .stack-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: #3a7a5a;
          text-transform: uppercase;
          margin-right: 0.3rem;
        }

        .stack-tag {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          padding: 0.25rem 0.7rem;
          border: 1px solid rgba(61,255,160,0.25);
          color: #3dffa0;
          border-radius: 2px;
          background: rgba(61,255,160,0.05);
          letter-spacing: 0.05em;
        }

        /* Animated fade-in for header */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .header-eyebrow { animation: fadeUp 0.6s ease both; }
        .header-title   { animation: fadeUp 0.6s 0.12s ease both; }
        .header-divider { animation: fadeUp 0.6s 0.22s ease both; }
        .header-bio     { animation: fadeUp 0.6s 0.32s ease both; }
        .header-stack   { animation: fadeUp 0.6s 0.42s ease both; }

        /* Main content wrapper */
        .main-content {
          position: relative;
          z-index: 2;
          padding: 0 1rem 5rem;
        }

      `}</style>

      <div className="app-root">
        <canvas ref={canvasRef} className="bg-canvas" />
        <div className="scanlines" />
        <div className="vignette" />

        <div className="content">
          <header className="header">
            <p className="header-eyebrow">Developer &amp; Modder</p>
            <h1 className="header-title">
              .angel24.
              <span className="accent">Projects</span>
            </h1>
            <div className="header-divider" />
            <p className="header-bio">
              I love to code. My goal is to master <span>most coding languages</span> so I can
              build complex things — including <span>Among Us mods</span> and beyond.
            </p>
            <div className="header-stack">
              <span className="stack-label">Built with</span>
              {['React', 'TailwindCSS', 'Vite'].map((t) => (
                <span key={t} className="stack-tag">{t}</span>
              ))}
            </div>
          </header>

          <main className="main-content">
            <Portfolio />
          </main>
        </div>
      </div>
    </>
  );
}

export default App;