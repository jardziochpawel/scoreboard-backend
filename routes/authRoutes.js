const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

/*
 * POST
 */
router.post('/login', authController.sign_in)

module.exports = router;