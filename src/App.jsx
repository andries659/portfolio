import React, { useEffect, useRef, useState } from 'react';
import Portfolio from './components/Portfolio';

// ===== Theme Definitions =====
const THEMES = [
  {
    id: 'green',
    label: 'Green',
    bg: '#050d0a',
    color: '#e0ffe8',
    accent: '#3dffa0',
    starRgb: '120, 220, 180',
    vignette: 'rgba(40,255,120,0.1)',
  },
  {
    id: 'purple',
    label: 'Purple',
    bg: '#0a0510',
    color: '#f3e8ff',
    accent: '#c084fc',
    starRgb: '180, 120, 255',
    vignette: 'rgba(160,80,255,0.1)',
  },
  {
    id: 'red',
    label: 'Red',
    bg: '#0d0505',
    color: '#ffe8e8',
    accent: '#ff5f6d',
    starRgb: '255, 100, 100',
    vignette: 'rgba(255,60,60,0.1)',
  },
  {
    id: 'blue',
    label: 'Blue',
    bg: '#030810',
    color: '#e8f4ff',
    accent: '#38bdf8',
    starRgb: '80, 180, 255',
    vignette: 'rgba(40,160,255,0.1)',
  },
  {
    id: 'amber',
    label: 'Amber',
    bg: '#0d0900',
    color: '#fff8e8',
    accent: '#fbbf24',
    starRgb: '255, 200, 60',
    vignette: 'rgba(255,180,30,0.1)',
  },
];

