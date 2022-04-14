// buyee - 爬蟲

import axios from "axios";

import {CardInfo} from "../type/cardInfo.d";
import * as cheerio from "cheerio";
import {getFirstNumber, getLimiter, getPageArr, timer} from "../utils/bottleneck";

// 每 1 秒只會有 3 個查詢
const limiter = getLimiter('buyee-axios', 333, 1);

const getLastPage = async (name: string): Promise<number> => {

    // Equivalent to `axios.get(`https://buyee.jp/item/search/yahoo/shopping/2511?query=${name}&page=${page}`)`
    const params = {query: `バトルスピリッツ+${name}`}
    const response = await limiter.schedule(() => axios.get('https://buyee.jp/item/search/yahoo/shopping', {params}));
    const htmlStr = response.data;
    // timer.log('getLastPage');
    const $ = cheerio.load(htmlStr);
    const bindStr = $('.page_navi .arrow:last-child').attr('onclick')
    const page = getFirstNumber(bindStr)

    return parseFloat(page)
}

const getCardInfosByPage = async (name: string, page: number): Promise<CardInfo[]> => {

    // Equivalent to `axios.get(`https://buyee.jp/item/search/yahoo/shopping/2511?query=${name}&page=${page}`)`
    const params = {query: `バトルスピリッツ+${name}`, page}
    const response = await limiter.schedule(() => axios.get('https://buyee.jp/item/search/yahoo/shopping', {params}));
    const pagedHtml = response.data;
    // timer.log(`第 ${page} 頁資料：`);
    const $p = cheerio.load(pagedHtml);

    return $p('ul.product_field li.product_whole').map((i, el): CardInfo => {

        const $card = $p(el);

        const card_id = 'none';
        const card_name = $card.find('p.product_title').text().replace(/[\n\t]/ig, '').trim();
        const cardPrice = $card.find('a.item_link').attr('data-price');

        const cardBuyLink = 'https://buyee.jp/' + $card.find('a.item_link').attr('href');
        const smallPic = $card.find('img.hide.product_image').attr('data-src');

        return {
            card_id,
            card_name,
            price: parseFloat(cardPrice),
            small_pic: smallPic,
            buy_link: cardBuyLink,
            currency: 'JYP'
        };

    }).get();
}

const getCardInfoBySingle = async (cardInfo: CardInfo): Promise<CardInfo> => {

    const response = await limiter.schedule(() => axios.get(cardInfo.buy_link));
    const singleHtml = response.data;
    // timer.log(`單筆資料 - ${cardInfo.card_name}：`);
    const $s = cheerio.load(singleHtml);

    // 單頁中的 - 大圖 . stock
    const bigPic = $s('.shopping_item_main_image img.hide.main_image').attr('data-src');
    const cardStock = $s('dd.shopping_quantity > span > b').text().replace(/[\n\t]/ig, '').trim();

    cardInfo.stock = cardStock ? parseFloat(cardStock) : 0;
    cardInfo.big_pic = bigPic;

    return cardInfo;
}

// Using async/await
export const getCardInfo = async (name: string): Promise<CardInfo[]> => {

    timer.start();

    const lastPage = await getLastPage(name);
    const pagedCardInfos = await Promise.all(getPageArr(lastPage).map(async page => await getCardInfosByPage(name, page)))
    const cardInfos = pagedCardInfos.reduce((pre, curr) => [...pre, ...curr])
    return await Promise.all(cardInfos.map(getCardInfoBySingle));
}

getCardInfo('sd58')
    .then(cardInfos => console.log('\n\n\n\ncardInfos=', cardInfos))
    .catch(console.error)
