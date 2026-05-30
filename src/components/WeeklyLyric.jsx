import React, { useEffect, useState } from 'react';

// ===== Update this whenever you want to change the weekly lyric =====
const LYRIC = {
  lines: [
    '♡ yeah i, i, i',
    'hate that i made you love me',
    'sorry if i made me your type',
    'yeah i, i, i',
    'hate that i made you love me',
    '\'cause i barely tried'
  ],
  song: 'hate that i made you love me',
  artist: 'Ariane Grande',
  album: 'petal (Releases June 31)',
};
// ====================================================================

export default function WeeklyLyric() {
  const [revealedCount, setRevealedCount] = useState(0);
  const [metaVisible, setMetaVisible] = useState(false);

  useEffect(() => {
    LYRIC.lines.forEach((_, i) => {
      setTimeout(() => setRevealedCount(i + 1), 300 + i * 320);
    });
    setTimeout(() => setMetaVisible(true), 300 + LYRIC.lines.length * 320 + 200);
  }, []);

  return (
    <div className="weekly-lyric-block">
      <p className="weekly-lyric-label">// Weekly Lyric</p>

      <div className="weekly-lyric-lines">
        {LYRIC.lines.map((line, i) => (
          <p
            key={i}
            className={`weekly-lyric-line ${i < revealedCount ? 'revealed' : ''}`}
          >
            {line}
          </p>
        ))}
      </div>

      {(LYRIC.song || LYRIC.artist) && (
        <div className={`weekly-lyric-meta ${metaVisible ? 'revealed' : ''}`}>
          {LYRIC.song && <span className="weekly-lyric-song">{LYRIC.song}</span>}
          {LYRIC.song && LYRIC.artist && <span className="weekly-lyric-sep">—</span>}
          {LYRIC.artist && <span className="weekly-lyric-artist">{LYRIC.artist}</span>}
          {LYRIC.artist && LYRIC.album && <span className="weekly-lyric-sep">—</span>}
          {LYRIC.album && <span className="weekly-lyric-artist">{LYRIC.album}</span>}
        </div>
      )}

      <style>{`
        .weekly-lyric-block {
          position: relative;
          margin-top: 1.4rem;
          padding: 1.2rem 1.4rem 1.1rem;
          border: 1px solid rgba(255,255,255,0.08);
          border-left: 3px solid var(--accent);
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(4px);
          border-radius: 2px;
          overflow: hidden;
        }

        .weekly-lyric-block::before {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.012) 3px,
            rgba(255,255,255,0.012) 4px
          );
          pointer-events: none;
        }

        .weekly-lyric-label {
          font-family: 'Courier New', monospace;
          font-size: 0.68rem;
          color: var(--accent);
          opacity: 0.5;
          margin: 0 0 0.85rem;
          letter-spacing: 0.08em;
        }

        .weekly-lyric-lines {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-bottom: 0.9rem;
        }

        .weekly-lyric-line {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 1rem;
          font-style: italic;
          color: var(--color);
          margin: 0;
          opacity: 0;
          transform: translateY(5px);
          transition: opacity 0.45s ease, transform 0.45s ease;
          line-height: 1.6;
        }

        .weekly-lyric-line.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .weekly-lyric-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-family: 'Courier New', monospace;
          font-size: 0.72rem;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .weekly-lyric-meta.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .weekly-lyric-song {
          color: var(--accent);
          font-weight: bold;
          letter-spacing: 0.04em;
        }

        .weekly-lyric-sep {
          color: var(--color);
          opacity: 0.3;
        }

        .weekly-lyric-artist {
          color: var(--color);
          opacity: 0.55;
        }
      `}</style>
    </div>
  );
}
