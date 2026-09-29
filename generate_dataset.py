"""
SkillPulse AI - Synthetic 10,000+ Labour Market & Curriculum Alignment Dataset Generator
Generates realistic datasets reflecting Indian vocational & industrial demands across 7 key sectors,
50+ districts, 10,000+ job posting signals, curriculum modules, and placement tracking records.
"""

import os
import random
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Create output directories
DATASET_DIR = os.path.join(os.path.dirname(__file__), "dataset")
ML_DATA_DIR = os.path.join(os.path.dirname(__file__), "ml_service", "data")
os.makedirs(DATASET_DIR, exist_ok=True)
os.makedirs(ML_DATA_DIR, exist_ok=True)

# 1. Domain Taxonomies
SECTORS = [
    "Automotive & Mobility",
    "Information Technology & Electronics",
    "Green Energy & Power",
    "Advanced Manufacturing & Capital Goods",
    "Healthcare & Life Sciences",
    "Smart Infrastructure & Construction",
    "AgriTech & Automation"
]

DISTRICTS_DATA = [
    {"district": "Pune", "state": "Maharashtra", "primary_sector": "Automotive & Mobility", "growth_rate": 14.2},
    {"district": "Bengaluru Urban", "state": "Karnataka", "primary_sector": "Information Technology & Electronics", "growth_rate": 16.5},
    {"district": "Ahmedabad", "state": "Gujarat", "primary_sector": "Green Energy & Power", "growth_rate": 18.0},
    {"district": "Coimbatore", "state": "Tamil Nadu", "primary_sector": "Advanced Manufacturing & Capital Goods", "growth_rate": 11.4},
    {"district": "Gurgaon", "state": "Haryana", "primary_sector": "Healthcare & Life Sciences", "growth_rate": 10.2},
    {"district": "Chennai", "state": "Tamil Nadu", "primary_sector": "Automotive & Mobility", "growth_rate": 13.8},
    {"district": "Hyderabad", "state": "Telangana", "primary_sector": "Information Technology & Electronics", "growth_rate": 15.1},
    {"district": "Noida", "state": "Uttar Pradesh", "primary_sector": "Information Technology & Electronics", "growth_rate": 13.0},
    {"district": "Surat", "state": "Gujarat", "primary_sector": "Advanced Manufacturing & Capital Goods", "growth_rate": 12.5},
    {"district": "Indore", "state": "Madhya Pradesh", "primary_sector": "Smart Infrastructure & Construction", "growth_rate": 11.0},
    {"district": "Jaipur", "state": "Rajasthan", "primary_sector": "Green Energy & Power", "growth_rate": 14.0},
    {"district": "Visakhapatnam", "state": "Andhra Pradesh", "primary_sector": "Advanced Manufacturing & Capital Goods", "growth_rate": 10.8},
    {"district": "Vadodara", "state": "Gujarat", "primary_sector": "Green Energy & Power", "growth_rate": 13.5},
    {"district": "Mysuru", "state": "Karnataka", "primary_sector": "Information Technology & Electronics", "growth_rate": 11.8},
    {"district": "Nashik", "state": "Maharashtra", "primary_sector": "AgriTech & Automation", "growth_rate": 9.5},
    {"district": "Kochi", "state": "Kerala", "primary_sector": "Healthcare & Life Sciences", "growth_rate": 12.0}
]

