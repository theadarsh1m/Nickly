const express = require("express");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const urlRoute = require("./routes/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("mongodb connected")
);

app.use(express.json());  // Express built-in middleware to parse JSON

app.use("/url", urlRoute);  // All routes inside urlRoute will be prefixed with /url
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
  `Server started at ${PORT}`;
});
