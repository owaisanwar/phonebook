require('dotenv').config();

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.NODE_ENV === 'test'?  process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;
console.log("🚀 ~ file: config.js ~ line 5 ~ MONGODB_URI", MONGODB_URI)

module.exports = {
  MONGODB_URI,
  PORT
} 