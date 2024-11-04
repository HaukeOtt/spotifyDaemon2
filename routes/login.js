const express = require('express');
const config = require('../config');
const querystring = require('querystring');
const {SPOTIFY_ACCESS_TOKEN, SPOTIFY_REFRESH_TOKEN} = require("../config");
const {getToken} = require("../services/spotify_api");
const router = express.Router();

/* GET home page. */

router.get('/logout',function (req,res,next){

    // todo actually logging out of spotify the app

    // reset code as cookie
    res.cookie(SPOTIFY_ACCESS_TOKEN, undefined)
    req.cookies[SPOTIFY_ACCESS_TOKEN] = undefined
    res.cookie(SPOTIFY_REFRESH_TOKEN, undefined)
    req.cookies[SPOTIFY_REFRESH_TOKEN] = undefined

    // redirect to index
    res.redirect('/')

})
router.get('/', function (req, res, next) {
    const scope = 'user-read-email user-library-read playlist-modify-public playlist-modify-private';
    const redirect_uri = `${config.baseUrl}/login/callback`
    console.log('login')
    console.log('redirect_uri:', redirect_uri)
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: config.clientId,
            scope: scope,
            redirect_uri: redirect_uri,
        }));

});
router.get('/callback', async function (req, res, next) {
    const code = req.query.code || '';

    const tokenData = await getToken(code)

    if (tokenData.error) {
        console.error('login error:',tokenData.error)

        const message = "login failed: invalid login code"
        res.redirect('/error?' + querystring.stringify({message}))
        return
    }

    // store token as cookie
    res.cookie(SPOTIFY_ACCESS_TOKEN, tokenData.access_token)
    req.cookies[SPOTIFY_ACCESS_TOKEN]= tokenData.access_token
    res.cookie(SPOTIFY_REFRESH_TOKEN, tokenData.refresh_token)
    req.cookies[SPOTIFY_REFRESH_TOKEN]= tokenData.refresh_token

    // redirect to index
    res.redirect('/')
});

module.exports = router;
