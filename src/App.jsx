import React, { useEffect, useRef, useState } from 'react';
import Portfolio from './components/Portfolio';
import './App.css';

// ===== Theme Definitions =====
const THEMES = [
  { id: 'green',  label: 'Green',  bg: '#050d0a', color: '#e0ffe8', accent: '#3dffa0', starRgb: '120, 220, 180', vignette: 'rgba(40,255,120,0.1)' },
  { id: 'purple', label: 'Purple', bg: '#0a0510', color: '#f3e8ff', accent: '#c084fc', starRgb: '180, 120, 255', vignette: 'rgba(160,80,255,0.1)' },
  { id: 'red',    label: 'Red',    bg: '#0d0505', color: '#ffe8e8', accent: '#ff5f6d', starRgb: '255, 100, 100', vignette: 'rgba(255,60,60,0.1)' },
  { id: 'blue',   label: 'Blue',   bg: '#030810', color: '#e8f4ff', accent: '#38bdf8', starRgb: '80, 180, 255',  vignette: 'rgba(40,160,255,0.1)' },
  { id: 'amber',  label: 'Amber',  bg: '#0d0900', color: '#fff8e8', accent: '#fbbf24', starRgb: '255, 200, 60',  vignette: 'rgba(255,180,30,0.1)' },
];

function App() {
  const canvasRef = useRef(null);
  const starRgbRef = useRef(THEMES[0].starRgb);

  const [time, setTime] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [themeIndex, setThemeIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);

  const theme = THEMES[themeIndex];
  const fullText = '.angel24.';

  // Sync CSS variables + canvas color on theme change
  useEffect(() => {
    starRgbRef.current = theme.starRgb;
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--color', theme.color);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--vignette', theme.vignette);
    document.body.style.background = theme.bg;
  }, [theme]);

  // ===== Live Clock =====
  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
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

    const safeFetch = async (url, setter) => {
      try {
        const res = await fetch(url);
        if (res.status === 429) {
          console.warn(`Rate limited. Retry after ${res.headers.get('retry-after')}s`);
          return;
        }
        if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
        setter(await res.json());
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    safeFetch(`${SERVER}/top-tracks`, setSongs);
    safeFetch(`${SERVER}/now-playing`, setNowPlaying);

    const nowInterval    = setInterval(() => safeFetch(`${SERVER}/now-playing`, setNowPlaying), 5000);
    const tracksInterval = setInterval(() => safeFetch(`${SERVER}/top-tracks`, setSongs), 30 * 60 * 1000);

    return () => { clearInterval(nowInterval); clearInterval(tracksInterval); };
  }, []);

  // ===== Star Background =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width  = (canvas.width  = window.innerWidth);
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
        ctx.fillStyle = `rgba(${starRgbRef.current}, ${s.opacity * 0.6})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }

    draw();
    const onResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  const cycleTheme = () => setThemeIndex((themeIndex + 1) % THEMES.length);

  return (
    <div className="app-root">
      <canvas ref={canvasRef} className="bg-canvas" />
      <div className="scanlines" />
      <div className="vignette" />

      <div className="content">
        <header className="header">
          <h1 className="header-title">
            {displayText}
            <span className="accent-text">Projects</span>
          </h1>

          <div className="header-time">My local time: {time}</div>

          <button className="theme-toggle" onClick={cycleTheme}>
            Switch Theme: {theme.label}
          </button>

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
                    <p className="now-playing-label">▶ Now Playing</p>
                    <h3>{nowPlaying.item.name}</h3>
                    <span>{nowPlaying.item.artists[0].name}</span>
                    <span className="sub-text">{nowPlaying.item.album.name}</span>
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
                  >
                    <img src={song.album.images[1].url} alt={song.name} />
                    <div>
                      <p>{song.name}</p>
                      <span>{song.artists[0].name}</span>
                      <span className="sub-text">{song.album.name}</span>
                      <span className="open-spotify">↗ open in spotify</span>
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
  );
}

export default App;
