const mongoose = require('mongoose');

const TrainingPlanSchema = new mongoose.Schema({
  planTitle: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  sector: { type: String, required: true },
  year: { type: Number, default: 2026 },
  targetIntakeSeats: { type: Number, required: true },
  trainerUpskillingQuota: { type: Number, required: true },
  equipmentProcurementList: [{
    item: String,
    estimatedCostLakhs: Number,
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' }
  }],
  totalEstimatedBudgetLakhs: { type: Number, default: 25.0 },
  actionChecklist: [{
    task: String,
    timelineWeeks: Number,
    responsibleEntity: String,
    status: { type: String, enum: ['Pending', 'In_Progress', 'Completed'], default: 'Pending' }
  }],
  status: { 
    type: String, 
    enum: ['Draft', 'Approved_By_District_Collector', 'Under_Execution', 'Archived'], 
    default: 'Draft' 
  },
  generatedBy: { type: String, default: 'SkillPulse Automated Plan Generator' }
}, {
  timestamps: true
});

module.exports = mongoose.model('TrainingPlan', TrainingPlanSchema);
