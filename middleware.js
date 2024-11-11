// Middleware to check for authentication
function checkAuth(req, res, next) {
    console.log('req.session.access_token:', req.session.access_token);

    if (req.session.access_token) {
        next();
    } else {
        // Store the original URL the user is trying to access
        const originalUrl = req.originalUrl;
        // Redirect to /login with the original URL as a query parameter
        res.redirect(`/login?redirect=${encodeURIComponent(originalUrl)}`);
    }
}

// Middleware to refresh the access token if expired
async function refreshToken(req, res, next) {
    console.log('refresh access_token', Date.now() > req.session.expires_at);

    if (Date.now() > req.session.expires_at) {
        try {
            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                querystring.stringify({
                    grant_type: 'refresh_token',
                    refresh_token: req.session.refresh_token,
                    client_id: clientId,
                    client_secret: clientSecret,
                }),
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const { access_token, refresh_token, expires_in } = response.data;

            // Update session with new access token and expiry
            req.session.access_token = access_token;
            req.session.refresh_token = refresh_token
            req.session.expires_at = Date.now() + expires_in * 1000;

            next();
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            res.redirect('/login'); // Redirect to login if refreshing fails
        }
    } else {
        next(); // Token is still valid
    }
}

module.exports = { refreshToken, checkAuth }