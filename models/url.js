const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    shortId : {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    visitHistory: [ { timestamp: { type: Number}}], // array which will have timestamps
}, { timestamps: true });

const URL = mongoose.model("url", urlSchema); // This connects the schema (urlSchema) with the MongoDB collection "urls" (Mongoose automatically pluralizes url → urls).

module.exports = URL;