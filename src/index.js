const express = require("express");
const {initLineService} = require("./router/line");

// Initialize Express
const app = express();

initLineService({app})

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel , more change");
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// line-bot 的最小範例 : https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis
