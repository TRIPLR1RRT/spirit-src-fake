const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { user: req.user });
});

router.get('/legal/terms-of-service', (req, res) => {
    res.render('Legal/terms-of-service', { user: req.user });
});

router.get('/legal/privacy-policy', (req, res) => {
    res.render('Legal/privacy-policy', { user: req.user });
});

router.get('/legal/cookie-policy', (req, res) => {
    res.render('Legal/cookie-policy', { user: req.user });
});

module.exports = router;