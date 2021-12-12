// Use dotenv to read .env vars into Node
require('dotenv').config();

const line = require('@line/bot-sdk');

const channelAccessToken = process.env.LineChannelAccessToken;
const channelSecret = process.env.LineChannelSecret;

// create LINE SDK client
const client = new line.Client({channelAccessToken, channelSecret});

async function msgHandler(event) {

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '沒有收到任何資訊，請再次輸入~'
    });
}

// event handler
async function handleEvent(event) {

    console.log(`User ID: ${event.source.userId}`); // 要將 userId 所有的對話做儲存 , 才能做上下文分析
    console.log('[line-webhook-req] event=', event); // log the event msg

    if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
        return console.log('Test hook recieved: ' + JSON.stringify(event.message));
    }

    if (event.type !== 'message' || event.message.type !== 'text') return null;
    else return await msgHandler(event)

    // event.type 參考資料 : https://developers.line.biz/zh-hant/docs/messaging-api/receiving-messages/#webhook-event-types

    // 可參考的完整範例 : https://github.com/clarencetw/line-bot/blob/master/routes/line.js
}

module.exports = {handleEvent};