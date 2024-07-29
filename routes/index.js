const express = require('express');
const config = require('../config')
const spotify = require("../services/spotify_api");
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    const message = req.query.message ?? null

    const accessToken = typeof req.cookies[config.SPOTIFY_ACCESS_TOKEN] == "string" ? req.cookies[config.SPOTIFY_ACCESS_TOKEN] : null
    const refreshToken = typeof req.cookies[config.SPOTIFY_REFRESH_TOKEN] == "string" ? req.cookies[config.SPOTIFY_REFRESH_TOKEN] : null

    const userData = await spotify.getProfile(accessToken)

    if (!accessToken || !refreshToken || userData.error) {
        res.render('index', {title: config.TITLE, userData: false, message: "not logged in"});
        return
    }

    res.render('index', {title: config.TITLE, userData, message});
});

module.exports = router;
