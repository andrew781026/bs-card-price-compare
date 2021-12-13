// Use dotenv to read .env vars into Node
require('dotenv').config();

const line = require('@line/bot-sdk');

const channelAccessToken = process.env.LineChannelAccessToken;
const channelSecret = process.env.LineChannelSecret;

// create LINE SDK client
const client = new line.Client({channelAccessToken, channelSecret});

const {db} = require('../firebase/init')
const {getCardInfo} = require('../service/cheerio')

async function msgHandler(event) {

    const docRef = db.collection('events').doc(`${event.source.userId}-${event.timestamp}`);

    docRef.set(event)
        .then(console.log)
        .catch(console.error);

    const cardInfo = await getCardInfo('sd58');

    // flex 模擬器 : https://developers.line.biz/flex-simulator/
    const getSingleCard = card => {

        return {
            "type": "bubble",
            "size": "micro",
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": card.cardId,
                        "size": "xl"
                    },
                    {
                        "type": "text",
                        "text": card.cardName,
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": card.cardImage,
                "size": "full",
                "aspectRatio": "13:17",
                "aspectMode": "fit",
                "action": {
                    "type": "uri",
                    "uri": card.cardBuyLink
                }
            },
            "body": {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                    {
                        "type": "text",
                        "text": card.cardPrice
                    },
                    {
                        "type": "text",
                        "text": card.cardStock,
                        "align": "end"
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "style": "link",
                        "height": "sm",
                        "action": {
                            "type": "uri",
                            "label": "立即購買",
                            "uri": card.cardBuyLink
                        }
                    }
                ],
                "flex": 0
            }
        }
    }

    const getMulti = cardInfo => {

        return {
            "type": "flex",
            "altText": "查出的卡片資訊",
            "contents": {
                "type": "carousel",
                "contents": cardInfo.slice(0, 10).map(card => getSingleCard(card))
            }
        }
    }

    const message = getMulti(cardInfo);

    return client.replyMessage(event.replyToken, [
        {
            type: 'text',
            text: 'https://yuyu-tei.jp/game_bs/sell/sell_price.php?name=sd58'
        },
        {
            type: 'text',
            text: 'https://fullahead-tcg.com/shop/shopbrand.html'
        },
        message
    ]);
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
