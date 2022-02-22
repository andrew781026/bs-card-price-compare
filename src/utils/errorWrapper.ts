/**
 * A wrapper to catch async router function
 *
 * See:
 * https://stackoverflow.com/questions/43564222/how-to-handle-unhandled-promise-rejection-in-async-object-method-in-node-js-expr
 * http://tlrobinson.net/blog/2008/10/wrapping-javascript-callbacks/
 */

const errorWrapper = function (func) {

    return (req, res, next) => func(req, res, next).then().catch(err => next(err))
};

export default errorWrapper
