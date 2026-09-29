const express = require('express');
const router = express.Router();
const MLBridgeService = require('../services/mlBridge');

// Health and status of ML engine
router.get('/health', async (req, res) => {
  const health = await MLBridgeService.checkHealth();
  res.json({ success: true, ...health });
});

// Test inference directly
router.post('/curriculum-drift', async (req, res) => {
  const result = await MLBridgeService.predictCurriculumDrift(req.body);
  res.json({ success: true, data: result });
});

router.post('/district-forecast', async (req, res) => {
  const result = await MLBridgeService.predictDistrictForecast(req.body);
  res.json({ success: true, data: result });
});

router.post('/candidate-readiness', async (req, res) => {
  const result = await MLBridgeService.predictCandidateReadiness(req.body);
  res.json({ success: true, data: result });
});

module.exports = router;
