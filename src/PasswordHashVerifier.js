const _sodium = require('libsodium-wrappers');

module.exports = async() => {
    await _sodium.ready;
    const sodium = _sodium;

    return({
        verify : (hashedPw, pw) => {
            return sodium.crypto_pwhash_str_verify(hashedPw, pw);
        }
    });
}