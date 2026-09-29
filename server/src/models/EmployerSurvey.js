const mongoose = require('mongoose');

const EmployerSurveySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  sector: { type: String, required: true },
  contactPerson: { type: String, required: true },
  designation: { type: String, required: true },
  district: { type: String, required: true },
  targetCourseCode: { type: String },
  targetCourseTitle: { type: String },
  curriculumRelevanceRating: { type: Number, min: 1, max: 5, default: 4 },
  endorsedEmergingSkills: [String],
  reportedObsoleteSkills: [String],
  projectedAnnualHiring: { type: Number, default: 20 },
  equipmentAccessOffered: { type: Boolean, default: false },
  qualitativeFeedback: { type: String },
  validationVote: { type: String, enum: ['Endorsed', 'Needs_Revision', 'Rejected'], default: 'Endorsed' }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmployerSurvey', EmployerSurveySchema);
