const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

router.post('/survey', employerController.submitSurvey);
router.get('/surveys', employerController.getAllSurveys);

module.exports = router;
