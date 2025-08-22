const mongoose = require('mongoose');

async function connectToMongoDB(url) {
    return mongoose.connect(url);  // built-in Mongoose method to connect to MongoDB.
}

module.exports = {
    connectToMongoDB,
}