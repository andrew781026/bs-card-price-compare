const express = require("express");
const {initLineService} = require("./router/line");
const {initSentry} = require("./sentry/init");

const serverless = require('serverless-http');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();

initLineService({app});
initSentry({app});

// bodyParser 會影響 @line/bot-sdk 運作
app.use(bodyParser.json());

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel , more change");
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// line-bot 的最小範例 : https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis

module.exports = app;
module.exports.handler = serverless(app);
