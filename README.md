# SkillPulse AI ⚡
### Evidence-Based Labour-Market Intelligence & Automated Curriculum-Alignment Platform
**Built for Smart India Hackathon (SIH) | Full-Stack MERN + Python Machine Learning Microservice**

---

## 🌟 Executive Overview & Problem Context
Traditional vocational and technical skill-development programmes often rely on broad, static, or historical occupational classifications. Consequently, course curricula, lab equipment, and trainer development lag behind rapid technological advancements and localized industrial demand. Employers struggle to recruit job-ready candidates, while trainees graduate with outdated competencies.

**SkillPulse AI** creates a continuous, evidence-based data loop translating real-time industry demand into curriculum design, capacity forecasting, trainer development, and candidate guidance.

---

## 🚀 Unique Selling Points (USPs)

### 🧠 USP 1 (ML-Driven): Dynamic Semantic Skill-Drift & Curriculum Obsolescence Engine
- **Pre-Trained Dataset**: Ingests **18,000+ records** (10,500+ labour-market signals, 2,500+ curriculum drift modules, and 5,000+ candidate placement records).
- **Core Algorithm**: TF-IDF n-gram vectorization with cosine similarity against industry sector demand centroids.
- **Automated Outputs**: Computes quantitative **Curriculum Relevance Score (0-100%)**, flags obsolete/deprecated units with displacement rationales, and generates recommended emerging modules mapped to **NSQF proficiency levels** (e.g., EV Battery Management Systems, CAN Bus troubleshooting, Generative AI DevSecOps, Solar BESS).
- **One-Click Modernization**: Instantly prunes obsolete units, appends emerging practical modules, and updates the curriculum status.

### 🗺️ USP 2 (Feature-Driven): Hyper-Localized District Training Planner with 360° Employer Validation Loop
- **Multi-District Capacity Heatmap**: Monitors active job demand vs. training capacity seats across 16+ key industrial hubs (Pune, Bengaluru, Ahmedabad, Coimbatore, Gurgaon, Chennai, Hyderabad, etc.).
- **Random Forest Demand Regressor**: Projects 3-year localized vacancy growth based on industrial capital expenditure and growth rates.
- **Automated Action Plan Generator**: Synthesizes actionable District Training Plans featuring:
  - Exact target seat intake quotas.
  - Master trainer upskilling allocations.
  - Itemized high-priority lab equipment procurement tenders with estimated budgets in Lakhs.
  - Multi-stakeholder implementation milestones (District Skill Committee, SSCs, DIC).
- **Employer Co-Design Workbench**: Industry partners (Tata Motors, Ather, Infosys, Adani Solar, L&T, Apollo) validate proposed curricula, cast verification votes, pledge hiring quotas, and offer plant lab access.

---

## 🎨 Dual Theming Engine (Light Theme as Primary Workflow)
- **Primary Default Workflow**: **Light Theme** engineered with a modern palette (`#f8fafc` canvas, crisp frosted white cards, high-contrast typography, refined indigo/cyan accents).
- **Dark Theme Toggle**: Dedicated Sun ☀️ / Moon 🌙 toggle in the top-right navigation bar with persistent `localStorage` preference and smooth CSS variable transitions.

---

## 🏗️ Technology Stack & Architecture

```
sih_2/
├── client/                     # React.js Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx                      # Brand, Theme Switcher, ML Status
│   │   │   ├── ExecutiveOverview.jsx           # KPIs, Mismatch Analytics, Live Ticker
│   │   │   ├── CurriculumAlignmentStudio.jsx   # USP 1: Gap Analysis & Modernization
│   │   │   ├── DistrictTrainingPlanner.jsx     # USP 2: District Capacity & Plan Generator
│   │   │   ├── EmployerValidationWorkbench.jsx # Employer Consultations & Voting
│   │   │   ├── CandidateCareerNavigator.jsx    # Candidate Guidance & Readiness Predictor
│   │   │   └── MLModelStudio.jsx               # 18k Dataset Telemetry & Model Playground
│   │   ├── App.jsx                             # Root Component & State Coordination
│   │   ├── index.css                           # Dual Light/Dark Design System
│   │   └── main.jsx                            # ReactDOM Mount Point
│   ├── index.html                              # Google Fonts (Inter, Outfit, JetBrains Mono)
│   ├── vite.config.js                          # Reverse Proxy to Express (/api -> :5000)
│   └── package.json
│
├── server/                     # Node.js + Express.js REST API Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                           # MongoDB Mongoose Connection
│   │   ├── models/
│   │   │   ├── Course.js                       # Curricula, Modules, Relevance & Flags
│   │   │   ├── JobSignal.js                    # Live Labour Market Vacancies & Skills
│   │   │   ├── DistrictDemand.js               # District Capacity vs Job Demand Mismatch
│   │   │   ├── TrainingPlan.js                 # Automated District Strategic Action Plans
│   │   │   ├── EmployerSurvey.js               # Employer Reviews & Endorsements
│   │   │   └── PlacementOutcome.js             # Graduate Placements & Wage Tracking
│   │   ├── controllers/
│   │   │   ├── courseController.js             # Gap Analysis & Update Execution
│   │   │   ├── districtController.js           # Demand Query & Plan Generation
│   │   │   ├── jobSignalController.js          # Ingestion & Skill Aggregations
│   │   │   ├── employerController.js           # Survey Submission & Validation Voting
│   │   │   ├── candidateController.js          # Career Pathway Prediction
│   │   │   └── analyticsController.js          # Platform KPIs & Shortage Indices
│   │   ├── services/
│   │   │   └── mlBridge.js                     # HTTP Bridge to FastAPI + Robust Fallback
│   │   ├── routes/                             # Modular REST API Route Handlers
│   │   ├── seed.js                             # Database Seeder with Rich Baseline Data
│   │   └── server.js                           # Express Entry Point (:5000)
│   └── package.json
│
├── ml_service/                 # Python Machine Learning Microservice (FastAPI)
│   ├── data/                   # 18,000+ CSV Datasets
│   │   ├── labour_market_signals_10k.csv       # 10,500+ Job Posting Signals
│   │   ├── curriculum_drift_training.csv       # 2,500+ Syllabus Modules (Drift Ground Truth)
│   │   └── candidate_placement_outcomes.csv    # 5,000+ Empirical Placement Records
│   ├── models/                 # Serialized Pre-Trained ML Artifacts (.joblib)
│   │   ├── tfidf_vectorizer.joblib             # Fitted Vocabulary (1,157 N-Grams)
│   │   ├── sector_centroids.joblib             # Sector-Level Skill Demand Centroids
│   │   ├── demand_forecast_model.joblib        # Random Forest Regressor (100 Trees)
│   │   ├── placement_predictor_model.joblib    # Placement Classifier (ROC-AUC: 0.81)
│   │   └── training_metrics.json               # Model Validation & Evaluation Stats
│   ├── train_models.py                         # Model Training Pipeline Script
│   └── main.py                                 # FastAPI Server (:8000)
│
├── dataset/                    # Root Training Data Directory (18,000+ Records)
├── generate_dataset.py         # Multi-Sector 10,000+ Synthetic Data Synthesizer
└── package.json                # Monorepo Orchestrator (Concurrently Runs All 3 Services)
```

