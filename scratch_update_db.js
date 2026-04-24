const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');
require('dotenv').config();

async function run() {
  await connectToMongoDB(process.env.MONGO_URI);
  const result = await URL.updateMany({ entryType: { $exists: false } }, { $set: { entryType: 'url' } });
  console.log('Updated:', result.modifiedCount);
  process.exit(0);
}

run().catch(console.error);
