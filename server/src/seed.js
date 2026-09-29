const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const JobSignal = require('./models/JobSignal');
const DistrictDemand = require('./models/DistrictDemand');
const EmployerSurvey = require('./models/EmployerSurvey');
const PlacementOutcome = require('./models/PlacementOutcome');
const TrainingPlan = require('./models/TrainingPlan');

dotenv.config();

const sampleCourses = [
  {
    title: 'Automotive Technician (Mechanic Motor Vehicle)',
    courseCode: 'AUTO-MMV-401',
    sector: 'Automotive & Mobility',
    nsqfLevel: 4,
    durationWeeks: 52,
    currentEnrollment: 450,
    relevanceScore: 48.5,
    driftRiskLevel: 'Critical',
    driftDescription: 'Severe lag: 65% of local industrial demand is shifting to Electric Vehicles, Battery Diagnostics, and ADAS, while syllabus retains deprecated mechanical carburetor units.',
    modules: [
      { module_name: 'Engine Fundamentals & Carburetor Repair', description: 'Disassembly, inspection and manual tuning of mechanical carburetors and 2-stroke engines.', hours: 60, is_practical: true, is_obsolete: true },
      { module_name: 'Mechanical Ignition & Distributor Setup', description: 'Contact breaker points adjustment, distributor timing setting, and analogue spark testing.', hours: 45, is_practical: true, is_obsolete: true },
      { module_name: 'Conventional Braking & Drum Shoe Relining', description: 'Manual relining of asbestos/ceramic drum brake shoes and mechanical parking brake links.', hours: 40, is_practical: true, is_obsolete: false },
      { module_name: 'Chassis, Suspension & Wheel Alignment', description: 'Steering geometry, mechanical suspension struts and 4-wheel computerized alignment.', hours: 50, is_practical: true, is_obsolete: false },
      { module_name: 'Basic Auto Electrical & Starter Motors', description: '12V lead-acid battery testing, alternator overhaul, and starter relay circuits.', hours: 45, is_practical: true, is_obsolete: false }
    ],
    flaggedObsolete: [
      { term: 'Carburetor Repair', reason: 'Modern vehicles universally use Electronic Fuel Injection (EFI) or EV powertrains.', urgency: 'High', action: 'Prune immediately and replace with EV Inverter Diagnostics.' },
      { term: 'Distributor Ignition', reason: 'Replaced by ECU-controlled direct coil-on-plug and electronic ignition systems.', urgency: 'High', action: 'Phase out obsolete bench practicals.' }
    ],
    recommendedAdditions: [
      {
        module_name: 'EV Battery Management System (BMS) Diagnostics',
        target_nsqf_level: 'Level 5',
        recommended_hours: 50,
        practical_ratio_pct: 75,
        key_learning_outcomes: ['Cell balancing protocols', 'CAN bus live data logging', 'Thermal runaway mitigation']
      },
      {
        module_name: 'High-Voltage Safety & NFPA 70E Compliance',
        target_nsqf_level: 'Level 5',
        recommended_hours: 30,
        practical_ratio_pct: 80,
        key_learning_outcomes: ['1000V de-energization procedures', 'Insulated PPE usage', 'Emergency high-voltage interlock testing']
      },
      {
        module_name: 'Regenerative Braking & Electric Motor Servicing',
        target_nsqf_level: 'Level 5',
        recommended_hours: 45,
        practical_ratio_pct: 70,
        key_learning_outcomes: ['Brushless DC (BLDC) motor diagnostics', 'Inverter phase signal verification', 'Energy recovery testing']
      }
    ],
    requiredEquipment: [
      'High-Voltage Insulated Safety Toolkits (1000V rated)',
      'BMS Diagnostic Scanner & CAN Analyzer Rig',
      'EV Traction Motor Test Bench',
      'Thermal Imaging Camera for Battery Packs'
    ],
    trainerRequirements: [
      'Master Trainer Certification in High-Voltage EV Systems',
      'Automotive Skills Development Council (ASDC) Level 5 Trainer Badge'
    ],
    employerValidationVotes: {
      upvotes: 18,
      downvotes: 2,
      endorsements: [
        { company: 'Tata Motors EV Division', representative: 'Rajesh Sharma (Head of Technical Training)', comment: 'Crucial transition. We are struggling to find technicians who understand high-voltage safety and CAN diagnostics.' },
        { company: 'Ather Energy', representative: 'Pooja Iyer (Talent Acquisition Lead)', comment: 'Curriculum needs immediate infusion of BMS and telematics skills to meet hiring demand in Pune and Hosur.' }
      ]
    },
    status: 'Under_Review'
  },
  {
    title: 'Cloud-Native & Applied AI Software Engineering',
    courseCode: 'IT-DEV-502',
    sector: 'Information Technology & Electronics',
    nsqfLevel: 6,
    durationWeeks: 36,
    currentEnrollment: 620,
    relevanceScore: 89.0,
    driftRiskLevel: 'Low',
    driftDescription: 'High industry alignment with continuous micro-updates incorporating LLM orchestration and containerized DevSecOps.',
    modules: [
      { module_name: 'Full-Stack REST Architecture with Node.js & React', description: 'Modular REST API design, state management, asynchronous programming and responsive design.', hours: 60, is_practical: true, is_obsolete: false },
      { module_name: 'Docker Containers & Kubernetes Microservices', description: 'Containerization, Pod orchestration, Helm charts, ingress controllers and cluster networking.', hours: 50, is_practical: true, is_obsolete: false },
      { module_name: 'Generative AI & LLM Application Orchestration', description: 'LangChain, vector embeddings, semantic search, prompt engineering, and fine-tuning pipelines.', hours: 55, is_practical: true, is_obsolete: false },
      { module_name: 'Cloud Infrastructure-as-Code & DevSecOps', description: 'Terraform scripting, GitHub Actions CI/CD pipelines, automated SAST/DAST vulnerability scanning.', hours: 45, is_practical: true, is_obsolete: false }
    ],
    flaggedObsolete: [],
    recommendedAdditions: [
      {
        module_name: 'Cloud FinOps & Cost Optimization Architecture',
        target_nsqf_level: 'Level 6',
        recommended_hours: 25,
        practical_ratio_pct: 60,
        key_learning_outcomes: ['Multi-cloud budget tracking', 'Serverless scaling cost models', 'Right-sizing cloud resources']
      }
    ],
    requiredEquipment: [
      'Cloud Sandbox Environment (AWS/GCP Dedicated Orgs)',
      'High-Performance Dev Workstations (32GB RAM, GPU accelerated)'
    ],
    trainerRequirements: ['AWS/GCP Certified Solutions Architect', 'NASSCOM Master Trainer Badge'],
    employerValidationVotes: {
      upvotes: 42,
      downvotes: 1,
      endorsements: [
        { company: 'Infosys Emerging Tech Unit', representative: 'Anand Kulkarni (Director)', comment: 'Excellent focus on practical containerization and GenAI APIs.' }
      ]
    },
    status: 'Updated'
  },
  {
    title: 'Solar Photovoltaic & Smart Grid Technician',
    courseCode: 'GREEN-SOL-303',
    sector: 'Green Energy & Power',
    nsqfLevel: 4,
    durationWeeks: 24,
    currentEnrollment: 380,
    relevanceScore: 68.0,
    driftRiskLevel: 'Moderate',
    driftDescription: 'Covers basic rooftop panels well, but misses high-demand Battery Energy Storage Systems (BESS) and micro-inverter telemetry.',
    modules: [
      { module_name: 'Solar Panel Mechanical Mounting & Civil Framing', description: 'Roof load calculation, clamp fastening, waterproofing and azimuth angle alignment.', hours: 40, is_practical: true, is_obsolete: false },
      { module_name: 'DC Cable Sizing & Array Combiner Box Wiring', description: 'String sizing, MC4 connector crimping, string fuse selection, and DC isolator installation.', hours: 40, is_practical: true, is_obsolete: false },
      { module_name: 'Traditional Central Inverter Wiring', description: 'Basic 3-phase grid tie inverter connectivity and analogue energy meters.', hours: 35, is_practical: true, is_obsolete: false },
      { module_name: 'Earthing & Lightning Surge Protection', description: 'Chemical earth pit installation, copper lightning arresters, and earth resistance measurement.', hours: 30, is_practical: true, is_obsolete: false }
    ],
    flaggedObsolete: [
      { term: 'Analogue Metering', reason: 'Smart digital bi-directional meters and SCADA modems are now mandatory.', urgency: 'Medium', action: 'Update to IoT telemetry' }
    ],
    recommendedAdditions: [
      {
        module_name: 'Battery Energy Storage Systems (BESS) Integration',
        target_nsqf_level: 'Level 5',
        recommended_hours: 40,
        practical_ratio_pct: 75,
        key_learning_outcomes: ['LiFePO4 battery rack installation', 'Hybrid inverter programming', 'Zero-export controller setup']
      },
      {
        module_name: 'Smart Grid SCADA & IoT Remote Telemetry',
        target_nsqf_level: 'Level 5',
        recommended_hours: 35,
        practical_ratio_pct: 70,
        key_learning_outcomes: ['RS485 Modbus configuration', 'Cloud performance ratio monitoring', 'Fault alert triage']
      }
    ],
    requiredEquipment: [
      'Solar PV Array Simulator & I-V Curve Tracer',
      'Hybrid Inverter / Li-Ion Battery Storage Test Rig',
      'Digital Power Quality & Harmonics Analyzer'
    ],
    trainerRequirements: ['Skill Council for Green Jobs (SCGJ) Certified Master Assessor'],
    employerValidationVotes: {
      upvotes: 27,
      downvotes: 3,
      endorsements: [
        { company: 'Adani Solar & Storage', representative: 'Vikas Patel (Project Head)', comment: 'BESS technicians are in extreme demand in Gujarat and Rajasthan solar parks.' }
      ]
    },
    status: 'Active'
  },
  {
    title: 'CNC Machinist & Industrial Robotics Operator',
    courseCode: 'MFG-CNC-404',
    sector: 'Advanced Manufacturing & Capital Goods',
    nsqfLevel: 5,
    durationWeeks: 48,
    currentEnrollment: 510,
    relevanceScore: 61.5,
    driftRiskLevel: 'Moderate',
    driftDescription: 'Curriculum relies primarily on legacy 3-axis manual G-code entry. Urgent demand exists for Collaborative Robots (Cobots) and 5-axis CAM simulation.',
    modules: [
      { module_name: 'Manual Engineering Drawing on Drafting Boards', description: 'T-square orthographic projection drafting on drawing paper.', hours: 40, is_practical: true, is_obsolete: true },
      { module_name: 'Conventional Lathe & Milling Operations', description: 'Manual turning, facing, knurling and gear cutting on conventional machines.', hours: 60, is_practical: true, is_obsolete: false },
      { module_name: '3-Axis CNC Turning & Milling G-Code Programming', description: 'Fanuc / Siemens controller manual G-code programming, tool offset setting.', hours: 80, is_practical: true, is_obsolete: false },
      { module_name: 'Metrology & Precision Inspection with Vernier Calliper', description: 'Manual micrometer, vernier calliper and dial indicator measurement.', hours: 40, is_practical: true, is_obsolete: false }
    ],
    flaggedObsolete: [
      { term: 'Manual Drafting Board Drawing', reason: 'Universal adoption of CAD/CAM modeling (SolidWorks, NX, Fusion360).', urgency: 'High', action: 'Replace with 3D CAD/CAM practicals.' }
    ],
    recommendedAdditions: [
      {
        module_name: 'Collaborative Robotics (Cobots) Programming',
        target_nsqf_level: 'Level 5',
        recommended_hours: 45,
        practical_ratio_pct: 80,
        key_learning_outcomes: ['Teach pendant programming', 'Safe human-machine handoff', 'Pick-and-place end-effector integration']
      },
      {
        module_name: '5-Axis Simultaneous CNC Machining & CAM',
        target_nsqf_level: 'Level 6',
        recommended_hours: 50,
        practical_ratio_pct: 75,
        key_learning_outcomes: ['Multi-axis toolpath simulation', 'Collision avoidance checking', 'High-speed hard milling']
      }
    ],
    requiredEquipment: [
      '6-Axis Industrial Collaborative Robotic Arm (Cobot Trainer)',
      '5-Axis CNC Milling Simulator Unit',
      'Optical 3D Coordinate Measuring Machine (CMM)'
    ],
    trainerRequirements: ['Capital Goods Skill Council Certified Master Trainer in Advanced Mechatronics'],
    employerValidationVotes: {
      upvotes: 31,
      downvotes: 4,
      endorsements: [
        { company: 'Bharat Forge Precision Division', representative: 'Sunil Deshmukh (GM Operations)', comment: 'We automated our forging inspection with Cobots; we need operators trained on teach pendants.' }
      ]
    },
    status: 'Active'
  },
  {
    title: 'Emergency Medical & Digital Health Technician',
    courseCode: 'HLTH-EMT-405',
    sector: 'Healthcare & Life Sciences',
    nsqfLevel: 4,
    durationWeeks: 32,
    currentEnrollment: 310,
    relevanceScore: 72.0,
    driftRiskLevel: 'Moderate',
    driftDescription: 'Strong clinical basics, but missing modern Tele-ICU telemetry, point-of-care digital ultrasound, and EHR software workflows.',
    modules: [
      { module_name: 'Paper Patient Register Documentation & Vitals', description: 'Manual paper triage record keeping and analogue mercury manometer vitals recording.', hours: 35, is_practical: true, is_obsolete: true },
      { module_name: 'Basic Life Support (BLS) & CPR Protocols', description: 'American Heart Association certified chest compression, AED deployment, and airway management.', hours: 50, is_practical: true, is_obsolete: false },
      { module_name: 'Trauma Immobilization & Ambulance Operations', description: 'Spine board strapping, cervical collar application, rapid extrication, and oxygen delivery.', hours: 45, is_practical: true, is_obsolete: false },
      { module_name: 'Patient Pharmacology & Intravenous Cannulation', description: 'IV cannulation, saline administration, drug calculations and anaphylaxis protocol.', hours: 40, is_practical: true, is_obsolete: false }
    ],
    flaggedObsolete: [
      { term: 'Paper Patient Register Documentation', reason: 'Ayushman Bharat Digital Mission (ABDM) mandates digital EHR records and ABHA ID integration.', urgency: 'High', action: 'Transition to Digital EHR simulation' }
    ],
    recommendedAdditions: [
      {
        module_name: 'Tele-ICU Digital Telemetry & Remote Vitals Monitoring',
        target_nsqf_level: 'Level 5',
        recommended_hours: 40,
        practical_ratio_pct: 70,
        key_learning_outcomes: ['Multi-parameter monitor configuration', 'Remote specialist video consultation protocols', 'Alarm triage']
      },
      {
        module_name: 'Point-of-Care Digital Ultrasound & FAST Exam Basics',
        target_nsqf_level: 'Level 5',
        recommended_hours: 35,
        practical_ratio_pct: 80,
        key_learning_outcomes: ['Handheld ultrasound transducer navigation', 'Free fluid detection in trauma', 'Cloud imaging transmission']
      }
    ],
    requiredEquipment: [
      'Adult High-Fidelity Patient Simulation Mannequin',
      'Tele-Health Multi-Parameter Digital Monitor Station',
      'Point-of-Care Handheld Ultrasound Trainer'
    ],
    trainerRequirements: ['Healthcare Sector Skill Council (HSSC) Certified Master Trainer'],
    employerValidationVotes: {
      upvotes: 22,
      downvotes: 1,
      endorsements: [
        { company: 'Apollo Hospitals Emergency Network', representative: 'Dr. Meenakshi Sundaram', comment: 'Paramedics fluent with digital EHR and tele-consultation protocols drastically reduce ER transfer triage time.' }
      ]
    },
    status: 'Active'
  }
];

