import * as express from "express";
import * as bodyParser from "body-parser";
import * as serverless from "serverless-http";
import {initLineService} from "./router/line";
import {initSentry} from "./sentry/init";

// Initialize Express
const app: express.Application = express();

initLineService({app});
initSentry({app});

// bodyParser 會影響 @line/bot-sdk 運作
app.use(bodyParser.json());

// Create GET request
app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Express on Vercel , more change");
});

// Initialize server
app.listen(5000, () => {
    console.log("Running on port 5000.");
});

// line-bot 的最小範例 : https://line.github.io/line-bot-sdk-nodejs/getting-started/basic-usage.html#synopsis

module.exports = app;
module.exports.handler = serverless(app);
