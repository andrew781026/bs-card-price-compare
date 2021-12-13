// 在此作爬蟲的事情

const axios = require('axios');
const cheerio = require('cheerio');
const queryString = require('query-string');

// Using async/await
async function getCardInfo(name) {
    try {
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

            const parsed = queryString.parse(cardBuyLink);
            const cardImage = `https://img.yuyu-tei.jp/card_image/bs/front/${parsed.VER}/${parsed.CID}.jpg`;

            return {cardId, cardName, cardPrice, cardStock, cardImage, cardBuyLink};

        }).get();

        return cardInfos;

    } catch (error) {
        console.error(error);
    }
}

module.exports = {getCardInfo}
