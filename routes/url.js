const express = require("express");
const {
  handleGenerateNewShortUrl,
  handleGenerateNewTextSnippet,
  handleGetAnalytics,
} = require("../controllers/url");

const router = express.Router(); // to handle modular routes.

router.post("/", handleGenerateNewShortUrl);
router.post("/text", handleGenerateNewTextSnippet);

router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router;
