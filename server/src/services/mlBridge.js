const axios = require('axios');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

class MLBridgeService {
  /**
   * Check ML Microservice Health
   */
  static async checkHealth() {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
      return { connected: true, data: response.data };
    } catch (err) {
      return { connected: false, error: err.message, engine: 'Node.js Embedded Heuristics Fallback Active' };
    }
  }

  /**
   * Predict Curriculum Drift & Obsolescence (USP 1)
   */
  static async predictCurriculumDrift(payload) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict/curriculum-drift`, payload, {
        timeout: 8000,
        headers: { 'Content-Type': 'application/json' }
      });
      return { ...response.data, source: 'Python_FastAPI_ML' };
    } catch (err) {
      console.warn(`[ML Bridge] Python service call failed (${err.message}). Using high-fidelity fallback.`);
      return this.fallbackCurriculumDrift(payload);
    }
  }

  /**
   * Predict District Demand & Capacity Forecast (USP 2)
   */
  static async predictDistrictForecast(payload) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict/district-forecast`, payload, {
        timeout: 8000,
        headers: { 'Content-Type': 'application/json' }
      });
      return { ...response.data, source: 'Python_FastAPI_ML' };
    } catch (err) {
      console.warn(`[ML Bridge] Python service call failed (${err.message}). Using fallback forecast.`);
      return this.fallbackDistrictForecast(payload);
    }
  }

  /**
   * Predict Candidate Placement Readiness
   */
  static async predictCandidateReadiness(payload) {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/predict/candidate-readiness`, payload, {
        timeout: 8000,
        headers: { 'Content-Type': 'application/json' }
      });
      return { ...response.data, source: 'Python_FastAPI_ML' };
    } catch (err) {
      console.warn(`[ML Bridge] Python candidate predictor fallback.`);
      return this.fallbackCandidateReadiness(payload);
    }
  }

  // --- Resilient Fallback Implementations ---

  static fallbackCurriculumDrift(payload) {
    const sectorKeywords = {
      'Automotive & Mobility': {
        obsolete: ['Carburetor Repair', 'Mechanical Distributor Tuning', 'Drum Brake Shoe Relining Manual'],
        emerging: ['EV Battery Management System (BMS)', 'Regenerative Braking Diagnostics', 'CAN Bus Troubleshooting', 'High-Voltage Safety Protocols'],
        equipment: ['High-Voltage Insulated Toolkits (1000V)', 'BMS Diagnostic Scanner & CAN Analyzer', 'EV Traction Motor Test Bench']
      },
      'Information Technology & Electronics': {
        obsolete: ['Visual Basic 6.0 Maintenance', 'Manual Waterfall Documentation Only', 'Legacy FTP Deployment'],
        emerging: ['Generative AI & LLM Orchestration', 'Prompt Engineering & RAG Architectures', 'Kubernetes & Docker Microservices', 'Cloud FinOps'],
        equipment: ['GPU Compute Workstations (RTX 4090)', 'Dual Gigabit Managed Switch Lab', 'Edge AI Developer Kits (NVIDIA Jetson)']
      },
      'Green Energy & Power': {
        obsolete: ['Coal Thermal Manual Firing', 'Analogue Mechanical Energy Meter Maintenance'],
        emerging: ['Solar Photovoltaic Micro-Inverter Integration', 'Battery Energy Storage Systems (BESS)', 'Smart Grid SCADA & Telemetry'],
        equipment: ['Solar PV Simulator & I-V Curve Tracer', 'Hybrid Inverter Test Rig', 'Digital Power Quality Analyzer']
      },
      'Advanced Manufacturing & Capital Goods': {
        obsolete: ['Manual Drafting Board Drawing', 'Analogue Vernier Logsheet Only'],
        emerging: ['Collaborative Robotics (Cobots)', '5-Axis CNC Programming & CAM', 'Industrial IoT (IIoT) Sensors & MQTT'],
        equipment: ['6-Axis Industrial Robotic Arm', '5-Axis CNC Milling Simulator', 'Industrial 3D Metal Printer']
      },
      'Healthcare & Life Sciences': {
        obsolete: ['Manual Glass Mercury Thermometer Calibration', 'Paper Logbook Triage Filing'],
        emerging: ['Electronic Health Record (EHR) & HL7/FHIR Protocols', 'Point-of-Care Digital Ultrasound', 'Tele-ICU Remote Monitoring Protocols'],
        equipment: ['Digital Patient Simulator (SimMan)', 'Tele-Health Multi-Parameter Monitor', 'Biomedical Defibrillator Analyzer']
      }
    };

    const sectorData = sectorKeywords[payload.sector] || sectorKeywords['Automotive & Mobility'];
    const currentModulesText = (payload.current_modules || []).map(m => `${m.module_name} ${m.description}`).join(' ').toLowerCase();

    const flaggedObsolete = sectorData.obsolete.filter(term => 
      currentModulesText.includes(term.toLowerCase().split(' ')[0])
    ).map(term => ({
      term,
      reason: 'Phased out by industry standards; replaced with automated/digital methods',
      urgency: 'High',
      action: 'Prune or condense into historical context'
    }));

    const covered = sectorData.emerging.filter(skill => 
      currentModulesText.includes(skill.toLowerCase().split(' ')[0])
    );
    const missing = sectorData.emerging.filter(skill => !covered.includes(skill));

    const relevanceScore = Math.max(35, Math.min(94, Math.round(52 + (covered.length * 14) - (flaggedObsolete.length * 8))));

    return {
      status: 'success',
      course_id: payload.course_id,
      course_title: payload.course_title,
      sector: payload.sector,
      relevance_score_pct: relevanceScore,
      drift_risk_level: relevanceScore < 55 ? 'Critical' : (relevanceScore < 80 ? 'Moderate' : 'Low'),
      drift_description: relevanceScore < 55 
        ? 'High obsolescence risk detected. Rapid curriculum modernization required.' 
        : 'Curriculum requires selective integration of emerging industry modules.',
      semantic_similarity_raw: 0.68,
      covered_emerging_skills: covered,
      flagged_obsolete_modules: flaggedObsolete.length > 0 ? flaggedObsolete : [
        { term: 'Legacy Manual Workflow Units', reason: 'Declining industrial utilization', urgency: 'Moderate', action: 'Modernize with digital tools' }
      ],
      recommended_new_modules: missing.map(m => ({
        module_name: m,
        target_nsqf_level: `Level ${Math.min((payload.nsqf_level || 4) + 1, 7)}`,
        recommended_hours: 45,
        practical_ratio_pct: 70,
        key_learning_outcomes: [
          `Hands-on practical mastery of ${m}`,
          'Industrial quality assurance & safety compliance',
          'Real-time problem troubleshooting'
        ]
      })),
      equipment_requirements: sectorData.equipment,
      trainer_upskilling_needs: [
        `Master Trainer Certification in ${missing[0] || 'Modern Diagnostics'}`,
        'Pedagogical Simulation Lab Mastery',
        'Industry 4.0 Standard Operating Procedures'
      ],
      employer_validation_status: 'Pending Committee Review',
      source: 'Node_Embedded_Engine'
    };
  }

  static fallbackDistrictForecast(payload) {
    const growth = (payload.historical_growth_pct || 8.5) / 100;
    const current = payload.open_vacancies || 1200;
    const y1 = Math.round(current * (1 + growth));
    const y2 = Math.round(current * Math.pow(1 + growth, 2));
    const y3 = Math.round(current * Math.pow(1 + growth, 3));
    const gap = y1 - (payload.current_annual_intake || 800);

    return {
      status: 'success',
      district: payload.district,
      sector: payload.sector,
      projected_demand: {
        current_year: current,
        year_1: y1,
        year_2: y2,
        year_3: y3
      },
      current_annual_capacity: payload.current_annual_intake || 800,
      immediate_gap: gap,
      market_condition: gap > 200 ? 'Severe Shortage' : (gap > 0 ? 'Moderate Shortfall' : 'Balanced'),
      recommended_action: gap > 0 ? 'Sanction 2-3 additional accredited batches and upgrade lab rigs' : 'Maintain capacity; focus on retention',
      trainer_recruitment_quota: Math.max(Math.ceil(gap / 40), 2),
      estimated_lab_budget_lakhs: Math.round(Math.max(gap * 0.08, 15.0)),
      source: 'Node_Embedded_Engine'
    };
  }

  static fallbackCandidateReadiness(payload) {
    const skillsCount = (payload.skills_acquired || []).length;
    const score = Math.min(Math.max(skillsCount * 22, 35), 92);
    return {
      status: 'success',
      candidate_name: payload.candidate_name || 'Candidate',
      target_role: payload.target_role,
      target_district: payload.target_district || 'Pune',
      placement_readiness_pct: score,
      matched_skills: (payload.skills_acquired || []).slice(0, 3),
      missing_critical_skills: ['Advanced Diagnostic Protocols', 'Safety Compliance', 'Cloud/IoT Interface'],
      expected_salary_benchmark: '₹ 4.2 - 6.0 LPA',
      recommended_bridge_courses: [
        'Accelerated 3-Week Industry Diagnostic Bootcamp',
        'NSQF Level 5 Bridge Certification'
      ],
      local_employer_hiring_count: 54,
      source: 'Node_Embedded_Engine'
    };
  }
}

module.exports = MLBridgeService;
