const express = require('express');
const config = require('../config')
const router = express.Router();
const querystring = require('querystring');

// Route to start the Spotify authentication flow
router.get('/', (req, res) => {
    const redirectTo = req.query.redirect || '/'; // Default redirect if none provided

    const params = querystring.stringify({
        response_type: 'code',
        client_id: config.CLIENT_ID,
        scope: config.SCOPE,
        redirect_uri: config.LOGIN_REDIRECT_URI,
        state: encodeURIComponent(redirectTo), // Use 'state' to store redirect URL
    });

    console.log('redirect to spotify:',params);

    // Redirect user to Spotify's authorization page
    res.redirect(`https://accounts.spotify.com/authorize?${params}`);
});

// Callback route to handle Spotify's response
router.get('/callback', async (req, res) => {

    console.log('login callback')

    const code = req.query.code || null;
    const state = decodeURIComponent(req.query.state) || '/'; // Retrieve the original redirect URL

    if (!code) {
        return res.status(400).send('Authorization code is missing');
    }

    try {

        // Exchange authorization code for access token
        const response = await fetch(
            'https://accounts.spotify.com/api/token?' + querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: config.LOGIN_REDIRECT_URI,
                client_id: config.CLIENT_ID,
                client_secret: config.CLIENT_SECRET,
            }),
            {
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            },
        );

        const responseData = await response.json()
        if (responseData['error']){
            throw responseData
        }
        
        const { access_token, refresh_token, expires_in } = responseData

        // Store tokens in session
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        req.session.expires_at = Date.now() + expires_in * 1000; // Store token expiry time

        // Redirect to the originally intended route
        res.redirect('..'+state);
    } catch (error) {
        console.error(error);
        res.status(500).send('Authentication failed');
    }
});

module.exports = router