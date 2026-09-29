const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');

router.post('/pathway', candidateController.predictCandidatePathway);

module.exports = router;
