const MLBridgeService = require('../services/mlBridge');
const JobSignal = require('../models/JobSignal');
const Course = require('../models/Course');

// Predict candidate placement readiness & career pathway
exports.predictCandidatePathway = async (req, res) => {
  try {
    const { candidateName, courseTitle, skillsAcquired, targetRole, sector, targetDistrict } = req.body;

    const payload = {
      candidate_name: candidateName || 'Candidate',
      completed_course_title: courseTitle || 'Automotive Technician',
      skills_acquired: skillsAcquired || ['Engine Maintenance', 'Brake Servicing'],
      target_role: targetRole || 'EV Diagnostic Specialist',
      sector: sector || 'Automotive & Mobility',
      target_district: targetDistrict || 'Pune'
    };

    const prediction = await MLBridgeService.predictCandidateReadiness(payload);

    // Fetch active matching job vacancies in the target district
    const matchingJobs = await JobSignal.find({
      sector: payload.sector,
      locationDistrict: payload.target_district
    }).limit(6);

    res.json({
      success: true,
      data: {
        prediction,
        matchingJobs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
