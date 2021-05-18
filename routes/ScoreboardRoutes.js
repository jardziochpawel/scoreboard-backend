const express = require('express');
const router = express.Router();
const ScoreboardController = require('../controllers/ScoreboardController.js');

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
router.post('/', ScoreboardController.create);

/*
 * PUT
 */
router.put('/:id', ScoreboardController.update);

/*
 * DELETE
 */
router.delete('/:id', ScoreboardController.remove);

module.exports = router;
