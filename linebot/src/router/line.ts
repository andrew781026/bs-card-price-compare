// Use dotenv to read .env vars into Node
require('dotenv').config();

import * as line from "@line/bot-sdk";
import * as express from "express";

const lineRouter = express.Router();
import errorWrapper from "../utils/errorWrapper";
import {handleEvent} from "../service/line";

const channelAccessToken = process.env.LineChannelAccessToken;
const channelSecret = process.env.LineChannelSecret;

// get for line platform verify using
lineRouter.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`));

lineRouter.post('/', errorWrapper(async (req, res) => {

    // 參考文件 : https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects
    const events = req.body.events;

    const results = []

    for (const event of events) {

        const result = await handleEvent(event);
        results.push(result);
    }

    res.json(results)
}));

export const initLineService = ({app}) => {
    app.use(`/line/callback`, line.middleware({channelAccessToken, channelSecret}), lineRouter);
}
