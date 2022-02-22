// フルアヘッド - 爬蟲

import axios from "axios";
import * as cheerio from "cheerio";
import * as iconv from "iconv-lite";
import * as FileReader from "filereader";

// Using async/await
export const getCardInfo = async (name) => {

    console.log('fullahead - getCardInfo')

    const response = await axios.get(`https://fullahead-tcg.com/shop/shopbrand.html?search=${name}`, {
        responseType: 'blob',
        transformResponse: [function (data) {
            let reader = new FileReader();
            reader.readAsText(data, 'EUC-JP');
            reader.onload = function (e) {
                console.log(reader.result);
            }
            return data;
        }]
    });

    const htmlStr = iconv.decode(Buffer.from(response.data), 'EUC-JP');

    console.log(htmlStr);

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

    const cardInfos = $('.indexItemBox > div').map((i, el) => {

        const $card = $(el);

        const getCardId = cardName => {

            if (!cardName) return '';
            else if (cardName.indexOf('】') < 0) return cardName.substring(0, cardName.indexOf(' '));
            else return cardName.substring(cardName.indexOf('】') + 1, cardName.indexOf(' '));
        }

        const cardName = $card.find('.itemName').text().replace(/[\n\t]/ig, '').trim();
        const cardId = getCardId(cardName);
        const cardPrice = $card.find('.itemPrice > strong').text().replace(/[\n\t]/ig, '').trim();
        const cardStock = '?';

        // .M_item-stock-smallstock
        const cardBuyLink = 'https://fullahead-tcg.com' + $card.find('> a').attr('href');

        // https://img.yuyu-tei.jp/card_image/bs/90_126/sd58/10011.jpg -> 小圖
        // https://img.yuyu-tei.jp/card_image/bs/front/sd58/10011.jpg -> 大圖

        const cardImage = $card.find('.itemImg > img').attr('src').trim();

        return {cardId, cardName, cardPrice, cardStock, cardImage, cardBuyLink};

    }).get();

    return cardInfos;
}
