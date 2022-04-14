import Bottleneck from "bottleneck";
import {performance} from "perf_hooks";

const limiters = {};

/**
 * 用於測試效能 , 利用起始 & 紀錄的時間差 , 確認效能如何 ?
 */
class Timer {

    starter;

    start() {
        this.starter = new Date();
    }

    log(name) {
        if (this.starter) console.log(`${name} , time = `, new Date().getTime() - this.starter.getTime())
        else new Error('you must call timer.start() before timer.log()')
    }

    end() {
        this.start = null;
    }
}

export const timer = new Timer();

export const getPageArr = num => new Array(num).fill('').map((_, index) => index + 1)

export const getFirstNumber = str => str.match(/\d*/g).filter(x => Boolean(x))[0]

export const wait = miliseconds => new Promise((resolve) => setTimeout(resolve, miliseconds));

export function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export const getLimiter = (name = _uuid(), minTime = 333, maxConcurrent = 1): Bottleneck => {

    if (!limiters[name]) limiters[name] = new Bottleneck({maxConcurrent, minTime});
    return limiters[name]
}
