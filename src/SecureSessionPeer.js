const _sodium = require('libsodium-wrappers');

const Decryptor = require('../src/Decryptor');
const Encryptor = require('../src/Encryptor');

module.exports = async() => {
    await _sodium.ready;
    const sodium = _sodium;
    

    const key = sodium.crypto_kx_keypair();

    const encryptor = await Encryptor(key.privateKey);
    const decryptor = await Decryptor(key.privateKey);


    return Object.freeze ({
        publicKey: key.publicKey,
        send: () => {},
        receive: () => {},
        encrypt: (msg) => {
            return encryptor.encrypt(msg)
        },
        decrypt: (text, nonce) => {
            return decryptor.decrypt(text, nonce);
        }
    })
}