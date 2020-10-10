const _sodium = require('libsodium-wrappers');

module.exports = async() => {
    await _sodium.ready;
    const sodium = _sodium;

    return Object.freeze ({

        send: () => {},
        receive: () => {},
        encrypt: () => {}
    })
}