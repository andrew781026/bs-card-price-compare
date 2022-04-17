// フルアヘッド - 爬蟲

import axios, {AxiosRequestConfig} from "axios";
import * as cheerio from "cheerio";
import * as iconv from "iconv-lite";
import {getFirstNumber, getLimiter, getPageArr, timer} from "../utils/bottleneck";
import {CardInfo} from "../type/cardInfo";

// 每 1 秒只會有 3 個查詢
const limiter = getLimiter('fullahead-axios', 333, 1);

const getConfig = (search?, page?): AxiosRequestConfig => {

    return {
        params: {search, page},
        responseType: 'arraybuffer',
        transformResponse: [function (data) {
            return iconv.decode(Buffer.from(data), 'EUC-JP')
        }],
    }
}

// 全 [161] 商品 -> 每頁顯示 50 筆
const getLastPage = async (name: string): Promise<number> => {

    const response = await limiter.schedule(() => axios.get(`https://fullahead-tcg.com/shop/shopbrand.html`, getConfig(name)));
    const htmlStr = response.data;

    // console.log('htmlStr->', htmlStr);
    const $ = cheerio.load(htmlStr);
    const regex = /\d*/g // g = 全部 ( 因此會將所有符合的抓出來 )
    const bindStr = $('.pagerTxt').text()
    const totalNumber = bindStr.match(regex).filter(x => Boolean(x))[0]

    return Math.ceil(parseFloat(totalNumber) / 50)
}

const getCardInfosByPage = async (name: string, page: number): Promise<CardInfo[]> => {

    const response = await axios.get(`https://fullahead-tcg.com/shop/shopbrand.html`, getConfig(name, page));
    const pagedHtml = response.data;
    // timer.log(`第 ${page} 頁資料：`);
    const $p = cheerio.load(pagedHtml);

    return $p('.indexItemBox > div').map((i, el): CardInfo => {

        const $card = $p(el);

        const getCardId = cardName => {

            if (!cardName) return '';
            else if (cardName.indexOf('】') < 0) return cardName.substring(0, cardName.indexOf(' '));
            else return cardName.substring(cardName.indexOf('】') + 1, cardName.indexOf(' '));
        }

        const card_name = $card.find('.itemName').text().replace(/[\n\t]/ig, '').trim();
        const card_id = getCardId(card_name);
        const cardPrice = $card.find('.itemPrice > strong').text();
        const buy_link = 'https://fullahead-tcg.com' + $card.find('> a').attr('href');

        const small_pic = $card.find('span.itemImg > img').attr('src');

        return {
            card_id,
            card_name,
            price: parseFloat(getFirstNumber(cardPrice)),
            small_pic,
            buy_link,
            currency: 'JYP'
        };

    }).get();
}

const getCardInfoBySingle = async (cardInfo: CardInfo): Promise<CardInfo> => {

    const response = await limiter.schedule(() => axios.get(cardInfo.buy_link, getConfig()));
    const singleHtml = response.data;
    // timer.log(`單筆資料 - ${cardInfo.card_name}：`);
    const $s = cheerio.load(singleHtml);

    // 單頁中的 - 大圖 . stock
    const bigPic = $s('.product_images #image_main img').attr('src');
    const cardStock = $s('table#detailTbl span.M_item-stock-smallstock').text();

    cardInfo.stock = cardStock ? parseInt(getFirstNumber(cardStock)) : 0;
    cardInfo.big_pic = bigPic;

    return cardInfo;
}

// Using async/await
export const getCardInfo = async (name: string) => {

    // timer.start()

    const lastPage = await getLastPage(name);
    const pagedCardInfos = await Promise.all(getPageArr(lastPage).map(async page => await getCardInfosByPage(name, page)));
    const cardInfos = pagedCardInfos.reduce((pre, curr) => [...pre, ...curr])
    return await Promise.all(cardInfos.map(getCardInfoBySingle));
}

getCardInfo('bs58').then(console.log).catch(console.error)
