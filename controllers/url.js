const { nanoid } = require("nanoid");
const URL = require("../models/url");

const PORT = process.env.PORT || 8001;
const PAGE_LIMIT = 10;
const CUSTOM_ID_PATTERN = /^[a-zA-Z0-9_-]+$/;
const MAX_TEXT_LENGTH = 10000;

function getBaseURL() {
  return process.env.BASE_URL || `http://localhost:${PORT}`;
}

function normalizeCustomId(customId) {
  if (typeof customId !== "string") return "";
  return customId.trim();
}

function normalizeTextInput(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function getSubmittedFormData(body = {}) {
  return {
    url: normalizeTextInput(body.url),
    customId: normalizeCustomId(body.customId),
    text: normalizeTextInput(body.text),
    textCustomId: normalizeCustomId(body.textCustomId),
  };
}

function getCustomIdValidationMessage(customId) {
  if (!CUSTOM_ID_PATTERN.test(customId)) {
    return "Custom short ID can only use letters, numbers, '-' and '_'.";
  }
  return null;
}

async function getHomePageData(page = 1) {
  const safePage = Math.max(Number.parseInt(page, 10) || 1, 1);
  const skip = (safePage - 1) * PAGE_LIMIT;

  const totalUrls = await URL.countDocuments();
  const urls = await URL.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(PAGE_LIMIT)
    .lean();

  return {
    urls,
    currentPage: safePage,
    totalPages: Math.max(1, Math.ceil(totalUrls / PAGE_LIMIT)),
  };
}

async function renderHomeWithPayload(res, payload = {}) {
  const homeData = await getHomePageData(1);
  return res.render("home", {
    ...homeData,
    baseURL: getBaseURL(),
    ...payload,
  });
}

async function handleGenerateNewShortUrl(req, res) {
  try {
    const formData = getSubmittedFormData(req.body);
    const url = formData.url;
    const customId = formData.customId;

    if (!url) {
      return renderHomeWithPayload(res, {
        error: "URL is required.",
        formData,
      });
    }

    if (customId) {
      const idValidationMessage = getCustomIdValidationMessage(customId);
      if (idValidationMessage) {
        return renderHomeWithPayload(res, {
          error: idValidationMessage,
          formData,
        });
      }

      const existingCustom = await URL.findOne({ shortId: customId });
      if (existingCustom) {
        return renderHomeWithPayload(res, {
          error: "Custom short ID is already taken.",
          formData,
        });
      }

      const existingURL = await URL.findOne({
        redirectURL: url,
        $or: [{ entryType: "url" }, { entryType: { $exists: false } }],
      });
      if (existingURL) {
        return renderHomeWithPayload(res, {
          id: existingURL.shortId,
          successType: "url",
        });
      }

      const customURL = await URL.create({
        shortId: customId,
        entryType: "url",
        redirectURL: url,
        visitHistory: [],
      });

      return renderHomeWithPayload(res, {
        id: customURL.shortId,
        successType: "url",
      });
    }

    const existingURL = await URL.findOne({
      redirectURL: url,
      $or: [{ entryType: "url" }, { entryType: { $exists: false } }],
    });
    if (existingURL) {
      return renderHomeWithPayload(res, {
        id: existingURL.shortId,
        successType: "url",
      });
    }

    const shortId = nanoid(8);
    await URL.create({
      shortId,
      entryType: "url",
      redirectURL: url,
      visitHistory: [],
    });

    return renderHomeWithPayload(res, {
      id: shortId,
      successType: "url",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function handleGenerateNewTextSnippet(req, res) {
  try {
    const formData = getSubmittedFormData(req.body);
    const text = formData.text;
    const textCustomId = formData.textCustomId;

    if (!text) {
      return renderHomeWithPayload(res, {
        error: "Text is required.",
        formData,
      });
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return renderHomeWithPayload(res, {
        error: `Text is too long. Maximum allowed characters: ${MAX_TEXT_LENGTH}.`,
        formData,
      });
    }

    if (textCustomId) {
      const idValidationMessage = getCustomIdValidationMessage(textCustomId);
      if (idValidationMessage) {
        return renderHomeWithPayload(res, {
          error: idValidationMessage,
          formData,
        });
      }

      const existingCustom = await URL.findOne({ shortId: textCustomId });
      if (existingCustom) {
        return renderHomeWithPayload(res, {
          error: "Custom short ID is already taken.",
          formData,
        });
      }

      const existingText = await URL.findOne({ entryType: "text", textContent: text });
      if (existingText) {
        return renderHomeWithPayload(res, {
          id: existingText.shortId,
          successType: "text",
        });
      }

      const newTextEntry = await URL.create({
        shortId: textCustomId,
        entryType: "text",
        textContent: text,
        visitHistory: [],
      });

      return renderHomeWithPayload(res, {
        id: newTextEntry.shortId,
        successType: "text",
      });
    }

    const existingText = await URL.findOne({ entryType: "text", textContent: text });
    if (existingText) {
      return renderHomeWithPayload(res, {
        id: existingText.shortId,
        successType: "text",
      });
    }

    const shortId = nanoid(8);
    await URL.create({
      shortId,
      entryType: "text",
      textContent: text,
      visitHistory: [],
    });

    return renderHomeWithPayload(res, {
      id: shortId,
      successType: "text",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId }).lean();

    if (!result) {
      return res.status(404).send("Short URL not found");
    }

    return res.render("analytics", {
      shortId: result.shortId,
      entryType: result.entryType || "url",
      redirectURL: result.redirectURL,
      textContent: result.textContent,
      totalClicks: (result.visitHistory || []).length,
      analytics: result.visitHistory || [],
      baseURL: getBaseURL(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

async function renderHome(req, res) {
  try {
    const homeData = await getHomePageData(req.query.page);
    return res.render("home", {
      ...homeData,
      baseURL: getBaseURL(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGenerateNewTextSnippet,
  handleGetAnalytics,
  renderHome,
};
