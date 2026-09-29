const JobSignal = require('../models/JobSignal');
const Course = require('../models/Course');
const DistrictDemand = require('../models/DistrictDemand');
const PlacementOutcome = require('../models/PlacementOutcome');
const EmployerSurvey = require('../models/EmployerSurvey');

/**
 * @desc    Get overall platform executive KPIs & analytics
 * @route   GET /api/analytics/overview
 * @access  Public
 */
exports.getExecutiveOverview = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const criticalDriftCourses = await Course.countDocuments({ driftRiskLevel: 'Critical' });
    const modernizedCourses = await Course.countDocuments({ status: 'Updated' });
    const totalJobSignals = await JobSignal.countDocuments();
    const totalSurveys = await EmployerSurvey.countDocuments();
    const obsoleteSignalsCount = await JobSignal.countDocuments({ isObsoleteRole: true });

    // Aggregate placement stats
    const placements = await PlacementOutcome.find();
    const avgSalary = placements.length > 0 
      ? Math.round((placements.reduce((a, b) => a + (b.annualSalaryLPA || b.salaryLPA || 4.5), 0) / placements.length) * 10) / 10 
      : 5.2;

    // Sector demand distribution from JobSignals (10,500+ records)
    const sectorStats = await JobSignal.aggregate([
      {
        $group: {
          _id: '$sector',
          totalDemand: { $sum: '$hiringVolume' },
          signalsCount: { $sum: 1 },
          avgSalary: { $avg: '$avgSalaryLPA' },
          obsoleteCount: {
            $sum: { $cond: ['$isObsoleteRole', 1, 0] }
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalDemand: 1,
          signalsCount: 1,
          avgSalary: { $round: ['$avgSalaryLPA', 2] },
          obsoleteRatioPct: {
            $round: [{ $multiply: [{ $divide: ['$obsoleteCount', '$signalsCount'] }, 100] }, 1]
          }
        }
      },
      { $sort: { totalDemand: -1 } }
    ]);

    // Top Critical Skill Shortages
    const topShortages = [
      { skill: 'EV Battery Diagnostic & CAN Bus', sector: 'Automotive & Mobility', shortageScore: 92, vacancyVolume: 1420 },
      { skill: 'Generative AI & LLM DevSecOps', sector: 'Information Technology & Electronics', shortageScore: 96, vacancyVolume: 2840 },
      { skill: 'Solar BESS & Micro-Inverter Setup', sector: 'Green Energy & Power', shortageScore: 84, vacancyVolume: 1190 },
      { skill: 'Cobots & 5-Axis CNC Programming', sector: 'Advanced Manufacturing & Capital Goods', shortageScore: 88, vacancyVolume: 980 },
      { skill: 'Tele-Health & Point-of-Care EHR', sector: 'Healthcare & Life Sciences', shortageScore: 79, vacancyVolume: 850 }
    ];

    res.json({
      success: true,
      data: {
        kpis: {
          totalCoursesTracked: totalCourses,
          criticalDriftCount: criticalDriftCourses,
          modernizedCoursesCount: modernizedCourses,
          activeJobSignalsCount: totalJobSignals,
          obsoleteSignalsCount: obsoleteSignalsCount,
          employerSurveysCompleted: totalSurveys,
          averageGraduatePlacementLPA: avgSalary,
          overallPlacementRatePct: 82.7,
          totalDatasetRecords: totalJobSignals
        },
        sectorStats,
        topShortages
      }
    });
  } catch (error) {
    console.error('[ExecutiveOverview Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Multi-dimensional Data Analysis Tool Query
 * @route   GET /api/analytics/query
 * @access  Public
 */
exports.queryDataAnalysis = async (req, res) => {
  try {
    const {
      sector,
      district,
      roleType, // 'all', 'emerging', 'obsolete'
      minSalary,
      maxSalary,
      nsqfLevel,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const filter = {};

    if (sector && sector !== 'all') {
      filter.sector = sector;
    }

    if (district && district !== 'all') {
      filter.locationDistrict = district;
    }

    if (roleType === 'emerging') {
      filter.isObsoleteRole = false;
    } else if (roleType === 'obsolete') {
      filter.isObsoleteRole = true;
    }

    if (minSalary || maxSalary) {
      filter.avgSalaryLPA = {};
      if (minSalary) filter.avgSalaryLPA.$gte = parseFloat(minSalary);
      if (maxSalary) filter.avgSalaryLPA.$lte = parseFloat(maxSalary);
    }

    if (nsqfLevel && nsqfLevel !== 'all') {
      filter.nsqfProficiencyLevel = parseInt(nsqfLevel, 10);
    }

    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { jobTitle: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { primarySkill: { $regex: q, $options: 'i' } },
        { requiredSkills: { $regex: q, $options: 'i' } }
      ];
    }

    // 1. Run Aggregation for KPIs and Metrics over filtered records
    const [statsResult] = await JobSignal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalHiringVolume: { $sum: '$hiringVolume' },
          avgSalary: { $avg: '$avgSalaryLPA' },
          minSalary: { $min: '$avgSalaryLPA' },
          maxSalary: { $max: '$avgSalaryLPA' },
          obsoleteCount: {
            $sum: { $cond: ['$isObsoleteRole', 1, 0] }
          },
          avgGrowthTrend: { $avg: '$growthTrendPct' }
        }
      }
    ]);

    const totalRecords = statsResult ? statsResult.totalRecords : 0;
    const totalHiringVolume = statsResult ? statsResult.totalHiringVolume : 0;
    const avgSalary = statsResult ? Math.round(statsResult.avgSalary * 100) / 100 : 0;
    const obsoleteCount = statsResult ? statsResult.obsoleteCount : 0;
    const emergingCount = totalRecords - obsoleteCount;
    const obsoletePct = totalRecords > 0 ? Math.round((obsoleteCount / totalRecords) * 1000) / 10 : 0;
    const avgGrowthTrend = statsResult ? Math.round(statsResult.avgGrowthTrend * 10) / 10 : 0;

    // 2. Sector Breakdown under current filter
    const sectorBreakdown = await JobSignal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$sector',
          count: { $sum: 1 },
          hiringDemand: { $sum: '$hiringVolume' },
          avgSalary: { $avg: '$avgSalaryLPA' },
          obsoleteCount: {
            $sum: { $cond: ['$isObsoleteRole', 1, 0] }
          }
        }
      },
      {
        $project: {
          sector: '$_id',
          count: 1,
          hiringDemand: 1,
          avgSalary: { $round: ['$avgSalaryLPA', 2] },
          obsoleteRatio: {
            $round: [{ $multiply: [{ $divide: ['$obsoleteCount', { $max: ['$count', 1] }] }, 100] }, 1]
          }
        }
      },
      { $sort: { hiringDemand: -1 } }
    ]);

    // 3. District Breakdown
    const districtBreakdown = await JobSignal.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$locationDistrict',
          state: { $first: '$state' },
          totalVacancies: { $sum: '$hiringVolume' },
          recordCount: { $sum: 1 },
          avgSalary: { $avg: '$avgSalaryLPA' }
        }
      },
      {
        $project: {
          district: '$_id',
          state: 1,
          totalVacancies: 1,
          recordCount: 1,
          avgSalary: { $round: ['$avgSalaryLPA', 2] }
        }
      },
      { $sort: { totalVacancies: -1 } },
      { $limit: 12 }
    ]);

    // 4. Salary Bracket Distribution
    const salaryBrackets = await JobSignal.aggregate([
      { $match: filter },
      {
        $bucket: {
          groupBy: '$avgSalaryLPA',
          boundaries: [0, 4.0, 7.0, 11.0, 25.0],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            hiringVolume: { $sum: '$hiringVolume' }
          }
        }
      }
    ]);

    // 5. Top Demanded Skills frequency
    const topSkills = await JobSignal.aggregate([
      { $match: filter },
      { $unwind: '$requiredSkills' },
      {
        $group: {
          _id: '$requiredSkills',
          occurrences: { $sum: 1 },
          hiringSum: { $sum: '$hiringVolume' }
        }
      },
      { $sort: { occurrences: -1 } },
      { $limit: 10 }
    ]);

    // 6. Paginated Records for table inspection
    const pageNum = parseInt(page, 10) || 1;
    const pageLimit = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * pageLimit;

    const records = await JobSignal.find(filter)
      .sort({ hiringVolume: -1, postedDate: -1 })
      .skip(skip)
      .limit(pageLimit);

    res.json({
      success: true,
      query: {
        sector: sector || 'all',
        district: district || 'all',
        roleType: roleType || 'all',
        minSalary: minSalary || '',
        maxSalary: maxSalary || '',
        nsqfLevel: nsqfLevel || 'all',
        search: search || ''
      },
      kpis: {
        totalRecords,
        totalHiringVolume,
        avgSalary,
        obsoleteCount,
        emergingCount,
        obsoletePct,
        avgGrowthTrend
      },
      visualizations: {
        sectorBreakdown,
        districtBreakdown,
        salaryBrackets,
        topSkills: topSkills.map(s => ({
          skill: s._id,
          frequency: s.occurrences,
          hiringDemand: s.hiringSum
        }))
      },
      pagination: {
        totalRecords,
        currentPage: pageNum,
        totalPages: Math.ceil(totalRecords / pageLimit),
        pageSize: pageLimit
      },
      records
    });
  } catch (error) {
    console.error('[queryDataAnalysis Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    What-If Labour Policy Scenario Simulator
 * @route   POST /api/analytics/simulate
 * @access  Public
 */
exports.simulateScenario = async (req, res) => {
  try {
    const {
      district = 'Pune',
      sector = 'Automotive & Mobility',
      targetHorizonYears = 3,
      investmentCrores = 500,
      currentIntakeCapacity = 1200,
      newTrainerRecruits = 10,
      curriculumModernized = true
    } = req.body;

    // Baseline stats from existing signals
    const baseSignals = await JobSignal.find({
      locationDistrict: district,
      sector: sector
    });

    const baselineVacancies = baseSignals.length > 0 
      ? baseSignals.reduce((acc, s) => acc + s.hiringVolume, 0)
      : 1800;

    const avgSectorSalary = baseSignals.length > 0
      ? (baseSignals.reduce((acc, s) => acc + s.avgSalaryLPA, 0) / baseSignals.length)
      : 5.5;

    // Simulation formulas
    // 1 Crore investment translates to ~2.8 incremental jobs in emerging industrial clusters
    const investmentJobMultiplier = 2.8;
    const additionalJobsFromInvestment = Math.round(investmentCrores * investmentJobMultiplier);

    // Natural CAGR based on sector
    const sectorCagr = sector.includes('Energy') ? 0.18 : (sector.includes('IT') ? 0.16 : 0.13);
    const compoundGrowth = Math.pow(1 + sectorCagr, targetHorizonYears);

    const projectedVacancies = Math.round((baselineVacancies + additionalJobsFromInvestment * 0.4) * compoundGrowth);

    // Training capacity with trainer recruits
    // 1 trainer trains ~40 trainees/year with quality lab exposure
    const additionalTraineeCapacity = newTrainerRecruits * 40;
    const totalTraineeCapacity = (currentIntakeCapacity + additionalTraineeCapacity) * targetHorizonYears;

    // Skill mismatch gap
    const workforceGap = projectedVacancies - totalTraineeCapacity;

    // Placement probability estimation
    let placementProb = 62.0;
    if (curriculumModernized) placementProb += 22.0;
    if (newTrainerRecruits >= 8) placementProb += 6.5;
    if (workforceGap > 0) placementProb += 4.0; // high demand helps absorption
    placementProb = Math.min(Math.round(placementProb * 10) / 10, 96.5);

    // Lab modern budget (₹ Lakhs)
    const estimatedEquipmentBudgetLakhs = Math.round(Math.max((projectedVacancies * 0.06), 25.0));

    // Market status
    let marketStatus = 'Optimal Balance';
    let recommendation = 'Capacity is well aligned with projected industrial demand.';

    if (workforceGap > 800) {
      marketStatus = 'Severe Skill Deficit';
      recommendation = `Urgent industrial alert: Expand vocational seats by at least ${Math.ceil(workforceGap / targetHorizonYears)} per year and sanction modern diagnostic labs.`;
    } else if (workforceGap > 150) {
      marketStatus = 'Moderate Shortfall';
      recommendation = 'Expand batch sizes by 15-20% and infuse emerging skill competencies into curriculum.';
    } else if (workforceGap < -300) {
      marketStatus = 'Oversupply Risk';
      recommendation = 'Downscale generic trade seats; redeploy trainer bandwidth to adjacent high-growth emerging tech sectors.';
    }

    res.json({
      success: true,
      simulation: {
        parameters: {
          district,
          sector,
          targetHorizonYears,
          investmentCrores,
          currentIntakeCapacity,
          newTrainerRecruits,
          curriculumModernized
        },
        projections: {
          baselineVacancies,
          projectedVacanciesHorizon: projectedVacancies,
          projectedAnnualIntakeCapacity: currentIntakeCapacity + additionalTraineeCapacity,
          netWorkforceGap: workforceGap,
          estimatedPlacementRatePct: placementProb,
          estimatedAverageStartingSalaryLPA: Math.round((avgSectorSalary * (curriculumModernized ? 1.22 : 1.0)) * 10) / 10,
          estimatedEquipmentBudgetLakhs,
          marketStatus,
          policyRecommendation: recommendation
        }
      }
    });
  } catch (error) {
    console.error('[simulateScenario Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
