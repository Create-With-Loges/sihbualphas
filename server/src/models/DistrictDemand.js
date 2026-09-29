const mongoose = require('mongoose');

const DistrictDemandSchema = new mongoose.Schema({
  district: { type: String, required: true },
  state: { type: String, required: true },
  sector: { type: String, required: true },
  annualJobDemand: { type: Number, required: true },
  trainingCapacitySeats: { type: Number, required: true },
  mismatchGap: { type: Number, required: true }, // positive = undersupply/shortage, negative = oversupply
  marketCondition: { 
    type: String, 
    enum: ['Severe Shortage', 'Moderate Shortfall', 'Balanced', 'Oversupplied'],
    default: 'Moderate Shortfall'
  },
  topDemandedRoles: [String],
  industrialGrowthRatePct: { type: Number, default: 8.5 },
  activeTrainingInstitutes: { type: Number, default: 12 },
  lastSurveyQuarter: { type: String, default: 'Q3-2026' }
}, {
  timestamps: true
});

module.exports = mongoose.model('DistrictDemand', DistrictDemandSchema);
