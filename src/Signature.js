const _sodium = require('libsodium-wrappers');

module.exports = async() => {
    await _sodium.ready;
    const sodium = _sodium;
    const key = sodium.crypto_sign_keypair();
    
    return ({
        
        verifyingKey : key.publicKey,
        sign : (msg) => {
            return sodium.crypto_sign(msg,key.privateKey);
        }
    })
    
}