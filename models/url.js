const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    entryType: {
      type: String,
      enum: ["url", "text"],
      default: "url",
    },
    redirectURL: {
      type: String,
      required: function () {
        return this.entryType === "url";
      },
    },
    textContent: {
      type: String,
      required: function () {
        return this.entryType === "text";
      },
    },
    visitHistory: [{ timestamp: { type: Number } }],
  },
  { timestamps: true }
);

const URL = mongoose.model("url", urlSchema);

module.exports = URL;
