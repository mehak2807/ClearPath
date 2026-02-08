const crypto = require('crypto');

// 1. Data ka Hash banana
const createProductHash = (data) => {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
};

// 2. Hash ko Private Key se Sign karna
const signData = (privateKey, hash) => {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(hash);
    return sign.sign(privateKey, 'hex');
};

module.exports = { createProductHash, signData };