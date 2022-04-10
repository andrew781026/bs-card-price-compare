import * as express from "express";
import * as bodyParser from "body-parser";

require('./knex/init');

// Initialize Express
const app: express.Application = express();

// bodyParser 會影響 @line/bot-sdk 運作
app.use(bodyParser.json());

// Create GET request
app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Express on Vercel , more change");
});

// Initialize server
app.listen(5003, () => {
    console.log("Running on port 5003.");
});

class HttpException extends Error {
    status?: number;
    message: string;
    title: string;
    logLevel?: string;
    logMessage?: string;
    data?: string;
    stack?: string;

    constructor(status: number, message: string, data: string, logLevel: string, logMessage: string, stack: string) {
        super(message);
        this.status = status;
        this.message = message;
        this.logMessage = logMessage;
        this.logLevel = logLevel;
        this.data = data;
        this.stack = stack;
    }
}

// error handler middleware
app.use(function (err: HttpException, req: (express.Request & { id: string }), res: express.Response, next: express.NextFunction) {  // do not remove next as the method signature matters...
    let status;
    let error = {
        title: '',
        logMessage: '',
        stack: '',
        data: '',
        message: ''
    };

    console.error(err);

    if (!err.status) {
        status = 500;
        error = {
            title: err.title,
            message: err.message,
            stack: err.stack,
            data: '',
            logMessage: '',
        }
    } else {
        status = err.status;
        error = {
            title: err.title,
            logMessage: err.logMessage,
            message: err.message,
            stack: err.stack,
            data: err.data
        }
    }

    const logMessage = `[*${req.id}*][*${req.ip}*]\n*${req.method}* ' ${req.url} ' ${status} \n*${error.title}* - ${error.logMessage}\n*STACK* ${error.stack}\n`;

    if (err.logLevel === 'WARN') {
        console.warn(logMessage);
    } else {
        // SentryUtil.captureException(err);
        console.error(logMessage);
    }
    res.status(status).json(error);
});

module.exports = app;
