const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRouter = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const adminRoute = require("./routes/admin");
const { checkForAuthentication } = require("./middlewares/auth");
const { getBaseURL } = require("./utils/baseUrl");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;
const MONGO_URI = process.env.MONGO_URI;

connectToMongoDB(MONGO_URI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", true);

app.use("/assets", express.static(path.join(__dirname, "assets")));
app.get("/favicon.ico", (req, res) => {
  res.redirect(301, "/assets/nickly-logo.svg");
});
app.get("/sw.js", (req, res) => {
  res.sendFile(path.join(__dirname, "sw.js"));
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.get("/test", async (req, res) => {
  try {
    const allUrls = await URL.find({}).lean();
    return res.render("home", {
      urls: allUrls,
      myUrls: [],
      baseURL: getBaseURL(req),
      currentPage: 1,
      totalPages: 1,
      user: req.user || null,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

app.use("/url", urlRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/", staticRouter);

app.get("/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: { timestamp: Date.now() },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("Short URL not found");
    }

    const entryType = entry.entryType || "url";
    if (entryType === "text") {
      return res.render("text", {
        shortId: entry.shortId,
        textContent: entry.textContent,
        baseURL: getBaseURL(req),
      });
    }

    if (!entry.redirectURL) {
      return res.status(404).send("Destination not found");
    }

    return res.redirect(entry.redirectURL);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
  });
}

module.exports = app;
