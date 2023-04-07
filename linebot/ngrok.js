// Use dotenv to read .env vars into Node
// require('dotenv').config({path: './.env'});

// if you restart ngrok , you need to change "Webhook URL" in https://developers.line.biz/console/channel/1653349620/messaging-api
const ngrok = require('ngrok');

// const authtoken = process.env.NgrokAuthToken;

ngrok.connect(5013)
    .then(url => console.log('ngrok url on : ', url))
    .catch(e => console.error('e=', e));
