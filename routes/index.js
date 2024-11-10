const express = require('express');
const config = require('../config')
const spotify = require("../services/spotify_api");
const router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
    const message = req.query.message ?? null
    const userData = await spotify.getProfile(req.session.access_token)
    res.render('index', {title: config.TITLE, userData, message});
});

module.exports = router;
