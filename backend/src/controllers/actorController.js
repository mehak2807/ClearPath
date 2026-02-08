const Actor = require('../models/Actor');
const { generateKeyPair, hashAadhaar } = require('../utils/cryptoUtils');

/**
 * 1. Register Actor (Initial Onboarding)
 * Sirf basic details save karta hai. publicKey aur isVerified default rahenge.
 */
exports.registerActor = async (req, res) => {
    try {
        const { name, phoneNumber, organization, role } = req.body;

        // Check if actor already exists
        const existingActor = await Actor.findOne({ phoneNumber });
        if (existingActor) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        const newActor = new Actor({
            name,
            phoneNumber,
            organization,
            role
        });

        await newActor.save();
        res.status(201).json({ 
            message: "Actor Registered Successfully. Please proceed to KYC.", 
            actor: newActor 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 2. Request OTP (Simulation)
 * KYC shuru karne se pehle phone verify karne ke liye.
 */
exports.requestOTP = async (req, res) => {
    try {
        const { actorId } = req.body;
        const actor = await Actor.findById(actorId);
        
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        // Simulation: Real system mein SMS API yahan call hogi
        const mockOTP = "123456";
        console.log(`[SMS Simulation] OTP for ${actor.phoneNumber}: ${mockOTP}`);
        
        res.status(200).json({ 
            message: "OTP sent successfully to your registered mobile number." 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 3. Verify KYC & Generate Keys
 * OTP aur Aadhaar verify hone ke baad hi Cryptographic Keys banengi.
 */
exports.verifyKYC = async (req, res) => {
    try {
        const { actorId, aadhaarNumber, otp } = req.body;

        // Validation: OTP Check (Mock)
        if (otp !== "123456") {
            return res.status(401).json({ message: "Invalid OTP. KYC failed." });
        }

        // Validation: Aadhaar format check
        if (!aadhaarNumber || aadhaarNumber.length !== 12) {
            return res.status(400).json({ message: "Invalid Aadhaar Number. Must be 12 digits." });
        }

        const actor = await Actor.findById(actorId);
        if (!actor) return res.status(404).json({ message: "Actor not found" });

        // Security Check: Agar pehle se verified hai toh dobara nahi karenge
        if (actor.isVerified) {
            return res.status(400).json({ message: "Actor is already KYC verified." });
        }

        // --- STEP: CRYPTOGRAPHY ---
        // Aadhaar ka hash banayein (Privacy)
        const aadhHash = hashAadhaar(aadhaarNumber);

        // RSA Key Pair generate karein
        const { publicKey, privateKey } = generateKeyPair();

        // Database Update
        actor.aadhaarHash = aadhHash;
        actor.publicKey = publicKey;
        actor.isVerified = true;
        await actor.save();

        // Response: Private Key sirf yahi ek baar dikhayi degi!
        res.status(200).json({
            message: "KYC Verified & Identity Keys Generated!",
            data: {
                actorName: actor.name,
                publicKey: publicKey,
                privateKey: privateKey, // Frontend user ko download karwayega
                note: "WARNING: Save your private key. We do not store it and cannot recover it!"
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 4. Get All Actors (Optional)
 */
exports.getAllActors = async (req, res) => {
    try {
        const actors = await Actor.find();
        res.status(200).json(actors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};