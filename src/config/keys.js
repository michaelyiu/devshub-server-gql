if (process.env.NODE_ENV === "production") {
  console.log("production env vars activated")
  module.exports = require('./keys_prod');
} else {
  console.log("development env vars activated")
  module.exports = require('./keys_dev');
}