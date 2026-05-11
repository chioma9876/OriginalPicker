const router = require('express').Router();

const { authenticate } = require('../middleware/auth');
const { userLocation } = require('../utils/location');

router.get('/location', authenticate, userLocation)

module.exports = router