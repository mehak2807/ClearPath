const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const actorRoutes = require('./src/routes/actorRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const productRoutes = require('./src/routes/productRoutes');

// Environment Variables Load karein
dotenv.config();

// Database Connect karein
connectDB();

const app = express();

// Middleware Setup
app.use(cors()); // Frontend ko allow karne ke liye
app.use(express.json()); // JSON data read karne ke liye
app.use('/api/actors', actorRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/products', productRoutes)



// Test Route
app.get('/', (req, res) => {
    res.send('🚀 ClearPath Backend is Running and Secure!');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
});