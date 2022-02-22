// Use dotenv to read .env vars into Node
require('dotenv').config();

const line = require('@line/bot-sdk');
const express = require('express');
const lineRouter = express.Router();
const errorWrapper = require('../utils/errorWrapper');
const {handleEvent} = require('../service/line');

const channelAccessToken = process.env.LineChannelAccessToken;
const channelSecret = process.env.LineChannelSecret;

// get for line platform verify using
lineRouter.get('/', (req, res) => res.end(`I'm listening. Please access with POST.`));

lineRouter.post('/', errorWrapper(async (req, res) => {

    // line webhook 的 req.body 為下述結構
    const bodyTemplate = {
        "destination": "xxxxxxxxxx",
        "events": [
            {
                "type": "message",
                "message": {
                    "type": "text",
                    "id": "14353798921116",
                    "text": "Hello, world"
                },
                "timestamp": 1625665242211,
                "source": {
                    "type": "user",
                    "userId": "U80696558e1aa831..."
                },
                "replyToken": "757913772c4646b784d4b7ce46d12671",
                "mode": "active"
            },
            {
                "type": "follow",
                "timestamp": 1625665242214,
                "source": {
                    "type": "user",
                    "userId": "Ufc729a925b3abef..."
                },
                "replyToken": "bb173f4d9cf64aed9d408ab4e36339ad",
                "mode": "active"
            },
            {
                "type": "unfollow",
                "timestamp": 1625665242215,
                "source": {
                    "type": "user",
                    "userId": "Ubbd4f124aee5113..."
                },
                "mode": "active"
            }
        ]
    }

    // Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result));

    // 參考文件 : https://developers.line.biz/en/reference/messaging-api/#webhook-event-objects
    const events = req.body.events;

    const results = []

    for (const event of events) {

        const result = await handleEvent(event)
        results.push(result)
    }

    res.json(results)
}));

export const initLineService = ({app}) => {
    app.use(`/line/callback`, line.middleware({channelAccessToken, channelSecret}), lineRouter);
}