SECTOR_SKILLS_ONTOLOGY = {
    "Automotive & Mobility": {
        "roles": [
            "EV Battery Diagnostic Specialist", "CAN Bus Electronics Technician",
            "High Voltage Safety Supervisor", "Electric Powertrain Assembler",
            "ADAS Sensor Calibration Tech", "Telematics Firmware Specialist",
            "Conventional Auto Mechanic (Legacy)", "Carburetor Service Hand (Obsolete)"
        ],
        "emerging_skills": [
            "EV Battery Management System (BMS)", "CAN / LIN Bus Troubleshooting",
            "High-Voltage Safety (NFPA 70E)", "Regenerative Braking Diagnostics",
            "Inverter Phase Signal Verification", "ADAS Sensor Calibration",
            "Telematics & IoT Gateway", "Thermal Runaway Mitigation"
        ],
        "legacy_skills": [
            "Carburetor Overhaul & Tuning", "Mechanical Distributor Setup",
            "Drum Brake Shoe Relining Manual", "Mechanical Fuel Pump Service",
            "Contact Breaker Point Setting", "Analogue Lead Acid Hydrometer Reading"
        ],
        "companies": ["Tata Motors EV", "Ola Electric", "Ather Energy", "Mahindra Electric", "Bajaj Auto", "Hero Electric", "Bosch India"]
    },
    "Information Technology & Electronics": {
        "roles": [
            "Cloud DevSecOps Engineer", "Generative AI Application Developer",
            "Kubernetes Microservices Architect", "Prompt & RAG Engineer",
            "Full-Stack React & Node Developer", "Cybersecurity Threat Hunter",
            "Visual Basic Legacy Programmer (Obsolete)", "Manual Waterfall Documenter (Obsolete)"
        ],
        "emerging_skills": [
            "Generative AI & LLM Orchestration", "Prompt Engineering & RAG",
            "Kubernetes & Docker Microservices", "Cloud FinOps & Infrastructure-as-Code",
            "Zero Trust Cybersecurity", "Vector Databases (Pinecone/Chroma)",
            "Edge AI C++ Firmware", "Kafka Event Streaming"
        ],
        "legacy_skills": [
            "Visual Basic 6.0 Maintenance", "Flash ActionScript 2.0",
            "Windows Server 2003 Administration", "Manual Waterfall Documentation Only",
            "FTP Deployment Only", "Legacy Monolithic Perl Scripting"
        ],
        "companies": ["Infosys Emerging Tech", "Wipro Cloud", "Persistent Systems", "TCS Digital", "LTI Mindtree", "Zoho Corporation", "HCL Tech"]
    },
    "Green Energy & Power": {
        "roles": [
            "Solar BESS Integration Specialist", "Smart Grid SCADA Technician",
            "Rooftop Solar EPC Supervisor", "Green Hydrogen Plant Operator",
            "Wind Turbine Pitch Tech", "Thermal Coal Boiler Hand (Obsolete)"
        ],
        "emerging_skills": [
            "Battery Energy Storage Systems (BESS)", "Solar Photovoltaic Micro-Inverter Setup",
            "Smart Grid SCADA & IoT Telemetry", "Grid-Tied Hybrid Inverter Configuration",
            "Green Hydrogen Electrolyzer Basics", "I-V Curve Tracer Diagnostics"
        ],
        "legacy_skills": [
            "Coal Thermal Boiler Manual Firing", "Analogue Mechanical Energy Meter Calibration",
            "Non-Inverter Diesel Generator Synchronization", "Manual Lead Antimony Cell Charging"
        ],
        "companies": ["Adani Solar & Storage", "Tata Power Renewable", "ReNew Power", "Waaree Energies", "Sterling and Wilson", "Suzlon Energy"]
    },
    "Advanced Manufacturing & Capital Goods": {
        "roles": [
            "Collaborative Robotics (Cobots) Programmer", "5-Axis CNC Master Machinist",
            "Industrial IoT (IIoT) Integration Engineer", "3D Metal Printing Specialist",
            "Manual Drafting Board Draughtsman (Obsolete)", "Conventional Shaper Operator (Legacy)"
        ],
        "emerging_skills": [
            "Collaborative Robotics (Cobots - UR)", "5-Axis Simultaneous CNC Machining",
            "Industrial IoT (IIoT) Sensor Telemetry", "Additive Manufacturing (3D Metal / SLA)",
            "Predictive Vibration Analysis", "Digital Twin Simulation (Siemens/Fanuc)"
        ],
        "legacy_skills": [
            "Manual Drafting Board Orthographic Drawing", "Manual Shaper Machine Slotting",
            "Analogue Vernier Logsheet Only", "Belt-Driven Line Shaft Lathe Maintenance"
        ],
        "companies": ["L&T Heavy Engineering", "Bharat Forge Precision", "Godrej Aerospace", "Titan Engineering & Automation", "Thermax", "Kirloskar Brothers"]
    },
    "Healthcare & Life Sciences": {
        "roles": [
            "Tele-ICU Digital Paramedic", "Point-of-Care Ultrasound Technician",
            "Biomedical Equipment Calibration Engineer", "Digital EHR & Health Informatics Tech",
            "Paper Logbook Triage Assistant (Obsolete)", "Analogue X-Ray Darkroom Tech (Obsolete)"
        ],
        "emerging_skills": [
            "Tele-ICU Digital Telemetry & Remote Vitals", "Point-of-Care Digital Ultrasound",
            "Electronic Health Record (EHR) & ABDM FHIR", "Biomedical Defibrillator Analyzer Protocols",
            "AI-Assisted Diagnostic Triage Support", "Advanced Cardiac Life Support (ACLS)"
        ],
        "legacy_skills": [
            "Paper Register Manual Triage Filing", "Analogue Mercury Manometer Reading Only",
            "Analogue Darkroom Wet Film Processing", "Single-Channel Paper ECG Interpretation"
        ],
        "companies": ["Apollo Hospitals", "Max Healthcare", "Fortis Healthcare", "Medanta Emergency", "Narayana Health", "Manipal Hospitals"]
    },
    "Smart Infrastructure & Construction": {
        "roles": [
            "BIM 3D/4D Modeling Specialist", "Prefab Modular Construction Tech",
            "Smart City IoT Sensor Deployer", "Survey Drone Pilot",
            "Manual Theodolite Surveyor (Legacy)"
        ],
        "emerging_skills": [
            "Building Information Modeling (BIM - Revit)", "Survey Drone Flight & Photogrammetry",
            "Prefab Reinforced Concrete Panel Jointing", "Smart HVAC Building Management (BMS)",
            "Laser Scanning & Point Cloud Processing"
        ],
        "legacy_skills": [
            "Manual Optical Theodolite Logsheet", "Hand-Mixed Mortar Proportions Only",
            "Paper Blueprint Physical Measuring Only"
        ],
        "companies": ["L&T Construction", "Shapoorji Pallonji", "Tata Projects", "Afcons Infrastructure", "DLF Smart Infrastructure"]
    },
    "AgriTech & Automation": {
        "roles": [
            "Agricultural Drone Spraying Pilot", "Precision Hydroponic System Tech",
            "Smart Irrigation IoT Controller", "Automated Post-Harvest Grader Tech"
        ],
        "emerging_skills": [
            "DGCA Certified Agri-Drone Operation", "Hydroponic Nutrient Film Technique (NFT)",
            "Soil Moisture Telemetry & LoRaWAN Sensors", "Solar-Powered Smart Drip Automation"
        ],
        "legacy_skills": [
            "Manual Flood Irrigation Leveling", "Manual Hand-Pump Chemical Spraying Only",
            "Analogue Visual Soil Moisture Guesswork"
        ],
        "companies": ["DeHaat", "Ninjacart AgriTech", "Mahindra Agri Automation", "IoTechWorld Drones", "Barrix Agro"]
    }
}


