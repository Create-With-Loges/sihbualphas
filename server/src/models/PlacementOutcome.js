const mongoose = require('mongoose');

const PlacementOutcomeSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  courseCode: { type: String, required: true },
  courseTitle: { type: String, required: true },
  sector: { type: String, required: true },
  trainingInstitute: { type: String, required: true },
  district: { type: String, required: true },
  placedCompany: { type: String, required: true },
  jobRole: { type: String, required: true },
  annualSalaryLPA: { type: Number, required: true },
  curriculumAligned: { type: Boolean, default: true },
  employerFeedbackScore: { type: Number, min: 1, max: 5, default: 4 },
  placementMonth: { type: String, default: 'August 2026' }
}, {
  timestamps: true
});

module.exports = mongoose.model('PlacementOutcome', PlacementOutcomeSchema);
