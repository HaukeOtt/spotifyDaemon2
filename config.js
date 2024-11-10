require('dotenv').config()

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const baseUrl = process.env.BASE_URL
const LOGIN_REDIRECT_URI = baseUrl+'/login/callback'

const SCOPE = 'user-read-email user-library-read playlist-modify-public playlist-modify-private';

const SPOTIFY_ACCESS_TOKEN = 'sat'
const SPOTIFY_REFRESH_TOKEN = 'srt'
const LIKED_SONGS_PLAYLIST_ID = 'liked_songs_playlist_id'

const TITLE = 'Spotify Daemon'

module.exports = {clientId, clientSecret, SPOTIFY_ACCESS_TOKEN,SPOTIFY_REFRESH_TOKEN, baseUrl,TITLE,LIKED_SONGS_PLAYLIST_ID,LOGIN_REDIRECT_URI,SCOPE}