def generate_10k_labour_signals(num_records=10500):
    """Generates 10,000+ realistic real-time job posting signals."""
    print(f"[Dataset Generator] Generating {num_records} labour market signal records...")
    records = []
    
    start_date = datetime.now() - timedelta(days=90)
    
    for i in range(num_records):
        dist_info = random.choice(DISTRICTS_DATA)
        district = dist_info["district"]
        state = dist_info["state"]
        
        # 65% chance of picking district primary sector, 35% another sector
        if random.random() < 0.65:
            sector = dist_info["primary_sector"]
        else:
            sector = random.choice(SECTORS)
            
        sector_info = SECTOR_SKILLS_ONTOLOGY[sector]
        role = random.choice(sector_info["roles"])
        company = random.choice(sector_info["companies"])
        
        is_obsolete = "(Obsolete)" in role or "(Legacy)" in role
        
        # Select 2 to 4 skills
        if is_obsolete:
            skills = random.sample(sector_info["legacy_skills"], min(len(sector_info["legacy_skills"]), random.randint(2, 3)))
            salary_lpa = round(random.uniform(2.2, 3.8), 2)
            hiring_volume = random.randint(1, 10)
            urgency = "Low"
            nsqf_level = random.randint(3, 4)
            growth_trend_pct = round(random.uniform(-18.0, -2.5), 1)
        else:
            sample_k = min(len(sector_info["emerging_skills"]), random.randint(2, 4))
            skills = random.sample(sector_info["emerging_skills"], sample_k)
            # Maybe add one foundational skill
            if random.random() < 0.4:
                skills.append("Safety Compliance & Standard Operating Procedures")
                
            salary_lpa = round(random.uniform(4.0, 16.5), 2)
            hiring_volume = random.randint(5, 120)
            urgency = random.choice(["Critical", "High", "High", "Normal"])
            nsqf_level = random.randint(4, 7)
            growth_trend_pct = round(dist_info["growth_rate"] + random.uniform(-2.5, 4.0), 1)

        posted_date = start_date + timedelta(days=random.randint(0, 90))
        
        records.append({
            "signal_id": f"SIG_{i+1:06d}",
            "job_title": role,
            "company": company,
            "sector": sector,
            "location_district": district,
            "state": state,
            "required_skills": "; ".join(skills),
            "primary_skill": skills[0],
            "skills_count": len(skills),
            "nsqf_proficiency_level": nsqf_level,
            "hiring_volume": hiring_volume,
            "avg_salary_lpa": salary_lpa,
            "urgency": urgency,
            "growth_trend_pct": growth_trend_pct,
            "is_obsolete_role": 1 if is_obsolete else 0,
            "data_source": random.choice(["LinkedIn", "Naukri", "Government_NCS_Portal", "Employer_Direct_Feed"]),
            "posted_date": posted_date.strftime("%Y-%m-%d")
        })

    df = pd.DataFrame(records)
    out_csv = os.path.join(DATASET_DIR, "labour_market_signals_10k.csv")
    df.to_csv(out_csv, index=False)
    # Also save to ml_service/data/
    df.to_csv(os.path.join(ML_DATA_DIR, "labour_market_signals_10k.csv"), index=False)
    print(f"[Dataset Generator] Successfully generated {len(df)} records -> {out_csv}")
    return df


