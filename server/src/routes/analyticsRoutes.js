const express = require('express');
const router = express.Router();
const {
  getExecutiveOverview,
  queryDataAnalysis,
  simulateScenario
} = require('../controllers/analyticsController');

router.get('/overview', getExecutiveOverview);
router.get('/query', queryDataAnalysis);
router.post('/simulate', simulateScenario);

module.exports = router;
