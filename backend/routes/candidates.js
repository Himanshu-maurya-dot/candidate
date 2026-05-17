const express = require('express');
const router = express.Router();
const { addCandidate, getAllCandidates, deleteCandidate } = require('../controllers/candidateController');

// POST /api/candidates
router.post('/', addCandidate);

// GET /api/candidates
router.get('/', getAllCandidates);

// DELETE /api/candidates/:id
router.delete('/:id', deleteCandidate);

module.exports = router;
