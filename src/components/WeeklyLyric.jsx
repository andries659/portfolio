import React, { useEffect, useRef, useState } from 'react';

// ===== Update this whenever you want to change the weekly lyric =====
const LYRIC = {
  audioSrc: '/audio/the-greatest.mp3', // ← your audio file path
  lines: [
    { t: 0.0,  text: 'The greatest, ooh' },
    { t: 3.2,  text: 'I, I loved you and I still do' },
    { t: 7.5,  text: 'Just wanted passion from you' },
    { t: 11.8, text: 'Just wanted what I gave you' },
    { t: 16.0, text: 'I waited and waited' },
  ],
  song: 'THE GREATEST',
  artist: 'Billie Eilish',
  album: 'HIT ME HARD AND SOFT',
};
// ====================================================================

export default function WeeklyLyric() {
  const audioRef = useRef(null);
  const [activeLine, setActiveLine] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [metaVisible, setMetaVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setMetaVisible(true), 400);
  }, []);

  const handleTimeUpdate = () => {
    const t = audioRef.current?.currentTime ?? 0;
    const dur = audioRef.current?.duration ?? 0;
    setCurrentTime(t);
    setProgress(dur ? (t / dur) * 100 : 0);

    // Find the last line whose timestamp has passed
    let next = -1;
    for (let i = LYRIC.lines.length - 1; i >= 0; i--) {
      if (t >= LYRIC.lines[i].t) { next = i; break; }
    }
    setActiveLine(next);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const seek = (e) => {
    const bar = e.currentTarget;
    const pct = e.nativeEvent.offsetX / bar.clientWidth;
    if (audioRef.current) {
      audioRef.current.currentTime = pct * (audioRef.current.duration || 0);
    }
  };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div className="weekly-lyric-block">
      <p className="weekly-lyric-label">// Weekly Lyric</p>

      {/* Player */}
      <div className="weekly-lyric-player">
        <button className="weekly-lyric-playbtn" onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying
            ? <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><rect x="1" y="0" width="3" height="11"/><rect x="7" y="0" width="3" height="11"/></svg>
            : <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor"><polygon points="1,0 11,5.5 1,11"/></svg>
          }
        </button>
        <div className="weekly-lyric-progress-wrap">
          <div className="weekly-lyric-progress-bg" onClick={seek}>
            <div className="weekly-lyric-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="weekly-lyric-time">{fmt(currentTime)} / {fmt(duration)}</span>
        </div>
      </div>

      {/* Lyrics */}
      <div className="weekly-lyric-lines">
        {LYRIC.lines.map((line, i) => (
          <p
            key={i}
            className={`weekly-lyric-line ${
              i === activeLine ? 'active' : i < activeLine ? 'past' : ''
            }`}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* Meta */}
      {(LYRIC.song || LYRIC.artist) && (
        <div className={`weekly-lyric-meta ${metaVisible ? 'revealed' : ''}`}>
          {LYRIC.song && <span className="weekly-lyric-song">{LYRIC.song}</span>}
          {LYRIC.song && LYRIC.artist && <span className="weekly-lyric-sep">—</span>}
          {LYRIC.artist && <span className="weekly-lyric-artist">{LYRIC.artist}</span>}
          {LYRIC.artist && LYRIC.album && <span className="weekly-lyric-sep">—</span>}
          {LYRIC.album && <span className="weekly-lyric-artist">{LYRIC.album}</span>}
        </div>
      )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={LYRIC.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <style>{`
        /* ... keep your existing styles, then add: */

        .weekly-lyric-player {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1.1rem;
          padding: 0.6rem 0.8rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 2px;
        }

        .weekly-lyric-playbtn {
          width: 28px; height: 28px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          background: transparent;
          color: var(--accent);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }
        .weekly-lyric-playbtn:hover { background: var(--accent); color: #000; }

        .weekly-lyric-progress-wrap {
          flex: 1;
          display: flex; flex-direction: column; gap: 0.3rem;
        }

        .weekly-lyric-progress-bg {
          height: 3px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          cursor: pointer;
        }

        .weekly-lyric-progress-fill {
          height: 100%;
          background: var(--accent);
          border-radius: 2px;
          transition: width 0.1s linear;
          pointer-events: none;
        }

        .weekly-lyric-time {
          font-family: 'Courier New', monospace;
          font-size: 0.6rem;
          color: rgba(255,255,255,0.3);
        }

        /* Updated line states */
        .weekly-lyric-line {
          /* keep your existing styles */
          color: rgba(255,255,255,0.2);
          transition: color 0.35s ease, transform 0.35s ease, text-shadow 0.35s ease;
        }

        .weekly-lyric-line.past {
          color: rgba(255,255,255,0.3);
        }

        .weekly-lyric-line.active {
          color: var(--color);
          transform: translateX(4px);
          text-shadow: 0 0 30px rgba(255,255,255,0.2);
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
