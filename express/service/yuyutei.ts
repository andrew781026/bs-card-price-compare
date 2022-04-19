// 遊々亭 - 爬蟲

import axios, {AxiosRequestConfig} from "axios";
import * as cheerio from "cheerio";
import * as queryString from "query-string";
import {getFirstNumber, getLimiter, getPageArr} from "../utils/bottleneck";
import {CardInfo} from "../type/cardInfo";

const getConfig = (name?): AxiosRequestConfig => {

    return {
        params: {name},
    }
}

const getCardInfos = async (name: string): Promise<CardInfo[]> => {

    const response = await axios.get(`https://yuyu-tei.jp/game_bs/sell/sell_price.php`, getConfig(name));
    const pagedHtml = response.data;
    // timer.log(`第 ${page} 頁資料：`);
    const $p = cheerio.load(pagedHtml);

    return $p('.card_list_box li.card_unit').map((i, el): CardInfo => {

        const $card = $p(el);

        const card_name = $card.find('p.name').text().replace(/[\n\t]/ig, '').trim();
        const card_id = $card.find('p.id').text().replace(/[\n\t]/ig, '').trim();
        const cardPrice = $card.find('p.price').text().replace(/[\n\t]/ig, '').trim();
        const cardStock = $card.find('p.stock').text().replace(/[\n\t]/ig, '').trim();
        const buy_link = 'https://yuyu-tei.jp' + $card.find('.image_box > a').attr('href');
        const small_pic = $card.find('.image_box p.image > img').attr('src');

        // https://img.yuyu-tei.jp/card_image/bs/90_126/sd58/10011.jpg -> 小圖
        // https://img.yuyu-tei.jp/card_image/bs/front/sd58/10011.jpg -> 大圖

        const getStock = cardStock => {

            const noStock = '×'
            const infiniteStock = '◯'

            const tempStock = cardStock.replace('残：', '');

            if (tempStock === noStock) return 0;
            else if (tempStock === infiniteStock) return 1000;
            else if (isNaN(parseInt(tempStock))) return 0;
            else return parseInt(tempStock);
        }

        const parsed = queryString.parse(buy_link.split('?')[1]);
        const big_pic = `https://img.yuyu-tei.jp/card_image/bs/front/${parsed.VER}/${parsed.CID}.jpg`;

        return {
            card_id,
            card_name,
            stock: getStock(cardStock),
            price: parseFloat(getFirstNumber(cardPrice)),
            small_pic,
            big_pic,
            buy_link,
            currency: 'JYP'
        };

    }).get();
}

// Using async/await
export const getCardInfo = async (name) => {

    // 遊々亭 沒有做分頁
    const cardInfos = await getCardInfos(name);
    return cardInfos;
};

getCardInfo('sd58')
    .then(console.log)
    .catch(console.error)
