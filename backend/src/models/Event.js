const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    productId: { type: String, required: true }, // [cite: 57]
    eventType: { type: String, required: true }, // [cite: 124] (e.g., Manufactured, Shipped)
    timestamp: { type: Date, default: Date.now }, // [cite: 125]
    location: { type: String }, // [cite: 126]
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor', required: true }, // [cite: 127]
    dataHash: { type: String, required: true }, // [cite: 60, 243] (The Fingerprint)
    signature: { type: String }, // [cite: 244] (Cryptographic Proof)
    previousHash: { type: String } // Linking to previous event for chain integrity
});

module.exports = mongoose.model('Event', EventSchema);