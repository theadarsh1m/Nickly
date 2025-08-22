const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({  // mongoose.Schema(...) → built-in Mongoose class used to define a structure for documents in MongoDB.
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
}, { timestamps: true });  // { timestamps: true } → automatically adds createdAt and updatedAt fields.

const URL = mongoose.model("url", urlSchema); // This connects the schema (urlSchema) with the MongoDB collection "urls" (Mongoose automatically pluralizes url → urls).
// mongoose.model("url", urlSchema) → creates a model class called URL for CRUD operations.

module.exports = URL;