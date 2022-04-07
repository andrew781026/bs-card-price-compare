const axios = require('axios');
const iconv = require('iconv-lite');

// 姓名產生器
const generatorUrl = 'http://www.richyli.com/name/index.asp';   // 需要使用 big5 encoding
const searchUrl = 'https://fullahead-tcg.com/shop/shopbrand.html?search=SD58'; // 需要使用 EUC-JP encoding

axios.get(searchUrl, {
    responseType: 'arraybuffer',
    transformResponse: [function (data) {
        return iconv.decode(Buffer.from(data), 'EUC-JP')
    }],
})
    .then(response => {

        console.log(response.data);
    })
    .catch(console.error);
