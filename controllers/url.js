const { nanoid } = require("nanoid"); // got this form npm js or nanoid github
// shortid(4); //=> "oAIa"
const URL = require("../models/url");

const PORT = process.env.PORT || 8001;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;

async function handleGenerateNewShortUrl(req, res) {
  // const body = req.body; //  data sent by client (POST request).
  const { url, customId } = req.body;
  if (!url) return res.status(400).json({ error: "url is required" });

  if (customId && customId.trim() !== "") {
    const existingCustom = await URL.findOne({ shortId: customId });
    if (existingCustom) {
      return res.render("home", {
        error: "Custom short ID is already taken",
        baseURL,
      });
    }
    const existingURL = await URL.findOne({ redirectURL: url });
    if (existingURL) {
      return res.render("home", {
        id: existingURL.shortId,
        baseURL,
      });
    }

    const customURL = await URL.create({
      shortId: customId,
      redirectURL: url,
      visitHistory: [],
    });

    return res.render("home", {
      id: customURL.shortId,
      baseURL,
    });
  }

  const shortId = nanoid(8);

  const existingURL = await URL.findOne({ redirectURL: url });

  if (existingURL) {
    return res.render("home", {
      id: existingURL.shortId,
      baseURL,
    });
  }
  await URL.create({
    // URL.create(...) → Mongoose method to insert a new document in MongoDB.
    shortId: shortId,
    redirectURL: url,
    visitHistory: [],
  });

  return res.render("home", {
    id: shortId,
    baseURL,
  });
  // return res.json({ id: shortId });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId; // req.params.shortId → dynamic parameter in URL (/analytics/:shortId).
  const result = await URL.findOne({ shortId }); // URL.findOne(...) → Mongoose method to find a single document.
  return res.render("analytics", {
    shortId: result.shortId,
    redirectURL: result.redirectURL,
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
    baseURL: process.env.BASE_URL || "http://localhost:8001",
  });
}

async function renderHome(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalUrls = await URL.countDocuments();
    const urls = await URL.find().skip(skip).limit(limit).lean();

    res.render("home", {
      urls,
      baseURL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`,
      currentPage: page,
      totalPages: Math.ceil(totalUrls / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
  renderHome,
};
