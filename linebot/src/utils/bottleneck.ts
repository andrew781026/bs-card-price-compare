import Bottleneck from "bottleneck";
import {performance} from "perf_hooks";

const limiters = {};

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
