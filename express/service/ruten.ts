// 露天 - 爬蟲

import axios, {AxiosRequestConfig} from "axios";
import * as cheerio from "cheerio";
import {_uuid, getFirstNumber, getLimiter, getPageArr, timer} from "../utils/bottleneck";
import {CardInfo} from "../type/cardInfo";

// 每 1 秒只會有 3 個查詢
const limiter = getLimiter('buyee-axios', 333, 1);

const getConfig = (search?, page?, gno?): AxiosRequestConfig => {

    if (gno)
        return {
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36'},
            params: {gno, level: 'simple'}
        }
    else
        return {
            headers: {'User-Agent': 'GoogleBot'},
            params: {q: `BS+${search}`, p: page},
        }
}

const getLastPage = async (name: string): Promise<number> => {

    const response = await limiter.schedule(() => axios.get(`https://www.ruten.com.tw/find/`, getConfig(name)));
    const htmlStr = response.data;

    const $ = cheerio.load(htmlStr);
    const lastPage = $('ul.rt-pager li:last-of-type').text()

    return parseInt(lastPage)
}

const getCardInfosByPage = async (name: string, page: number): Promise<CardInfo[]> => {

    // https://www.ruten.com.tw/find/?q=BS+bsc32&p=3
    const response = await limiter.schedule(() => axios.get(`https://www.ruten.com.tw/find/`, getConfig(name, page)));
    const pagedHtml = response.data;
    // timer.log(`第 ${page} 頁資料：`);
    const $p = cheerio.load(pagedHtml);

    return $p('.search-result-container .product-item').map((i, el) => {

        const $card = $p(el);

        const card_id = $card.find('.rt-goods-list-item').attr('requestid')?.trim() || _uuid();
        const card_name = $card.find('.rt-goods-list-item-name span.product-card-name-text').text()?.replace(/[\n\t]/ig, '').trim();
        const cardPrice = $card.find('.rt-goods-list-item-price span.rt-text-price').text()?.replace(/[\n\t]/ig, '').trim();

        const buy_link = $card.find('.rt-goods-list-item-image-wrap a.rt-goods-list-item-image-link').attr('href');
        const small_pic = $card.find('.rt-goods-list-item-image-wrap img.rt-goods-list-item-image').attr('src');

        return {
            card_id,
            card_name,
            price: cardPrice ? parseInt(cardPrice) : 0,
            small_pic,
            buy_link,
            currency: 'TWD'
        };

    }).get();
}

const getCardInfoBySingle = async (cardInfo: CardInfo): Promise<CardInfo> => {


    const goodsId = cardInfo.buy_link.match(/(https:\/\/)(.*\?)(\d*)/)[3]
    const config = getConfig(null, null, goodsId)

    // API 取資料範例 : https://rapi.ruten.com.tw/api/items/v2/list?gno=22141517817245&level=simple [ gno = 商品編號 ]
    const res = await limiter.schedule(() => axios.get('https://rapi.ruten.com.tw/api/items/v2/list', config))
    const {num, images} = res.data.data[0];

    cardInfo.stock = num;
    cardInfo.big_pic = images.url[0];

    timer.log(`單筆資料 - ${cardInfo.card_name}：`);
    console.log(`API 的 (cardStock , bigPic) = (${cardInfo.stock},${cardInfo.big_pic})`)

    return cardInfo;
}

// Using async/await
export const getCardInfo = async (name: string): Promise<CardInfo[]> => {

    timer.start();

    const lastPage = await getLastPage(name);
    const pagedCardInfos = await Promise.all(getPageArr(lastPage).map(async page => await getCardInfosByPage(name, page)));
    const cardInfos = pagedCardInfos.reduce((pre, curr) => [...pre, ...curr])
    return await Promise.all(cardInfos.map(getCardInfoBySingle));
}

getCardInfo('sd58').then(console.log).catch(console.error)
