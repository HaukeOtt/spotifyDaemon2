const config = require("../config");

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

const getRefreshToken = async (refreshToken) => {

    const url = "https://accounts.spotify.com/api/token";

    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: config.clientId
        }),
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

module.exports = {getToken, getRefreshToken,getProfile}