const sampleJobSignals = [
  {
    jobTitle: 'EV Powertrain Diagnostic Engineer',
    company: 'Tata Passenger Electric Mobility',
    sector: 'Automotive & Mobility',
    locationDistrict: 'Pune',
    state: 'Maharashtra',
    requiredSkills: ['EV Battery Management System (BMS)', 'CAN Bus Troubleshooting', 'High Voltage Safety (NFPA 70E)', 'Thermal Management'],
    nsqfProficiencyLevel: 5,
    hiringVolume: 45,
    avgSalaryLPA: 5.8,
    source: 'LinkedIn',
    urgency: 'Critical'
  },
  {
    jobTitle: 'Electric Scooter Service Specialist',
    company: 'Ola Electric',
    sector: 'Automotive & Mobility',
    locationDistrict: 'Bengaluru',
    state: 'Karnataka',
    requiredSkills: ['BMS Diagnostic Scanner', 'Motor Controller Calibration', 'Regenerative Braking', 'Telematics Firmware Flashing'],
    nsqfProficiencyLevel: 4,
    hiringVolume: 80,
    avgSalaryLPA: 4.2,
    source: 'Naukri',
    urgency: 'Critical'
  },
  {
    jobTitle: 'Generative AI & LLM Systems Engineer',
    company: 'Persistent Systems',
    sector: 'Information Technology & Electronics',
    locationDistrict: 'Pune',
    state: 'Maharashtra',
    requiredSkills: ['Generative AI & LLM Orchestration', 'Prompt Engineering & RAG', 'Python', 'Vector Databases (Pinecone)', 'Docker'],
    nsqfProficiencyLevel: 6,
    hiringVolume: 60,
    avgSalaryLPA: 9.2,
    source: 'LinkedIn',
    urgency: 'High'
  },
  {
    jobTitle: 'Cloud DevSecOps Engineer',
    company: 'Wipro Digital',
    sector: 'Information Technology & Electronics',
    locationDistrict: 'Bengaluru',
    state: 'Karnataka',
    requiredSkills: ['Kubernetes & Docker Microservices', 'Terraform', 'CI/CD Pipelines', 'Zero Trust Security', 'AWS/Azure'],
    nsqfProficiencyLevel: 6,
    hiringVolume: 110,
    avgSalaryLPA: 8.5,
    source: 'LinkedIn',
    urgency: 'High'
  },
  {
    jobTitle: 'Solar BESS Commissioning Specialist',
    company: 'ReNew Power',
    sector: 'Green Energy & Power',
    locationDistrict: 'Ahmedabad',
    state: 'Gujarat',
    requiredSkills: ['Battery Energy Storage Systems (BESS)', 'Solar Photovoltaic Inverter Integration', 'Smart Grid SCADA', 'High Voltage Testing'],
    nsqfProficiencyLevel: 5,
    hiringVolume: 35,
    avgSalaryLPA: 5.2,
    source: 'Employer_Direct_Feed',
    urgency: 'High'
  },
  {
    jobTitle: 'Rooftop Solar EPC Project Supervisor',
    company: 'Tata Power Solar',
    sector: 'Green Energy & Power',
    locationDistrict: 'Coimbatore',
    state: 'Tamil Nadu',
    requiredSkills: ['Solar PV Simulation', 'Array Combiner Wiring', 'Net Metering Compliance', 'Safety Auditing'],
    nsqfProficiencyLevel: 4,
    hiringVolume: 50,
    avgSalaryLPA: 4.0,
    source: 'Naukri',
    urgency: 'Normal'
  },
  {
    jobTitle: 'Cobot Integration & 5-Axis CNC Specialist',
    company: 'Larsen & Toubro Heavy Engineering',
    sector: 'Advanced Manufacturing & Capital Goods',
    locationDistrict: 'Coimbatore',
    state: 'Tamil Nadu',
    requiredSkills: ['Collaborative Robotics (Cobots)', '5-Axis CNC Programming & CAM', 'Industrial IoT (IIoT)', 'Quality Inspection'],
    nsqfProficiencyLevel: 5,
    hiringVolume: 40,
    avgSalaryLPA: 6.0,
    source: 'LinkedIn',
    urgency: 'Critical'
  },
  {
    jobTitle: 'Automated Precision Toolmaker',
    company: 'Bosch Automotive Components',
    sector: 'Advanced Manufacturing & Capital Goods',
    locationDistrict: 'Gurgaon',
    state: 'Haryana',
    requiredSkills: ['5-Axis CNC Machining', 'Digital Twin Simulation', 'Optical CMM Verification', 'GD&T Standards'],
    nsqfProficiencyLevel: 5,
    hiringVolume: 30,
    avgSalaryLPA: 5.5,
    source: 'Government_Portal',
    urgency: 'High'
  },
  {
    jobTitle: 'Emergency Care & Tele-Health Paramedic',
    company: 'Max Healthcare Emergency Services',
    sector: 'Healthcare & Life Sciences',
    locationDistrict: 'Gurgaon',
    state: 'Haryana',
    requiredSkills: ['Tele-ICU Remote Monitoring Protocols', 'Electronic Health Record (EHR)', 'Advanced Cardiac Life Support (ACLS)', 'Ultrasound Triage'],
    nsqfProficiencyLevel: 5,
    hiringVolume: 55,
    avgSalaryLPA: 4.6,
    source: 'Naukri',
    urgency: 'High'
  }
];

