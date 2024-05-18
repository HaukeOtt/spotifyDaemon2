const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    const message =  req.query.message
    res.render('error', {message});
});

module.exports = router;