function App() {
  const canvasRef = useRef(null);
  const starRgbRef = useRef(THEMES[0].starRgb);

  // ===== State =====
  const [time, setTime] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [themeIndex, setThemeIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);

  const theme = THEMES[themeIndex];
  const fullText = ".angel24.";

  // Keep starRgbRef in sync so canvas always uses current theme color
  useEffect(() => {
    starRgbRef.current = theme.starRgb;
  }, [theme]);

  // ===== Live Clock =====
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour12: false }));
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

  // ===== Spotify Data =====
  useEffect(() => {
    const SERVER = 'https://portfolio-ep8j.onrender.com';
    const load = () => {
      fetch(`${SERVER}/top-tracks`)
        .then(res => { if (!res.ok) throw new Error(`top-tracks: ${res.status}`); return res.json(); })
        .then(data => setSongs(data))
        .catch(err => console.error('top-tracks failed:', err));

      fetch(`${SERVER}/now-playing`)
        .then(res => { if (!res.ok) throw new Error(`now-playing: ${res.status}`); return res.json(); })
        .then(data => setNowPlaying(data))
        .catch(err => console.error('now-playing failed:', err));
    };
    load();
    const interval = setInterval(load, 5000);
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
        if (s.y > height) { s.y = 0; s.x = Math.random() * width; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRgbRef.current}, ${s.opacity * 0.6})`;
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

  const cycleTheme = () => setThemeIndex((themeIndex + 1) % THEMES.length);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono&family=Syne:wght@400;600;800&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: ${theme.bg};
          color: ${theme.color};
          font-family: 'Syne', sans-serif;
          transition: background 0.4s, color 0.4s;
        }

        .app-root {
          min-height: 100vh;
          position: relative;
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
          background: radial-gradient(circle at top, ${theme.vignette}, transparent);
          transition: background 0.4s;
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
          color: ${theme.accent};
          transition: color 0.4s;
        }

        .header-time {
          margin-top: 1rem;
          font-family: 'Space Mono';
          color: ${theme.accent};
          transition: color 0.4s;
        }

        .theme-toggle {
          margin-top: 1rem;
          border: 1px solid ${theme.accent};
          background: transparent;
          color: ${theme.accent};
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          font-family: 'Space Mono';
          font-size: 0.8rem;
          transition: border-color 0.4s, color 0.4s, box-shadow 0.2s;
        }

        .theme-toggle:hover {
          box-shadow: 0 0 10px ${theme.accent}55;
        }

        /* ABOUT BLOCK */
        .about-block {
          margin-top: 3rem;
          padding: 1.5rem;
          border: 1px solid ${theme.accent}33;
          background: ${theme.accent}08;
          transition: border-color 0.4s, background 0.4s;
        }

        .about-block h2 {
          color: ${theme.accent};
          margin-bottom: 1rem;
          transition: color 0.4s;
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
          border: 1px solid ${theme.accent}4d;
          padding: 0.2rem 0.6rem;
          font-size: 0.7rem;
          transition: border-color 0.4s;
        }

        .songs {
          font-family: 'Space Mono';
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }

        /* NOW PLAYING */
        .now-playing {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid ${theme.accent}4d;
          margin-bottom: 2rem;
          align-items: center;
          animation: pulseGlow 2s infinite;
          transition: border-color 0.4s;
        }

        .now-playing img {
          width: 64px;
          height: 64px;
          object-fit: cover;
        }

        .now-playing p {
          font-size: 0.7rem;
          color: ${theme.accent};
          font-family: 'Space Mono';
          margin-bottom: 0.25rem;
          transition: color 0.4s;
        }

        .now-playing h3 {
          font-size: 0.95rem;
          margin-bottom: 0.15rem;
        }

        .now-playing span {
          font-size: 0.8rem;
          font-family: 'Space Mono';
          opacity: 0.7;
        }

        @keyframes pulseGlow {
          0%   { box-shadow: 0 0 5px ${theme.accent}33; }
          50%  { box-shadow: 0 0 20px ${theme.accent}80; }
          100% { box-shadow: 0 0 5px ${theme.accent}33; }
        }

        /* SONGS GRID */
        .songs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .song-card {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-decoration: none;
          color: inherit;
          border: 1px solid ${theme.accent}26;
          padding: 0.75rem;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.4s;
        }

        .song-card img {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }

        .song-card p {
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .song-card span {
          font-size: 0.7rem;
          font-family: 'Space Mono';
          opacity: 0.6;
        }

        .song-card:hover {
          transform: scale(1.05);
          box-shadow: 0 0 25px ${theme.accent}40;
        }

        .open-spotify {
          color: ${theme.accent} !important;
          transition: opacity 0.2s, color 0.4s;
        }

        @media (max-width: 600px) {
          .header { padding: 2rem 1rem; }
          .songs-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
          .song-card p { font-size: 0.75rem; }
          .now-playing { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
          .now-playing img { width: 100%; height: auto; aspect-ratio: 1; }
          .now-playing h3 { font-size: 0.85rem; }
          .header-title { font-size: clamp(2rem, 10vw, 4rem); }
        }
      `}</style>

      <div className="app-root">
        <canvas ref={canvasRef} className="bg-canvas" />
        <div className="scanlines" />
        <div className="vignette" />

        <div className="content">
          <header className="header">
            <h1 className="header-title">
              {displayText}
              <span className="accent">Projects</span>
            </h1>

            <div className="header-time">My local time: {time}</div>

            <button className="theme-toggle" onClick={cycleTheme}>
              Switch Theme: {theme.label}
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

                {nowPlaying?.item && (
                  <div className="now-playing">
                    <img src={nowPlaying.item.album.images[1].url} alt={nowPlaying.item.name} />
                    <div>
                      <p>▶ Now Playing</p>
                      <h3>{nowPlaying.item.name}</h3>
                      <span>{nowPlaying.item.artists[0].name}</span>
                      <span style={{ display: 'block', fontSize: '0.65rem', opacity: 0.45, fontFamily: 'Space Mono', marginTop: '0.2rem' }}>
                        {nowPlaying.item.album.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="songs-grid">
                  {songs.map(song => (
                    <a
                      key={song.id}
                      href={song.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="song-card"
                      onMouseEnter={(e) => { e.currentTarget.querySelector('.open-spotify').style.opacity = '1'; }}
                      onMouseLeave={(e) => { e.currentTarget.querySelector('.open-spotify').style.opacity = '0'; }}
                    >
                      <img src={song.album.images[1].url} alt={song.name} />
                      <div>
                        <p>{song.name}</p>
                        <span>{song.artists[0].name}</span>
                        <span style={{ display: 'block', fontSize: '0.65rem', opacity: 0.45, fontFamily: 'Space Mono', marginTop: '0.2rem' }}>
                          {song.album.name}
                        </span>
                        <span className="open-spotify" style={{
                          display: 'block',
                          fontSize: '0.65rem',
                          fontFamily: 'Space Mono',
                          opacity: 0,
                          marginTop: '0.3rem'
                        }}>
                          ↗ open in spotify
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
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
