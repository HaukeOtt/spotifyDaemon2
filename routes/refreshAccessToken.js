const config = require("../config");
const spotify = require("../services/spotify_api");
const {SPOTIFY_ACCESS_TOKEN, redirectUri} = require("../config");
const querystring = require("querystring");
module.exports = (req, res, next) => {
    (async () => {

        const refreshToken = typeof req.cookies[config.SPOTIFY_REFRESH_TOKEN] == "string" ? req.cookies[config.SPOTIFY_REFRESH_TOKEN] : null

        if (!refreshToken) {
            console.log('no refreshToken')
            // todo route for login
            res.redirect('/login/')
            return
        }

        const resp = await spotify.getRefreshToken(refreshToken)
        if (resp.error) {
            console.error('refreshAccessToken error:',resp.error,'description:',resp.error_description)
            req.query.message =
                res.redirect('/error?' + querystring.stringify({message: 'refreshAccessToken error: ' + resp.error}))
            return
        }

        const accessToken = resp.access_token

        if (!accessToken) {
            console.log('no accessToken')
            // todo route for login
            res.redirect('/login/')
            return
        }

        // store token as cookie
        res.cookie(SPOTIFY_ACCESS_TOKEN, accessToken)
        req.cookies[SPOTIFY_ACCESS_TOKEN] = accessToken

        next()
    })()
}

