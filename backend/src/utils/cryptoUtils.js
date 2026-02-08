const crypto = require('crypto');

// RSA Key Pair generate karne ka function
const generateKeyPair = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
};

// Aadhaar ko Hash karne ka function (Privacy ke liye)
const hashAadhaar = (aadhaar) => {
    return crypto.createHash('sha256').update(aadhaar).digest('hex');
};

module.exports = { generateKeyPair, hashAadhaar };