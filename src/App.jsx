import React, { useEffect, useRef, useState } from 'react';
import Portfolio from './components/Portfolio';

function App() {
  const canvasRef = useRef(null);

  // ===== State =====
  const [time, setTime] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [theme, setTheme] = useState('green');

  const fullText = ".angel24.";

  // ===== Live Clock =====
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-GB', { hour12: false })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ===== Typing Effect =====
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  // ===== Star Background =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
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
        if (s.y > height) {
          s.y = 0;
          s.x = Math.random() * width;
        }

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
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&family=Syne:wght@400;600;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #050d0a;
          color: #e0ffe8;
          font-family: 'Syne', sans-serif;
        }

        .app-root {
          min-height: 100vh;
          position: relative;
        }

        .app-root.purple {
          background: #0a0510;
          color: #f3e8ff;
        }

        .bg-canvas {
          position: fixed;
          inset: 0;
          opacity: 0.5;
          pointer-events: none;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.04) 2px,
            rgba(0,0,0,0.04) 4px
          );
        }

        .vignette {
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at top, rgba(40,255,120,0.1), transparent);
        }

        .content {
          position: relative;
          z-index: 2;
        }

        .header {
          padding: 3rem 2rem;
          max-width: 900px;
          margin: auto;
        }

        .header-title {
          font-size: clamp(3rem, 6vw, 5rem);
          font-weight: 800;
        }

        .accent {
          display: block;
          color: #3dffa0;
        }

        .header-time {
          margin-top: 1rem;
          font-family: 'Space Mono';
          color: #3dffa0;
        }

        .theme-toggle {
          margin-top: 1rem;
          border: 1px solid #3dffa0;
          background: transparent;
          color: #3dffa0;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
        }

        /* ABOUT BLOCK */
        .about-block {
          margin-top: 3rem;
          padding: 1.5rem;
          border: 1px solid rgba(61,255,160,0.2);
          background: rgba(61,255,160,0.03);
        }

        .about-block h2 {
          color: #3dffa0;
          margin-bottom: 1rem;
        }

        .about-text {
          font-family: 'Space Mono';
          font-size: 0.85rem;
          line-height: 1.8;
        }

        .about-section {
          margin-top: 1.5rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          border: 1px solid rgba(61,255,160,0.3);
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
        }

        .songs {
          font-family: 'Space Mono';
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
      `}</style>

      <div className={`app-root ${theme}`}>
        <canvas ref={canvasRef} className="bg-canvas" />
        <div className="scanlines" />
        <div className="vignette" />

        <div className="content">
          <header className="header">
            <h1 className="header-title">
              {displayText}
              <span className="accent">Projects</span>
            </h1>

            <div className="header-time">{time}</div>

            <button
              className="theme-toggle"
              onClick={() => setTheme(theme === 'green' ? 'purple' : 'green')}
            >
              switch theme
            </button>

            {/* ABOUT BLOCK */}
            <div className="about-block">
              <h2>About Me</h2>

              <p className="about-text">
                I love to code. My goal is to master <span>most coding languages</span> so I can
                build complex things — including <span>Among Us mods</span> and beyond.
              </p>

              <div className="about-section">
                <h3>Coding Languages</h3>
                <div className="tags">
                  {['C#', 'JavaScript', 'HTML', 'CSS', 'Python'].map((lang) => (
                    <span key={lang} className="tag">{lang}</span>
                  ))}
                </div>
              </div>

              <div className="about-section">
                <h3>Liked Songs</h3>
                <ul className="songs">
                  <li>Song 1</li>
                  <li>Song 2</li>
                  <li>Song 3</li>
                  <li>Song 4</li>
                  <li>Song 5</li>
                </ul>
              </div>
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