const sampleDistrictDemands = [
  {
    district: 'Pune',
    state: 'Maharashtra',
    sector: 'Automotive & Mobility',
    annualJobDemand: 2450,
    trainingCapacitySeats: 1100,
    mismatchGap: 1350,
    marketCondition: 'Severe Shortage',
    topDemandedRoles: ['EV Diagnostic Specialist', 'Battery Pack Assembly Lead', 'CAN Bus Electronics Tech'],
    industrialGrowthRatePct: 14.2,
    activeTrainingInstitutes: 14
  },
  {
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    sector: 'Information Technology & Electronics',
    annualJobDemand: 6800,
    trainingCapacitySeats: 4200,
    mismatchGap: 2600,
    marketCondition: 'Severe Shortage',
    topDemandedRoles: ['Cloud & GenAI Engineer', 'DevSecOps Specialist', 'Edge Computing Firmware Tech'],
    industrialGrowthRatePct: 16.5,
    activeTrainingInstitutes: 28
  },
  {
    district: 'Ahmedabad',
    state: 'Gujarat',
    sector: 'Green Energy & Power',
    annualJobDemand: 1850,
    trainingCapacitySeats: 900,
    mismatchGap: 950,
    marketCondition: 'Severe Shortage',
    topDemandedRoles: ['Solar BESS Commissioning Tech', 'Microgrid SCADA Operator', 'Rooftop EPC Specialist'],
    industrialGrowthRatePct: 18.0,
    activeTrainingInstitutes: 10
  },
  {
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    sector: 'Advanced Manufacturing & Capital Goods',
    annualJobDemand: 2100,
    trainingCapacitySeats: 1450,
    mismatchGap: 650,
    marketCondition: 'Moderate Shortfall',
    topDemandedRoles: ['Cobot Cell Programmer', '5-Axis CNC Master Machinist', 'IIoT Telemetry Integrator'],
    industrialGrowthRatePct: 11.4,
    activeTrainingInstitutes: 16
  },
  {
    district: 'Gurgaon',
    state: 'Haryana',
    sector: 'Healthcare & Life Sciences',
    annualJobDemand: 1600,
    trainingCapacitySeats: 1100,
    mismatchGap: 500,
    marketCondition: 'Moderate Shortfall',
    topDemandedRoles: ['Tele-ICU Digital Paramedic', 'Biomedical Instrument Tech', 'Point-of-Care Sonographer'],
    industrialGrowthRatePct: 10.2,
    activeTrainingInstitutes: 9
  },
  {
    district: 'Chennai',
    state: 'Tamil Nadu',
    sector: 'Automotive & Mobility',
    annualJobDemand: 3100,
    trainingCapacitySeats: 1800,
    mismatchGap: 1300,
    marketCondition: 'Severe Shortage',
    topDemandedRoles: ['EV Inverter Tester', 'Battery Thermal Safety Auditor', 'Chassis Dynamometer Tech'],
    industrialGrowthRatePct: 13.8,
    activeTrainingInstitutes: 19
  },
  {
    district: 'Hyderabad',
    state: 'Telangana',
    sector: 'Information Technology & Electronics',
    annualJobDemand: 4900,
    trainingCapacitySeats: 3400,
    mismatchGap: 1500,
    marketCondition: 'Severe Shortage',
    topDemandedRoles: ['Full-Stack AI Integrator', 'Kubernetes Platform Engineer', 'FinOps Analyst'],
    industrialGrowthRatePct: 15.1,
    activeTrainingInstitutes: 22
  }
];

