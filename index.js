const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRouter = require('./routes/staticRouter');

const baseURL = process.env.BASE_URL || 'http://localhost:8001';
 
const app = express();
const PORT = process.env.PORT || 8001;

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://2k23cs2312635:ClayTWIDW0oGBWdZ@cluster0.nxj2fhk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

connectToMongoDB(MONGO_URI);

// connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
//   console.log("mongodb connected")
// );

app.set("view engine", "ejs"); // set view engine
app.set("views", path.resolve("./views"));

app.use(express.json());  // Express built-in middleware to parse JSON
app.use(express.urlencoded({ extended: false }));

app.get("/test", async(req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
    baseURL,
  });
});

app.use("/url", urlRoute);  // All routes inside urlRoute will be prefixed with /url

app.use("/", staticRouter);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );

  if (!entry) {
    return res.status(404).send("Short URL not found");
  }

  res.redirect(entry.redirectURL); // .redirect() → a built-in Express function that tells the browser/client to go to a different URL.
});

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});

