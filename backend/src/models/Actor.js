const mongoose = require('mongoose');
// Shared constants se roles import kar rahe hain taaki backend aur frontend sync rahein
const { ROLES } = require('../../../shared/constants'); 

const ActorSchema = new mongoose.Schema({
    // 1. Basic Identity
    name: { 
        type: String, 
        required: [true, 'Actor name is required'],
        trim: true 
    },
    
    // 2. Authentication & Communication
    phoneNumber: { 
        type: String, 
        required: [true, 'Phone number is required'], 
        unique: true,
        trim: true
    },
    
    // 3. Organization Mapping
    organization: { 
        type: String, 
        required: [true, 'Organization/Company name is required'],
        index: true // Searching fast karne ke liye
    },
    
    // 4. Role-Based Access (25+ roles handle karne ke liye flexible rakha hai)
    role: { 
        type: String, 
        required: [true, 'Role must be assigned'],
        enum: Object.values(ROLES) // Sirf constants.js wale roles hi allow honge
    },

    // 5. Zero Trust Security Layer
    // Har actor ki apni ek Public Key hogi jo unke "Digital Signature" ko verify karegi
    publicKey: { 
        type: String, 
        default: null 
    },

    // 6. Verification Status (Admin control)
    isVerified: { 
        type: Boolean, 
        default: false 
    },
    
    isActive: { 
        type: Boolean, 
        default: true 
    },

    // 7. Metadata
    aadhaarHash: { 
        type: String, // Privacy ke liye Aadhaar number store nahi karenge, sirf uska Hash
        select: false // Default queries mein ye sensitive data nahi dikhega
    },

    lastLogin: { 
        type: Date 
    }
}, { 
    timestamps: true // createdAt aur updatedAt automatically handle honge
});

module.exports = mongoose.model('Actor', ActorSchema);