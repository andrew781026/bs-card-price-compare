/**
 * Replacer for JSON.stringify
 * Mask fields defined in @param fields with asterisks
 *
 * @param {Array.<string>} fields - bind this function with this parameter, list of keys to be excluded
 * @param key - this is a reserved field for JSON stringify
 * @param value - this is a reserved field for JSON stringify
 * @return {Object}
 */
const maskFieldReplacer = function (fields=[], key, value) {
    return (fields.indexOf(key) > -1) ? "***": value;
};

module.exports = {
    maskFieldReplacer // 給 log4j 做使用
};