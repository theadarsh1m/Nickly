const express = require('express');
const URL = require("../models/url");
const router = express.Router(); // to handle modular routes.
const { renderHome } = require("../controllers/url");

router.get("/", renderHome);

// const baseURL = process.env.BASE_URL || (process.env.PORT ? `https://nickly.onrender.com/` : `http://localhost:${PORT}`);

router.get("/", async (req, res) => {
    const allurls = await URL.find({}); // gets all urls from database
    return res.render("home", {
        urls: allurls,
        baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`
    });
})

module.exports = router;