def generate_curriculum_drift_dataset(num_records=2500):
    """Generates 2,500 curriculum modules mapped to obsolescence risk ground truth."""
    print(f"[Dataset Generator] Generating {num_records} curriculum modules with drift ground truth...")
    modules = []
    
    for i in range(num_records):
        sector = random.choice(SECTORS)
        sector_info = SECTOR_SKILLS_ONTOLOGY[sector]
        
        # 30% obsolete, 70% aligned/emerging
        is_obsolete = 1 if random.random() < 0.30 else 0
        
        if is_obsolete:
            term = random.choice(sector_info["legacy_skills"])
            desc = f"Traditional practical instructions and manual procedures for {term} using historical equipment."
            relevance_score = round(random.uniform(25.0, 54.0), 1)
            drift_risk = "Critical" if relevance_score < 45 else "Moderate"
            hours = random.choice([30, 40, 50, 60])
        else:
            term = random.choice(sector_info["emerging_skills"])
            desc = f"Hands-on diagnostic verification, safety compliance and digital configuration of {term} with modern test rigs."
            relevance_score = round(random.uniform(78.0, 96.5), 1)
            drift_risk = "Low"
            hours = random.choice([40, 45, 55, 70])
            
        modules.append({
            "module_id": f"MOD_{i+1:05d}",
            "sector": sector,
            "module_name": term,
            "syllabus_description": desc,
            "practical_hours": hours,
            "is_obsolete": is_obsolete,
            "ground_truth_relevance_score": relevance_score,
            "drift_risk_category": drift_risk,
            "target_nsqf_level": random.randint(4, 6)
        })

    df = pd.DataFrame(modules)
    out_csv = os.path.join(DATASET_DIR, "curriculum_drift_training.csv")
    df.to_csv(out_csv, index=False)
    df.to_csv(os.path.join(ML_DATA_DIR, "curriculum_drift_training.csv"), index=False)
    print(f"[Dataset Generator] Successfully generated {len(df)} curriculum records -> {out_csv}")
    return df


