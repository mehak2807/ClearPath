const express = require('express');
const router = express.Router();
const actorController = require('../controllers/actorController');

// 1. Basic Registration
// URL: http://localhost:5001/api/actors/register
router.post('/register', actorController.registerActor);

// 2. Fetch all actors (Testing ke liye)
// URL: http://localhost:5001/api/actors
router.get('/', actorController.getAllActors);

// 3. Request OTP for KYC
// URL: http://localhost:5001/api/actors/request-otp
router.post('/request-otp', actorController.requestOTP);

// 4. Final Aadhaar + OTP Verification & Key Generation
// URL: http://localhost:5001/api/actors/verify-kyc
router.post('/verify-kyc', actorController.verifyKYC);

module.exports = router;