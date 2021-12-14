// Use dotenv to read .env vars into Node
require('dotenv').config({path: '../../.env'});

const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");

const Sentry_dsn = process.env.Sentry_dsn;

const initSentry = ({app}) => {

    Sentry.init({
        debug: true,
        // dsn 從右側連結取得 : https://sentry.io/settings/ezoom/projects/bs-card-price-compare/keys/
        dsn: Sentry_dsn,
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({tracing: true}),
            // enable Express.js middleware tracing
            new Tracing.Integrations.Express({app}),
        ],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    // Sentry.captureException(new Error('test exception'));

    // RequestHandler creates a separate execution context using domains, so that every
    // transaction/span/breadcrumb is attached to its own Hub instance
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());

    app.get("/debug-sentry", function mainHandler(req, res) {
        throw new Error("My first Sentry error!");
    });

    // Optional fallthrough error handler
    app.use(function onError(err, req, res, next) {
        // The error id is attached to `res.sentry` to be returned
        // and optionally displayed to the user for support.
        res.statusCode = 500;
        res.end('res.sentry=' + res.sentry + "\n");
    });
}

module.exports = {initSentry};
