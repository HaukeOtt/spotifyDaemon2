const express = require('express');
const config = require('../config')
const {getProfile} = require("../services/spotify_api");
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {

    const accessToken = req.cookies[config.SPOTIFY_ACCESS_TOKEN]
    const refreshToken = req.cookies[config.SPOTIFY_REFRESH_TOKEN]

    const userData = await getProfile(accessToken)

    if (!accessToken || !refreshToken || userData.error) {
        res.render('index', {title: config.TITLE, userData: false, message: 'not logged in'});
        return
    }


    /*
    //const tokenData = await getRefreshToken(refreshToken)
    const tokenData = {}

    if (tokenData.error) {

        // reset code as cookie
        res.cookie(SPOTIFY_ACCESS_TOKEN, undefined)
        res.cookie(SPOTIFY_REFRESH_TOKEN, undefined)

        // login
        res.redirect('/login')
        return
    }
     */


    res.render('index', {title: config.TITLE, userData: userData,});

});

module.exports = router;
