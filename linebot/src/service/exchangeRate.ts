// 台新銀行匯率 - 爬蟲

import axios from "axios";
import * as cheerio from "cheerio";
import * as queryString from "query-string";

// Using async/await - 匯率
export const getCardInfo = async () => {

    const response = await axios.get(`https://rate.bot.com.tw/xrt?Lang=zh-TW`);

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

    const cardInfos = $('table.table tbody td:first-of-type').map((i, el) => {

        const $rateInfo = $(el);

        const currency = $rateInfo.find('.hidden-phone.print_show').text().replace(/[\n\t]/ig, '').trim();
        const rate = $rateInfo.next('td').text().replace(/[\n\t]/ig, '').trim();

        return {currency, rate};

    }).get();

    return cardInfos;
}

getCardInfo().then(console.log).catch(console.error)
