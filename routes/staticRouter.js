const express = require('express');
const URL = require("../models/url");
const router = express.Router(); // to handle modular routes.

const baseURL = process.env.BASE_URL || 'http://localhost:8001';

router.get("/", async (req, res) => {
    const allurls = await URL.find({}); // gets all urls from database
    return res.render("home", {
        urls: allurls,
        baseURL,
    });
})

module.exports = router;