---

## 📊 Core MongoDB Data Models (Mongoose Schemas)

1. **`Course`**: Stores course title, NSQF level, duration, syllabus modules (`module_name`, `hours`, `is_practical`, `is_obsolete`), calculated `relevanceScore`, `driftRiskLevel`, `flaggedObsolete` list, `recommendedAdditions`, `requiredEquipment`, and `employerValidationVotes`.
2. **`JobSignal`**: Ingests job posting signals with `jobTitle`, `company`, `sector`, `locationDistrict`, `state`, `requiredSkills`, `avgSalaryLPA`, and `hiringVolume`.
3. **`DistrictDemand`**: Maps localized demand by `district`, `sector`, `annualJobDemand`, `trainingCapacitySeats`, and `mismatchGap`.
4. **`TrainingPlan`**: Stores generated action plans with `targetIntakeSeats`, `trainerUpskillingQuota`, `equipmentProcurementList`, and multi-week implementation milestones.
5. **`EmployerSurvey`**: Captures industry reviews, endorsed skills, reported obsolete practices, and pledged hiring seats.
6. **`PlacementOutcome`**: Tracks candidate salaries, course alignment verification, and employer satisfaction ratings.

---

## 🔌 API & Machine Learning Integration Protocol

The Node.js Express backend communicates with the Python FastAPI microservice over HTTP REST (`http://127.0.0.1:8000`), mediated by `server/src/services/mlBridge.js`.

| Method | Express Route | Python ML Microservice Endpoint | Purpose |
|---|---|---|---|
| `GET` | `/api/ml/health` | `GET /health` | Validates ML engine status and loaded dataset |
| `GET` | `http://localhost:8000/dataset/metrics` | `GET /dataset/metrics` | Returns 18k dataset distribution and model metrics |
| `POST` | `/api/courses/:id/analyze-gap` | `POST /predict/curriculum-drift` | Computes TF-IDF vector similarity and drift index |
| `POST` | `/api/district-plans/plans/generate` | `POST /predict/district-forecast` | Forecasts 3-year demand via Random Forest regressor |
| `POST` | `/api/candidate/pathway` | `POST /predict/candidate-readiness` | Predicts placement probability & bridge courses |

*Resilience Guarantee*: If the Python service is offline or restarting, `mlBridge.js` automatically executes an embedded mathematical heuristic fallback so the web app maintains 100% uptime.

---

## 🏃 Running the Application

### 1. Prerequisites
- **Node.js**: v18+ (tested on v22.16)
- **Python**: 3.10+ (tested on Python 3.13)
- **MongoDB**: Running locally at `mongodb://127.0.0.1:27017/`

### 2. Quick Start
From the project root directory:

```bash
# 1. Install dependencies across root, server, and client
npm run install-all

# 2. Seed the MongoDB database with initial records
npm run seed

# 3. (Optional) Re-generate 18,000+ dataset & re-train ML models
python generate_dataset.py
cd ml_service && python train_models.py && cd ..

# 4. Start all three microservices concurrently
npm start
```

### 3. Service Ports
- **Frontend Web UI**: `http://localhost:5173/` (Primary Light Theme default, with Dark Mode toggle)
- **Express Backend API**: `http://localhost:5000/`
- **FastAPI ML Engine**: `http://localhost:8000/` (Swagger docs at `/docs`)
