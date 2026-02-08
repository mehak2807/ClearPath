const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    batchNumber: { type: String, required: true, unique: true },
    manufacturingDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    manufacturer: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor', required: true },
    
    // Dashboard Fields (Live View)
    currentLocation: { type: String, default: "Factory" },
    status: { 
        type: String, 
        enum: ['MANUFACTURED', 'IN_TRANSIT', 'DELIVERED', 'RECALLED'], 
        default: 'MANUFACTURED' 
    },

    // Security Fields
    productHash: { type: String }, // Initial fingerprint
    signature: { type: String },   // Manufacturer's seal
    
    // Tracking History (Linked to Events)
    history: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductEvent' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);