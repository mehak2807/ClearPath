const Event = require('../models/Event');
const { generateHash } = require('../utils/hasher');

exports.logEvent = async (req, res) => {
    try {
        const { productId, eventType, actorId, location, data } = req.body;

        // Step 6: Irreversible Hashing [cite: 242]
        // Event data ka SHA-256 hash generate karna [cite: 243]
        const dataHash = generateHash({ productId, eventType, data });

        const newEvent = new Event({
            productId,
            eventType,
            actorId,
            location,
            dataHash, // Sealed fingerprint [cite: 135, 141]
        });

        await newEvent.save();
        res.status(201).json({ 
            message: "Event verified and locked in Digital Product Passport", 
            hash: dataHash 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};