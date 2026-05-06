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

// STEP 1: Login
app.get('/login', (req, res) => {
  const scope = [
    'user-read-currently-playing',
    'user-top-read'
  ].join(' ');

  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${REDIRECT_URI}`
  );
});

// STEP 2: Callback
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

// 🔥 Top Tracks
app.get('/top-tracks', async (req, res) => {
  const r = await axios.get(
    'https://api.spotify.com/v1/me/top/tracks?limit=6',
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );

  res.json(r.data.items);
});

// 🔥 Currently Playing
app.get('/now-playing', async (req, res) => {
  const r = await axios.get(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      headers: { Authorization: `Bearer ${access_token}` }
    }
  );

  res.json(r.data);
});

app.listen(3001, '0.0.0.0', () => console.log('Spotify server running'));