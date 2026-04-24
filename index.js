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

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8001;
const baseURL = process.env.BASE_URL || `http://localhost:${PORT}`;
const MONGO_URI = process.env.MONGO_URI;

connectToMongoDB(MONGO_URI);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
      baseURL,
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
        baseURL,
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
