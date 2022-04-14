// 台新銀行匯率 - 爬蟲

import {Exchange} from "../type/cardInfo.d";
import axios from "axios";
import * as cheerio from "cheerio";
import {getLimiter} from "../utils/bottleneck";

// 每 1 秒只會有 3 個查詢
const limiter = getLimiter('exchange-axios', 333, 1);

// Using async/await - 匯率
export const getExchanges = async (): Promise<Exchange[]> => {

    const response = await limiter.schedule(() => axios.get(`https://rate.bot.com.tw/xrt?Lang=zh-TW`));
    const htmlStr = response.data;
    const $ = cheerio.load(htmlStr);

    const exchanges = $('table.table tbody td:first-of-type').map((i, el): Exchange => {

        const $rateInfo = $(el);

        const currency = $rateInfo.find('.hidden-phone.print_show').text().replace(/[\n\t]/ig, '').trim();
        const rateStr = $rateInfo.next('td').text().replace(/[\n\t]/ig, '').trim();

        return {
            currency,
            rate: (isNaN(parseFloat(rateStr))) ? '-' : parseFloat(rateStr),
        };

    }).get();

    return exchanges;
}

getExchanges().then(console.log).catch(console.error)
