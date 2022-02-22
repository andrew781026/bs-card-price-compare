// Use dotenv to read .env vars into Node
require('dotenv').config({path: '../../.env'});

const Sentry = require('@sentry/node');

const Sentry_dsn = process.env.Sentry_dsn;

export const initSentry = ({app}) => {

    // sample codes : https://getsentry.github.io/sentry-javascript/modules/minimal.html
    Sentry.init({
        debug: true,
        // dsn 從右側連結取得 : https://sentry.io/settings/ezoom/projects/bs-card-price-compare/keys/
        dsn: Sentry_dsn,
    });

    /*
        // Capture exceptions, messages or manual events
        Sentry.captureMessage('Hello, world!');
        Sentry.captureException(new Error('Good bye'));
        Sentry.captureEvent({
            message: 'Manual',
            stacktrace: [
                // ...
            ],
        });
    */

    app.get("/debug-sentry", function mainHandler(req, res) {
        throw new Error("My first Sentry error!");
    });

    // Optional fallthrough error handler
    app.use(function onError(err, req, res, next) {

        // send the error message to Sentry
        Sentry.captureException(err);

        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500;
        res.end('res.sentry=' + res.sentry + "\n");
    });
}
