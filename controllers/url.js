const { nanoid } = require('nanoid'); // got this form npm js or nanoid github
// shortid(4); //=> "oAIa"
const URL = require('../models/url');

const PORT = process.env.PORT || 8001;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

async function handleGenerateNewShortUrl(req, res) {
    const body = req.body; //  data sent by client (POST request).
    if(!body.url) return res.status(400).json({ error: 'url is required'});
    const shortId = nanoid(8);
    await URL.create({     // URL.create(...) → Mongoose method to insert a new document in MongoDB.
        shortId: shortId,
        redirectURL:  body.url,
        visitHistory: [],
    });

    return res.render("home", {
        id: shortId,
        baseURL,
    })
    // return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId; // req.params.shortId → dynamic parameter in URL (/analytics/:shortId).
    const result = await URL.findOne({ shortId });  // URL.findOne(...) → Mongoose method to find a single document.
    return res.render("analytics", {
    shortId: result.shortId,
    redirectURL: result.redirectURL,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
    baseURL: process.env.BASE_URL || "http://localhost:8001"
  });
}

module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics,
}