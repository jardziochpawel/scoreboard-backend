const express = require('express');
const router = express.Router();
const ScoreboardController = require('../controllers/ScoreboardController.js');
const authMiddleware = require('../authMiddleware');

/*
 * GET
 */
router.get('/', ScoreboardController.list);

/*
 * GET
 */
router.get('/:id', ScoreboardController.show);

/*
 * POST
 */
router.post('/', authMiddleware.ensureAuthenticated, ScoreboardController.create);

/*
 * PUT
 */
router.put('/:id', authMiddleware.ensureAuthenticated, ScoreboardController.update);

/*
 * DELETE
 */
router.delete('/:id', authMiddleware.ensureAuthenticated, ScoreboardController.remove);

module.exports = router;
