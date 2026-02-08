const crypto = require('crypto');

/**
 * Generates a SHA-256 hash for the given data.
 * @param {Object} data - The event data to hash.
 * @returns {string} - The hex-encoded hash.
 */
const generateHash = (data) => {
    // Data ko stringify karke uska SHA-256 hash banate hain
    const dataString = JSON.stringify(data);
    return crypto.createHash('sha256').update(dataString).digest('hex');
};

module.exports = { generateHash };