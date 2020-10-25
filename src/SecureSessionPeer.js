const sodium = require('libsodium-wrappers');

const Decryptor = require('../src/Decryptor');
const Encryptor = require('../src/Encryptor');

client = null;
server = null;

module.exports = async () => {
    await sodium.ready;
    var hasPeers = null;

    if (server == null) {
        hasPeers = false;
        var keys = sodium.crypto_kx_keypair();
        server = {privateKey: keys.privateKey, publicKey: keys.publicKey}

    } else {
        hasPeers = true;
        var keys = sodium.crypto_kx_keypair();
        const keysForClient = sodium.crypto_kx_client_session_keys(keys.publicKey, keys.privateKey, server.publicKey);
        const keysForServer = sodium.crypto_kx_server_session_keys(server.publicKey, server.privateKey, keys.publicKey);

        client = {privateKey: keys.privateKey, publicKey: keys.publicKey,decryptor: await Decryptor(keysForClient.sharedRx),
            encryptor: await Encryptor(keysForClient.sharedTx)};

        server.decryptor = await Decryptor(keysForServer.sharedRx);
        server.encryptor = await Encryptor(keysForServer.sharedTx);
    } 

    return Object.freeze({
        publicKey: hasPeers ? client.publicKey : server.publicKey,
        send: (msg) => {hasPeers ? server.message = client.encryptor.encrypt(msg) : client.message = server.encryptor.encrypt(msg);},
        receive: () => {
            if (hasPeers) {
                msg = client.message;
                return client.decryptor.decrypt(msg.ciphertext, msg.nonce);
            } else {
                msg = server.message;
                return server.decryptor.decrypt(msg.ciphertext, msg.nonce);
            }
        },
        encrypt: (msg) => {
            var answer = null
            hasPeers ? answer = client.encryptor.encrypt(msg) : answer = server.encryptor.encrypt(msg);
            return answer;
        },
        decrypt: (ciphertext, nonce) => {return client.decryptor.decrypt(ciphertext, nonce)}
    });
};