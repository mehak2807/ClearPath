const mongoose = require('mongoose');

const productEventSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    nodeName: { type: String, required: true }, // Location/Node Name
    action: { type: String, required: true },   // e.g., "Dispatched from North Hub"
    timestamp: { type: Date, default: Date.now },
    dataHash: { type: String, required: true }  // Irreversible hash of this specific event
});

module.exports = mongoose.model('ProductEvent', productEventSchema);