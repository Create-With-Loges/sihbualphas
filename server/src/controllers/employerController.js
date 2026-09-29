const EmployerSurvey = require('../models/EmployerSurvey');
const Course = require('../models/Course');

// Submit employer survey and curriculum endorsement
exports.submitSurvey = async (req, res) => {
  try {
    const survey = new EmployerSurvey(req.body);
    await survey.save();

    // If survey is attached to a specific course, record endorsement in course document
    if (req.body.targetCourseCode) {
      const course = await Course.findOne({ courseCode: req.body.targetCourseCode });
      if (course) {
        if (req.body.validationVote === 'Endorsed') {
          course.employerValidationVotes.upvotes += 1;
        } else if (req.body.validationVote === 'Needs_Revision') {
          course.employerValidationVotes.downvotes += 1;
        }
        course.employerValidationVotes.endorsements.push({
          company: req.body.companyName,
          representative: `${req.body.contactPerson} (${req.body.designation})`,
          comment: req.body.qualitativeFeedback || 'Validated via Employer Portal',
          date: new Date()
        });
        await course.save();
      }
    }

    res.status(201).json({
      success: true,
      message: 'Employer survey & curriculum validation submitted successfully',
      data: survey
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all employer surveys
exports.getAllSurveys = async (req, res) => {
  try {
    const surveys = await EmployerSurvey.find().sort({ createdAt: -1 });
    res.json({ success: true, count: surveys.length, data: surveys });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
