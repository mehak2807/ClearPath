const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// POST: http://localhost:5000/api/events/add
router.post('/add', eventController.logEvent);

module.exports = router;