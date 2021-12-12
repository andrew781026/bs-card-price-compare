const express = require("express");
const {initLineService} = require("./router/line");

const path = require('path');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();


initLineService({app})

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

/*
const router = express.Router();
router.get('/', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.write('<h1>Hello from Express.js!</h1>');
  res.end();
});
router.get('/another', (req, res) => res.json({ route: req.originalUrl }));
router.post('/', (req, res) => res.json({ postBody: req.body }));
 */

// app.use('/.netlify/functions/server', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);