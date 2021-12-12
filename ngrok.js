// if you restart ngrok , you need to change "Webhook URL" in https://developers.line.biz/console/channel/1653349620/messaging-api
const ngrok = require('ngrok');
const port = require('./config').port || 3003;

ngrok.connect(port)
    .then(url => console.log('ngrok url on : ', url))
    .catch(e => console.error('e=', e));
