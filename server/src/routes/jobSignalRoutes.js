const express = require('express');
const router = express.Router();
const jobSignalController = require('../controllers/jobSignalController');

router.get('/', jobSignalController.getJobSignals);
router.get('/top-skills', jobSignalController.getTopSkillsBySector);

module.exports = router;
