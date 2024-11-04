
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const baseUrl = process.env.BASE_URL

const SPOTIFY_ACCESS_TOKEN = 'sat'
const SPOTIFY_REFRESH_TOKEN = 'srt'
const LIKED_SONGS_PLAYLIST_ID = 'liked_songs_playlist_id'

const TITLE = 'Spotify Daemon'

module.exports = {clientId, clientSecret, redirectUri: redirectUrl, SPOTIFY_ACCESS_TOKEN,SPOTIFY_REFRESH_TOKEN, baseUrl,TITLE,LIKED_SONGS_PLAYLIST_ID}
module.exports = {clientId, clientSecret, SPOTIFY_ACCESS_TOKEN,SPOTIFY_REFRESH_TOKEN, baseUrl,TITLE,LIKED_SONGS_PLAYLIST_ID}