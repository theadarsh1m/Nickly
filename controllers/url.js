const { nanoid } = require('nanoid'); // got this form npm js or nanoid github
// shortid(4); //=> "oAIa"
const URL = require('../models/url');

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: 'url is required'});
    const shortId = nanoid(8);
    await URL.create({
        shortId: shortId,
        redirectURL:  body.url,
        visitHistory: [],
    });
    return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks:result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
}