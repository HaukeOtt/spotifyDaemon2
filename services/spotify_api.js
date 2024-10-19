const config = require("../config");
const url = require("url");
const {json} = require("express");

function parseParameters(properties) {
    const formatted = []
    for (const property of Object.entries(properties)) {
        const encodedKey = encodeURIComponent(property[0]);
        const encodedValue = encodeURIComponent(property[1]);
        formatted.push(encodedKey + "=" + encodedValue);
    }
    return '?' + formatted.join("&");
}

async function getToken(code,) {

    let authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: config.baseUrl + config.redirectUri,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from((config.clientId + ':' + config.clientSecret)).toString('base64'))
        },
        json: true
    };

    const res = await fetch(authOptions.url,
        {
            method: 'POST',
            headers: authOptions.headers,
            body:
                new URLSearchParams(authOptions.form)
        }
    )

    return await res.json()
}

async function getRefreshToken(refreshToken) {

    let details = {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }
    let formBody = new URLSearchParams(details)
    const url = "https://accounts.spotify.com/api/token";
    const payload = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(config.clientId + ':' + config.clientSecret).toString('base64'))
        },
        body: formBody
    }
    const body = await fetch(url, payload);
    return await body.json();
}

async function getProfile(accessToken) {
    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });
    return await response.json();
}

async function getTracks(accessToken, limit, offset) {
    const url = 'https://api.spotify.com/v1/me/tracks'
        + parseParameters({
            limit: limit ?? 0,
            offset: offset ?? 0
        })

    console.log('url:', url)
    const response = await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });
    return await response.json();
}

async function createPlaylist(accessToken, userId, name, description) {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST",
        headers: {
            Authorization: 'Bearer ' + accessToken,

        },
        body: JSON.stringify({
            name,
            description,
            //todo make pubic
            public: false
        })
    });
    return await response.json();
}

async function addToPlaylist(accessToken, playlistId, trackUris) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    console.log('url:',url)
    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: 'Bearer ' + accessToken,
        },
        body: JSON.stringify({
            uris: trackUris
        })
    });
    return await response.json();
}

async function getUserPlaylists(accessToken, userId) {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + accessToken,

        }
    });
    return response.json()
}

async function getPlaylist(accessToken, playlistId) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + accessToken,
        }
    });
    return response.json()
}

async function getPlaylistTracks(accessToken, playlistId, limit, offset) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
        + parseParameters({
            limit: limit ?? 0,
            offset: offset ?? 0
        })

    console.log('url:', url)
    const response = await fetch(url, {
        headers: {
            Authorization: 'Bearer ' + accessToken
        }
    });
    return await response.json();
}

async function removePlaylistTracks(accessToken, playlistId, trackUris, snapshotId) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`

    console.log('url:', url)
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + accessToken
        },
        body: JSON.stringify({tracks: trackUris, snapshot_id: snapshotId}),
        json: true
    });
    return await response.json();
}

async function getPlaylists(accessToken) {
    const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
        method: "GET",
        headers: {
            Authorization: 'Bearer ' + accessToken,
        }
    });
    return response.json()
}

module.exports = {
    removePlaylistTracks,
    getToken,
    getRefreshToken,
    getProfile,
    getTracks,
    createPlaylist,
    addToPlaylist,
    getUserPlaylists,
    getPlaylists,
    getPlaylist,
    getPlaylistTracks
}