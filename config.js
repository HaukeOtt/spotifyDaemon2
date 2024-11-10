require('dotenv').config()
const CLIENT_ID = process.env.CLIENT_ID;
if (CLIENT_ID === undefined) {
    throw new Error("environment variable CLIENT_ID not set")
}
const CLIENT_SECRET = process.env.CLIENT_SECRET;
if (CLIENT_SECRET === undefined) {
    throw new Error("environment variable CLIENT_SECRET not set")
}
const BASE_URL = process.env.BASE_URL
if (BASE_URL === undefined) {
    throw new Error("environment variable BASE_URL not set")
}
const LOGIN_REDIRECT_URI = BASE_URL + '/login/callback'

const SCOPE = 'user-read-email user-library-read playlist-modify-public playlist-modify-private';

const SPOTIFY_ACCESS_TOKEN = 'sat'
const SPOTIFY_REFRESH_TOKEN = 'srt'
const LIKED_SONGS_PLAYLIST_ID = 'liked_songs_playlist_id'

const TITLE = 'Spotify Daemon'

module.exports = { CLIENT_ID, CLIENT_SECRET, SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN, BASE_URL, TITLE, LIKED_SONGS_PLAYLIST_ID, LOGIN_REDIRECT_URI, SCOPE }
