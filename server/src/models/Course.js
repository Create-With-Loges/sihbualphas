const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  module_name: { type: String, required: true },
  description: { type: String, required: true },
  hours: { type: Number, default: 40 },
  is_practical: { type: Boolean, default: true },
  is_obsolete: { type: Boolean, default: false }
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseCode: { type: String, required: true, unique: true },
  sector: { 
    type: String, 
    required: true,
    enum: [
      'Automotive & Mobility',
      'Information Technology & Electronics',
      'Green Energy & Power',
      'Advanced Manufacturing & Capital Goods',
      'Healthcare & Life Sciences'
    ]
  },
  nsqfLevel: { type: Number, required: true, min: 1, max: 8, default: 4 },
  durationWeeks: { type: Number, default: 24 },
  currentEnrollment: { type: Number, default: 120 },
  modules: [ModuleSchema],
  relevanceScore: { type: Number, default: 75.0 }, // 0 to 100%
  driftRiskLevel: { 
    type: String, 
    enum: ['Low', 'Moderate', 'Critical'], 
    default: 'Moderate' 
  },
  driftDescription: { type: String, default: 'Standard curriculum baseline' },
  flaggedObsolete: [{
    term: String,
    reason: String,
    urgency: String,
    action: String
  }],
  recommendedAdditions: [{
    module_name: String,
    target_nsqf_level: String,
    recommended_hours: Number,
    practical_ratio_pct: Number,
    key_learning_outcomes: [String]
  }],
  requiredEquipment: [String],
  trainerRequirements: [String],
  employerValidationVotes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    endorsements: [{
      company: String,
      representative: String,
      comment: String,
      date: { type: Date, default: Date.now }
    }]
  },
  status: { 
    type: String, 
    enum: ['Active', 'Under_Review', 'Updated', 'Deprecated'], 
    default: 'Active' 
  },
  lastAnalyzedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);
