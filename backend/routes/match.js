const express = require('express');
const router = express.Router();
const { matchCandidates } = require('../controllers/matchController');

// POST /api/match
router.post('/', matchCandidates);

module.exports = router;
