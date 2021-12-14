// Use dotenv to read .env vars into Node
require('dotenv').config({path: '../../.env'});

const Sentry = require('@sentry/node');

const Sentry_dsn = process.env.Sentry_dsn;

const initSentry = ({app}) => {

    Sentry.init({
        // dsn 從右側連結取得 : https://sentry.io/settings/ezoom/projects/bs-card-price-compare/keys/
        dsn: Sentry_dsn,
    });

    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());

    app.get("/debug-sentry", function mainHandler(req, res) {
        throw new Error("My first Sentry error!");
    });

    // Optional fallthrough error handler
    app.use(function onError(err, req, res, next) {

        // send the error message to Sentry
        // Sentry.captureException(err);

        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500;
        res.end('res.sentry=' + res.sentry + "\n");
    });
}

module.exports = {initSentry};
