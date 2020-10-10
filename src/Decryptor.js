const _sodium = require('libsodium-wrappers');

module.exports = async(key) => {
    await _sodium.ready;
    const sodium = _sodium;

    if (!key) {
        throw 'no key';
    }

    return Object.freeze({
        decrypt: (text, nonce) => {
            return sodium.crypto_secretbox_open_easy(text, nonce, key)
        }
    })
}