// Use dotenv to read .env vars into Node
require('dotenv').config();

import {FlexMessage, QuickReplyItem} from "@line/bot-sdk";
import * as line from "@line/bot-sdk";
import {FlexBubble, MessageAction} from "@line/bot-sdk/lib/types";
import {CardInfo} from "../types/caraInfo";

import {db} from "../firebase/init";
import {getCardInfo} from "./yuyutei";

const channelAccessToken = process.env.LineChannelAccessToken;
const channelSecret = process.env.LineChannelSecret;

// create LINE SDK client
const client = new line.Client({channelAccessToken, channelSecret});

export const msgHandler = async event => {

    // firesql - https://firebaseopensource.com/projects/jsayol/firesql/ 也許不錯使用
    const userId = event.source.userId;
    const docRef = db.collection('events').doc(`${userId}-${event.timestamp}`);

    docRef.set(event).then(console.log).catch(console.error);

    // event.source.userId - 建立同一個人 , 以前查過的一些列表 => 用 "歷史" 來叫出來
    if (event.message.text === '歷史') {

        const getLast10Search = async ({userId}) => {

            const historyRef = db.collection('search').doc(userId).collection('text');
            const snapshot = await historyRef.orderBy('createAt', 'desc').limit(10).get();

            if (snapshot.empty) return []

            // 參考資料 : https://firebase.google.com/docs/firestore/query-data/get-data
            else {

                const arr = snapshot.docs.map(doc => doc.data());
                const trimArr = arr.map(({searchText}) => searchText && searchText.trim());

                // distinct text
                return [...new Set(trimArr)];
            }
        }

        const searchTexts = await getLast10Search({userId});

        const items: QuickReplyItem[] = searchTexts.map(text => {

            // 強制轉型 to Action
            const action = {type: 'message', label: text, text} as (MessageAction & { label: string });

            return ({
                type: "action",
                action
            })
        })

        return client.replyMessage(event.replyToken,
            {
                type: 'text',
                text: '歷史查詢',
                quickReply: {
                    items
                },
            }
        );
    }

    // 紀錄查詢過的文字
    const saveSearchText = ({userId, searchText}) => {

        const searchRef = db.collection('search');

        searchRef
            .doc(userId).collection('text')
            .add({userId, searchText, createAt: new Date()})
            .then(console.log)
            .catch(console.error);
    }

    const searchText = event.message.text;
    const cardInfo = await getCardInfo(searchText);
    if (cardInfo && cardInfo.length > 0) saveSearchText({userId, searchText});

    // flex 模擬器 : https://developers.line.biz/flex-simulator/
    const getSingleCard = (card: CardInfo): FlexBubble => {

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
                // @ts-ignore
                "aspectRatio": "13:17", // 13:17
                "aspectMode": "fit",
                "action": {
                    "type": "uri",
                    "label": '連結',
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

    const getMulti = (cardInfo): FlexMessage => {

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

    console.log('message', message);

    // @ts-ignore
    return client.replyMessage(event.replyToken, [message, {type: 'text', text: 'HAHA'}]);
}

// event handler
export const handleEvent = async event => {

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
