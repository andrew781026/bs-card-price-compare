// 露天 - 爬蟲

import axios from "axios";
import * as cheerio from "cheerio";
import * as queryString from "query-string";
import { _uuid } from "../utils/bottleneck";

// Using async/await
export const getCardInfo = async (name) => {

    const response = await axios.get(`https://www.ruten.com.tw/find/?q=${name}`,
        {
            headers: {
                'User-Agent': 'GoogleBot'
            }
        });

    const htmlStr = response.data;

    // console.log(htmlStr)

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

    const cardInfos = $('.search-result-container .product-item').map((i, el) => {

        const $card = $(el);

        const cardId = $card.find('.rt-goods-list-item').attr('requestid')?.trim() ||  _uuid();
        const cardName = $card.find('.rt-goods-list-item-name span.product-card-name-text').text()?.replace(/[\n\t]/ig, '').trim();
        const cardPrice = $card.find('.rt-goods-list-item-price span.rt-text-price').text()?.replace(/[\n\t]/ig, '').trim();

        // - 已銷售數量
        const cardStock = $card.find('.rt-goods-list-item-sell-info a.rt-goods-list-item-sell-link').text()?.replace(/[\n\t]/ig, '').trim();

        const cardBuyLink =  $card.find('.rt-goods-list-item-image-wrap a.rt-goods-list-item-image-link').attr('href');
        const cardImage =  $card.find('.rt-goods-list-item-image-wrap img.rt-goods-list-item-image').attr('src');

        const parsed = queryString.parse(cardBuyLink.split('?')[1]);

        return {cardId, cardName, cardPrice, cardStock, cardImage, cardBuyLink};

    }).get();

    return cardInfos;
}

getCardInfo('sd58').then(console.log).catch(console.error)
