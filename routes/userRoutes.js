const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const authMiddleware = require('../authMiddleware');

/*
 * POST
 */
router.post('/', authMiddleware.ensureAuthenticated, userController.create);

/*
 * PUT
 */
router.put('/:id', authMiddleware.ensureAuthenticated, userController.update);

/*
 * DELETE
 */
router.delete('/:id', authMiddleware.ensureAuthenticated, userController.remove);

module.exports = router;