const sampleSurveys = [
  {
    companyName: 'Tata Passenger Electric Mobility',
    sector: 'Automotive & Mobility',
    contactPerson: 'Rajesh Sharma',
    designation: 'Head of Technical Capability',
    district: 'Pune',
    targetCourseCode: 'AUTO-MMV-401',
    targetCourseTitle: 'Automotive Technician (Mechanic Motor Vehicle)',
    curriculumRelevanceRating: 2,
    endorsedEmergingSkills: ['EV Battery Management System (BMS)', 'High Voltage Safety (NFPA 70E)', 'CAN Bus Troubleshooting'],
    reportedObsoleteSkills: ['Carburetor Repair', 'Mechanical Distributor Tuning'],
    projectedAnnualHiring: 60,
    equipmentAccessOffered: true,
    qualitativeFeedback: 'We are willing to grant access to our Chakan EV plant training rig for student weekend practicals if the curriculum formally adopts BMS units.',
    validationVote: 'Needs_Revision'
  },
  {
    companyName: 'Adani Solar Projects',
    sector: 'Green Energy & Power',
    contactPerson: 'Vikas Patel',
    designation: 'General Manager Engineering',
    district: 'Ahmedabad',
    targetCourseCode: 'GREEN-SOL-303',
    targetCourseTitle: 'Solar Photovoltaic & Smart Grid Technician',
    curriculumRelevanceRating: 3,
    endorsedEmergingSkills: ['Battery Energy Storage Systems (BESS)', 'Smart Grid SCADA'],
    reportedObsoleteSkills: ['Analogue Metering'],
    projectedAnnualHiring: 45,
    equipmentAccessOffered: true,
    qualitativeFeedback: 'We require certified candidates who can wire hybrid inverters with lithium battery racks safely.',
    validationVote: 'Endorsed'
  }
];

