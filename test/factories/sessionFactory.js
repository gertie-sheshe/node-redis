const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (id) => {   
    const sessionObject = {
        passport: {
            user: id
        }
    };

    // Convert id to base64 session string, that can
    // be decoded by passport back into the sessionObject
    const session = Buffer
        .from(JSON.stringify(sessionObject))
        .toString('base64');

    // Sign the session
    const sig = keygrip.sign('session=' + session);

    return {session, sig}
}