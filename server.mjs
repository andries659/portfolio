import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';

const app = express();
app.use(cors());

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

let access_token = '';
let refresh_token = '';

// ===== CACHE STORAGE =====
let cachedTracks = null;
let tracksLastFetch = 0;

let cachedNowPlaying = null;
let nowLastFetch = 0;

// ===== OPTIONAL: token refresh helper =====
async function refreshAccessToken() {
  if (!refresh_token) return;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token
    }),
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  access_token = response.data.access_token;
}

// ===== LOGIN =====
app.get('/login', (req, res) => {
  const scope = [
    'user-read-currently-playing',
    'user-top-read'
  ].join(' ');

  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${REDIRECT_URI}`
  );
});

// ===== CALLBACK =====
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    new URLSearchParams({
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }),
    {
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  access_token = response.data.access_token;
  refresh_token = response.data.refresh_token;

  res.send('Spotify connected. You can close this.');
});


// ==========================
// 🔥 TOP TRACKS (30 min cache)
// ==========================
app.get('/top-tracks', async (req, res) => {
  try {
    const now = Date.now();

    const isCacheValid =
      cachedTracks && now - tracksLastFetch < 30 * 60 * 1000;

    // If cache is valid, return it immediately
    if (isCacheValid) {
      return res.json({
        data: cachedTracks,
        cached: true
      });
    }

    if (!access_token) {
      return res.status(401).json({
        error: 'No access token',
        retryAfter: null
      });
    }

    const r = await axios.get(
      'https://api.spotify.com/v1/me/top/tracks?limit=6',
      {
        headers: { Authorization: `Bearer ${access_token}` }
      }
    );

    cachedTracks = r.data.items;
    tracksLastFetch = now;

    res.json({
      data: cachedTracks,
      cached: false
    });

  } catch (err) {
    const status = err.response?.status;
    const retryAfter = err.response?.headers?.['retry-after'];

    console.error('top-tracks error:', status, err.response?.data || err.message);

    // 🔥 HANDLE RATE LIMIT PROPERLY
    if (status === 429) {
      return res.status(429).json({
        error: 'Rate limited by Spotify',
        retryAfter: retryAfter || 30,
        cached: cachedTracks || []
      });
    }

    // 🔥 TOKEN EXPIRED
    if (status === 401) {
      await refreshAccessToken();

      return res.status(401).json({
        error: 'Token expired, refreshing...',
        retryAfter: null
      });
    }

    res.status(500).json({
      error: 'top tracks failed',
      retryAfter: null
    });
  }
});

// ==========================
// 🔥 NOW PLAYING (5–10 sec cache)
// ==========================
app.get('/now-playing', async (req, res) => {
  try {
    const now = Date.now();

    if (now - nowLastFetch > 5000) {
      if (!access_token) return res.status(401).json({ error: 'No token' });

      const r = await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: { Authorization: `Bearer ${access_token}` }
        }
      );

      cachedNowPlaying = r.data;
      nowLastFetch = now;
    }

    res.json(cachedNowPlaying);
  } catch (err) {
    console.error('now-playing error:', err.response?.data || err.message);

    if (err.response?.status === 401) {
      await refreshAccessToken();
    }

    res.status(500).json({ error: 'now playing failed' });
  }
});

app.listen(3001, '0.0.0.0', () =>
  console.log('Spotify server running')
);
