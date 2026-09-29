const mongoose = require('mongoose');

const JobSignalSchema = new mongoose.Schema({
  signalId: { type: String, index: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  sector: { type: String, required: true, index: true },
  locationDistrict: { type: String, required: true, index: true },
  state: { type: String, required: true },
  requiredSkills: [{ type: String }],
  primarySkill: { type: String },
  skillsCount: { type: Number, default: 3 },
  nsqfProficiencyLevel: { type: Number, default: 4 },
  hiringVolume: { type: Number, default: 1 },
  avgSalaryLPA: { type: Number, default: 4.5 },
  source: { type: String, default: 'LinkedIn' },
  urgency: { type: String, default: 'High' },
  growthTrendPct: { type: Number, default: 12.0 },
  isObsoleteRole: { type: Boolean, default: false, index: true },
  postedDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('JobSignal', JobSignalSchema);
