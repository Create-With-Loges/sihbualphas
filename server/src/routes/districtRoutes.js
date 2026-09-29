const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

router.get('/demands', districtController.getDistrictDemands);
router.post('/plans/generate', districtController.generateDistrictPlan);
router.get('/plans', districtController.getAllTrainingPlans);

module.exports = router;
