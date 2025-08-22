const express = require('express');
const {handleGenerateNewShortUrl, handleGetAnalytics} = require('../controllers/url');

const router = express.Router(); // to handle modular routes.

router.post('/', handleGenerateNewShortUrl);

router.get('/analytics/:shortId', handleGetAnalytics);

module.exports = router;