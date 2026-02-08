const mongoose = require('mongoose');

/**
 * MongoDB Connection Utility
 * Yeh function database se connection establish karta hai.
 */
const connectDB = async () => {
    try {
        // process.env.MONGO_URI aapki .env file se aayega
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ Database Connection Error: ${err.message}`);
        // Agar DB connect nahi hua toh server band kar dena chahiye
        process.exit(1);
    }
};

// Yeh line sabse important hai - isse server.js ko function milta hai
module.exports = connectDB;