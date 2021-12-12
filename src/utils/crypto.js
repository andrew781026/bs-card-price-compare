"use strict";

const crypto = require('crypto');
const SaltLength = 20;

class CryptoUtil {

    createHash(password) {
        if (!password) return null;
        const salt = this._generateSalt(SaltLength);
        const hash = this._sha2(password + salt);
        return salt + hash;
    }

    validateHash(hash, password) {
        const salt = hash.substr(0, SaltLength);
        const validHash = salt + this._sha2(password + salt);
        return hash === validHash;
    }

    encrypt(text, secret) {
        const cipher = crypto.createCipher('aes-256-cbc', secret);
        let crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(text, secret) {
        const decipher = crypto.createDecipher('aes-256-cbc', secret);
        let dec = decipher.update(text, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    }

    _generateSalt(len) {
        let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
            setLen = set.length,
            salt = '';
        for (let i = 0; i < len; i++) {
            let p = Math.floor(Math.random() * setLen);
            salt += set[p];
        }
        return salt;
    }

    _sha2(string) {
        return crypto.createHash('sha512').update(string).digest('hex');
    }

}

module.exports = CryptoUtil;
