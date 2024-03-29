// 遊々亭 - 爬蟲

import axios from "axios";
import * as cheerio from "cheerio";
import * as queryString from "query-string";
import {getLimiter} from "../utils/bottleneck";
import {CardInfo} from "../types/caraInfo";

// Using async/await
export const getBsCardInfo = getLimiter('yuyutei').wrap(async (name): Promise<CardInfo[]> => {

    const response = await axios.get(`https://yuyu-tei.jp/game_bs/sell/sell_price.php?name=${name}`);

    const htmlStr = response.data;

    /*
       $('.card_list_box li.card_unit') -> 卡片資訊
       in li.card_unit :
           p.id - 卡號
           p.name - 卡名
           .image_box > a - 購買連結  /game_bs/carddetail/cardpreview.php?VER=sd58&CID=10017&MODE=sell ( 要加 https://yuyu-tei.jp 當開頭 )
           p.image img[src] - 圖片
           p.price - 價格 (日幣)
           p.stock - 剩餘數量

    */

    const $ = cheerio.load(htmlStr);

    const cardInfos = $('.card_list_box li.card_unit').map((i, el) => {

        const $card = $(el);

        const cardId = $card.find('p.id').text().replace(/[\n\t]/ig, '').trim();
        const cardName = $card.find('p.name').text().replace(/[\n\t]/ig, '').trim();
        const cardPrice = $card.find('p.price').text().replace(/[\n\t]/ig, '').trim();
        const cardStock = $card.find('p.stock').text().replace(/[\n\t]/ig, '').trim();

        const cardBuyLink = 'https://yuyu-tei.jp' + $card.find('.image_box > a').attr('href');

        // https://img.yuyu-tei.jp/card_image/bs/90_126/sd58/10011.jpg -> 小圖
        // https://img.yuyu-tei.jp/card_image/bs/front/sd58/10011.jpg -> 大圖

        const parsed = queryString.parse(cardBuyLink.split('?')[1]);
        const cardImage = `https://img.yuyu-tei.jp/card_image/bs/front/${parsed.VER}/${parsed.CID}.jpg`;

        return {cardId, cardName, cardPrice, cardStock, cardImage, cardBuyLink};

    }).get();

    return cardInfos;
});

/**
 * 遊々亭 - 爬蟲 as SVE
 * @param name 卡片名稱(防御型ゴーレム) or 卡片編號(BP02-T14) or 彈數編號(BP01)
 * @returns {Promise<CardInfo[]>}
 */
export const getSveCardInfo = getLimiter('yuyutei').wrap(async (name): Promise<CardInfo[]> => {

    const response = await axios.get(`https://yuyu-tei.jp/game_sev/sell/sell_price.php?name=${name}`);

    const htmlStr = response.data;

    /*
       $('.card_list_box li.card_unit') -> 卡片資訊
       in li.card_unit :
           p.id - 卡號
           p.name - 卡名
           .image_box > a - 購買連結  /game_bs/carddetail/cardpreview.php?VER=sd58&CID=10017&MODE=sell ( 要加 https://yuyu-tei.jp 當開頭 )
           p.image img[src] - 圖片
           p.price - 價格 (日幣)
           p.stock - 剩餘數量

    */

    const $ = cheerio.load(htmlStr);

    const cardInfos = $('.card_list_box li.card_unit').map((i, el) => {

        const $card = $(el);

        const cardId = $card.find('p.id').text().replace(/[\n\t]/ig, '').trim();
        const cardName = $card.find('p.name').text().replace(/[\n\t]/ig, '').trim();
        const cardPrice = $card.find('p.price').text().replace(/[\n\t]/ig, '').trim();
        const cardStock = $card.find('p.stock').text().replace(/[\n\t]/ig, '').trim();

        const cardBuyLink = 'https://yuyu-tei.jp' + $card.find('.image_box > a').attr('href');

        // https://img.yuyu-tei.jp/card_image/bs/90_126/sd58/10011.jpg -> 小圖
        // https://img.yuyu-tei.jp/card_image/bs/front/sd58/10011.jpg -> 大圖

        const parsed = queryString.parse(cardBuyLink.split('?')[1]);
        const cardImage = `https://img.yuyu-tei.jp/card_image/bs/front/${parsed.VER}/${parsed.CID}.jpg`;

        return {cardId, cardName, cardPrice, cardStock, cardImage, cardBuyLink};

    }).get();

    return cardInfos;
});

// getSveCardInfo('bp04').then(console.log).catch(console.error)
