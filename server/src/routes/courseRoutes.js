const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.post('/:id/analyze-gap', courseController.analyzeCourseGap);
router.post('/:id/apply-update', courseController.applyCurriculumUpdate);
router.post('/:id/vote', courseController.voteEndorsement);
router.post('/', courseController.createCourse);

module.exports = router;