def generate_placement_records(num_records=5000):
    """Generates 5,000 candidate placement outcomes for training the readiness classifier."""
    print(f"[Dataset Generator] Generating {num_records} candidate placement outcomes...")
    placements = []
    
    for i in range(num_records):
        dist_info = random.choice(DISTRICTS_DATA)
        sector = random.choice(SECTORS)
        sector_info = SECTOR_SKILLS_ONTOLOGY[sector]
        
        # Skill count and alignment
        aligned = 1 if random.random() < 0.72 else 0
        if aligned:
            matched_skills_count = random.randint(3, 5)
            missing_skills_count = random.randint(0, 1)
            placement_success = 1 if random.random() < 0.90 else 0
            salary = round(random.uniform(4.5, 12.0), 2) if placement_success else 0.0
            time_to_placement_days = random.randint(15, 60) if placement_success else 180
        else:
            matched_skills_count = random.randint(1, 2)
            missing_skills_count = random.randint(2, 4)
            placement_success = 1 if random.random() < 0.38 else 0
            salary = round(random.uniform(2.5, 4.0), 2) if placement_success else 0.0
            time_to_placement_days = random.randint(90, 210) if placement_success else 240
            
        placements.append({
            "candidate_id": f"CAND_{i+1:05d}",
            "sector": sector,
            "district": dist_info["district"],
            "state": dist_info["state"],
            "matched_skills_count": matched_skills_count,
            "missing_skills_count": missing_skills_count,
            "curriculum_aligned_flag": aligned,
            "practical_training_hours": random.choice([160, 240, 320, 480]),
            "nsqf_level": random.randint(4, 6),
            "placed_successfully": placement_success,
            "salary_lpa": salary,
            "time_to_placement_days": time_to_placement_days
        })

    df = pd.DataFrame(placements)
    out_csv = os.path.join(DATASET_DIR, "candidate_placement_outcomes.csv")
    df.to_csv(out_csv, index=False)
    df.to_csv(os.path.join(ML_DATA_DIR, "candidate_placement_outcomes.csv"), index=False)
    print(f"[Dataset Generator] Successfully generated {len(df)} placement records -> {out_csv}")
    return df


if __name__ == "__main__":
    signals_df = generate_10k_labour_signals(num_records=10500)
    drift_df = generate_curriculum_drift_dataset(num_records=2500)
    placements_df = generate_placement_records(num_records=5000)
    
    total = len(signals_df) + len(drift_df) + len(placements_df)
    print(f"\n==========================================")
    print(f">> TOTAL DATASET SIZE: {total:,} RECORDS")
    print(f" - Labour Market Signals: {len(signals_df):,} records")
    print(f" - Curriculum Drift Training: {len(drift_df):,} records")
    print(f" - Candidate Placement Outcomes: {len(placements_df):,} records")
    print(f"==========================================\n")