const samplePlacements = [
  { candidateName: 'Rahul Deshmukh', courseCode: 'AUTO-MMV-401', courseTitle: 'Automotive Technician', sector: 'Automotive & Mobility', trainingInstitute: 'Government ITI Aundh, Pune', district: 'Pune', placedCompany: 'Tata Motors EV', jobRole: 'EV Battery Diagnostic Tech', annualSalaryLPA: 4.8, curriculumAligned: true, employerFeedbackScore: 5 },
  { candidateName: 'Sneha Patil', courseCode: 'IT-DEV-502', courseTitle: 'Cloud-Native & Applied AI', sector: 'Information Technology & Electronics', trainingInstitute: 'State Skill Development Centre, Bengaluru', district: 'Bengaluru', placedCompany: 'Infosys Emerging Tech', jobRole: 'Junior DevSecOps Engineer', annualSalaryLPA: 7.2, curriculumAligned: true, employerFeedbackScore: 5 },
  { candidateName: 'Amit Verma', courseCode: 'MFG-CNC-404', courseTitle: 'CNC Machinist & Robotics', sector: 'Advanced Manufacturing & Capital Goods', trainingInstitute: 'PSG Tech Skill Institute, Coimbatore', district: 'Coimbatore', placedCompany: 'L&T Precision Engineering', jobRole: 'Cobot Cell Operator', annualSalaryLPA: 5.4, curriculumAligned: true, employerFeedbackScore: 4 },
  { candidateName: 'Priyanka Sharma', courseCode: 'HLTH-EMT-405', courseTitle: 'Emergency Medical Technician', sector: 'Healthcare & Life Sciences', trainingInstitute: 'Medanta Paramedical Academy, Gurgaon', district: 'Gurgaon', placedCompany: 'Apollo Emergency Ambulance', jobRole: 'Tele-Health Emergency Paramedic', annualSalaryLPA: 4.2, curriculumAligned: true, employerFeedbackScore: 5 }
];

async function seedDatabase() {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillpulse_db';
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB');

    await Course.deleteMany({});
    await JobSignal.deleteMany({});
    await DistrictDemand.deleteMany({});
    await EmployerSurvey.deleteMany({});
    await PlacementOutcome.deleteMany({});
    await TrainingPlan.deleteMany({});

    console.log('[Seed] Cleared existing collections.');

    await Course.insertMany(sampleCourses);
    await JobSignal.insertMany(sampleJobSignals);
    await DistrictDemand.insertMany(sampleDistrictDemands);
    await EmployerSurvey.insertMany(sampleSurveys);
    await PlacementOutcome.insertMany(samplePlacements);

    console.log('[Seed] Successfully inserted:');
    console.log(` - ${sampleCourses.length} Courses with rich curriculum modules & obsolescence flags`);
    console.log(` - ${sampleJobSignals.length} Real-time Job Posting Signals`);
    console.log(` - ${sampleDistrictDemands.length} District-Level Labour Demand records`);
    console.log(` - ${sampleSurveys.length} Employer Surveys & Endorsements`);
    console.log(` - ${samplePlacements.length} Candidate Placement records`);

    await mongoose.disconnect();
    console.log('[Seed] Database populated successfully. Exiting.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
