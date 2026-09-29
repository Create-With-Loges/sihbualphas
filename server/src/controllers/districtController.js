const DistrictDemand = require('../models/DistrictDemand');
const TrainingPlan = require('../models/TrainingPlan');
const MLBridgeService = require('../services/mlBridge');

// Get all district labour demands
exports.getDistrictDemands = async (req, res) => {
  try {
    const { state, sector, marketCondition } = req.query;
    const filter = {};
    if (state && state !== 'All') filter.state = state;
    if (sector && sector !== 'All') filter.sector = sector;
    if (marketCondition && marketCondition !== 'All') filter.marketCondition = marketCondition;

    const demands = await DistrictDemand.find(filter).sort({ mismatchGap: -1 });
    res.json({ success: true, count: demands.length, data: demands });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate automated District Training Plan (USP 2)
exports.generateDistrictPlan = async (req, res) => {
  try {
    const { district, sector } = req.body;
    
    // Find district demand baseline or create fallback
    let record = await DistrictDemand.findOne({ district, sector });
    if (!record) {
      record = await DistrictDemand.findOne({ district }) || {
        district: district || 'Pune',
        state: 'Maharashtra',
        sector: sector || 'Automotive & Mobility',
        annualJobDemand: 1650,
        trainingCapacitySeats: 920,
        industrialGrowthRatePct: 9.2
      };
    }

    // Call ML Forecast Engine
    const forecastPayload = {
      district: record.district,
      sector: record.sector,
      current_annual_intake: record.trainingCapacitySeats,
      historical_growth_pct: record.industrialGrowthRatePct || 8.5,
      open_vacancies: record.annualJobDemand,
      planned_industrial_investments_crores: 500.0
    };

    const forecast = await MLBridgeService.predictDistrictForecast(forecastPayload);

    // Equipment catalogue based on sector
    const equipmentMap = {
      'Automotive & Mobility': [
        { item: 'EV Battery Diagnostic Scanner & CAN Analyzer Rig', estimatedCostLakhs: 8.5, priority: 'High' },
        { item: '1000V High-Voltage Insulated Safety Toolkits (x5 sets)', estimatedCostLakhs: 2.2, priority: 'High' },
        { item: 'Cut-section Electric Powertrain Demonstration Rig', estimatedCostLakhs: 6.0, priority: 'Medium' }
      ],
      'Information Technology & Electronics': [
        { item: 'AI/Deep Learning Edge Workstation Lab (8 Nodes)', estimatedCostLakhs: 14.0, priority: 'High' },
        { item: 'Managed Cloud Sandbox & DevOps CI/CD Rack', estimatedCostLakhs: 4.5, priority: 'Medium' },
        { item: 'Cybersecurity Range & Hardware Simulation Kits', estimatedCostLakhs: 3.8, priority: 'Low' }
      ],
      'Green Energy & Power': [
        { item: 'Solar PV Array Simulator & Rooftop Testing Rig', estimatedCostLakhs: 7.2, priority: 'High' },
        { item: 'Li-Ion BESS Hybrid Inverter Bench', estimatedCostLakhs: 6.5, priority: 'High' },
        { item: 'Digital Harmonic & Power Factor Analyzer', estimatedCostLakhs: 3.0, priority: 'Medium' }
      ],
      'Advanced Manufacturing & Capital Goods': [
        { item: '6-Axis Industrial Collaborative Robot (Cobot) Trainer', estimatedCostLakhs: 16.5, priority: 'High' },
        { item: '5-Axis CNC Milling Simulator Unit', estimatedCostLakhs: 9.0, priority: 'High' },
        { item: 'Industrial 3D Printing & Optical CMM Scanner', estimatedCostLakhs: 5.5, priority: 'Medium' }
      ],
      'Healthcare & Life Sciences': [
        { item: 'Adult Patient High-Fidelity Simulation Mannequin', estimatedCostLakhs: 12.0, priority: 'High' },
        { item: 'Tele-Health Diagnostic Station & Multi-Parameter Monitor', estimatedCostLakhs: 5.5, priority: 'High' },
        { item: 'Biomedical Equipment Calibration & Test Bench', estimatedCostLakhs: 4.2, priority: 'Medium' }
      ]
    };

    const selectedEquipment = equipmentMap[record.sector] || equipmentMap['Automotive & Mobility'];
    const totalEquipmentCost = selectedEquipment.reduce((acc, curr) => acc + curr.estimatedCostLakhs, 0);

    const plan = new TrainingPlan({
      planTitle: `${record.district} ${record.sector} Strategic Capacity & Modernization Plan 2026-2029`,
      district: record.district,
      state: record.state,
      sector: record.sector,
      year: 2026,
      targetIntakeSeats: forecast.projected_demand.year_1,
      trainerUpskillingQuota: forecast.trainer_recruitment_quota,
      equipmentProcurementList: selectedEquipment,
      totalEstimatedBudgetLakhs: Math.round((totalEquipmentCost + (forecast.trainer_recruitment_quota * 1.5)) * 10) / 10,
      actionChecklist: [
        { task: 'Notify Technical Institutes of 25% intake expansion for emerging roles', timelineWeeks: 4, responsibleEntity: 'District Skill Committee', status: 'In_Progress' },
        { task: 'Issue procurement tender for high-priority diagnostic equipment', timelineWeeks: 8, responsibleEntity: 'State Technical Directorate', status: 'Pending' },
        { task: 'Deploy Master Trainer 3-week upskilling cohort in partnership with Sector Skill Council', timelineWeeks: 6, responsibleEntity: 'Sector Skill Council (SSC)', status: 'Pending' },
        { task: 'Convene local employer consortium for apprenticeship and OJT MoUs', timelineWeeks: 10, responsibleEntity: 'District Industry Centre (DIC)', status: 'Pending' }
      ],
      status: 'Approved_By_District_Collector'
    });

    await plan.save();

    res.json({
      success: true,
      message: 'District Training Action Plan successfully generated via ML Forecasting Engine',
      data: {
        plan,
        forecast
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all generated training plans
exports.getAllTrainingPlans = async (req, res) => {
  try {
    const plans = await TrainingPlan.find().sort({ createdAt: -1 });
    res.json({ success: true, count: plans.length, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
