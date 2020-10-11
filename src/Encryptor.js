const _sodium = require('libsodium-wrappers');

module.exports = async(key) => {
    await _sodium.ready;
    const sodium = _sodium;

    if (!key) {
        throw 'no key';
    }

    return Object.freeze({
        encrypt: (msg) => {
            let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
            return {
                ciphertext: sodium.crypto_secretbox_easy(msg, nonce,key),
                nonce: nonce
            }
        }
    })
}