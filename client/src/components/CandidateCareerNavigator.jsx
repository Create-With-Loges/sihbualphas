import React, { useState } from 'react';
import { 
  Compass, UserCheck, TrendingUp, DollarSign, Award, 
  ArrowRight, CheckCircle2, AlertCircle, Briefcase, MapPin, Sparkles
} from 'lucide-react';

export default function CandidateCareerNavigator({ onPredictPathway }) {
  const [candidateName, setCandidateName] = useState('Rahul Deshmukh');
  const [courseTitle, setCourseTitle] = useState('Automotive Technician (Mechanic Motor Vehicle)');
  const [targetRole, setTargetRole] = useState('EV Diagnostic Specialist');
  const [targetDistrict, setTargetDistrict] = useState('Pune');
  const [skillsAcquired, setSkillsAcquired] = useState('Chassis Alignment, Conventional Braking, Basic Auto Electrical');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        candidateName,
        courseTitle,
        skillsAcquired: skillsAcquired.split(',').map(s => s.trim()).filter(Boolean),
        targetRole,
        sector: 'Automotive & Mobility',
        targetDistrict
      };
      const res = await onPredictPathway(payload);
      if (res?.data) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-cyan">Evidence-Based Candidate Guidance</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Career Pathway & Placement Prediction Engine (Random Forest Model)</span>
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Trainee Career Pathway Navigator & Placement Readiness Predictor
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
          Enables vocational students and trainees to map their completed qualifications against emerging high-wage industrial roles, predict placement odds, and bridge missing competencies.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: 24, alignItems: 'start' }}>
        {/* Input Form Card */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Compass size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>Candidate Profile</h3>
          </div>

          <form onSubmit={handlePredict} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Candidate / Trainee Name
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Current / Completed Course
              </label>
              <select
                value={courseTitle}
                onChange={e => setCourseTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Automotive Technician (Mechanic Motor Vehicle)">Automotive Technician (MMV-401)</option>
                <option value="Cloud-Native & Applied AI Software Engineering">Cloud-Native & Applied AI (IT-DEV-502)</option>
                <option value="Solar Photovoltaic & Smart Grid Technician">Solar PV & Smart Grid (GREEN-SOL-303)</option>
                <option value="CNC Machinist & Industrial Robotics Operator">CNC Machinist & Robotics (MFG-CNC-404)</option>
                <option value="Emergency Medical & Digital Health Technician">Emergency Medical Tech (HLTH-EMT-405)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Target Aspirational Role
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                <option value="EV Diagnostic Specialist">EV Diagnostic Specialist (Auto/EV)</option>
                <option value="Full-Stack Cloud & AI Engineer">Full-Stack Cloud & AI Engineer (IT)</option>
                <option value="Solar Grid Integration Technician">Solar Grid Integration Tech (Green Energy)</option>
                <option value="Cobot & CNC Automation Specialist">Cobot & CNC Automation Specialist (Manufacturing)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Target Industrial District
              </label>
              <select
                value={targetDistrict}
                onChange={e => setTargetDistrict(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Pune">Pune (Auto/EV Hub)</option>
                <option value="Bengaluru Urban">Bengaluru (Tech/Cloud Hub)</option>
                <option value="Ahmedabad">Ahmedabad (Solar/Energy Hub)</option>
                <option value="Coimbatore">Coimbatore (Machining & Robotics Hub)</option>
                <option value="Gurgaon">Gurgaon (NCR Industrial Hub)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Skills Acquired So Far (comma separated)
              </label>
              <textarea
                rows="3"
                value={skillsAcquired}
                onChange={e => setSkillsAcquired(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ marginTop: 8 }}
            >
              <Sparkles size={16} />
              {loading ? 'Evaluating Readiness...' : 'Predict Career Readiness'}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {result ? (
            <>
              {/* Score & Benchmark Header */}
              <div className="glass-panel" style={{
                padding: 24,
                background: 'linear-gradient(135deg, var(--accent-indigo-bg), var(--accent-cyan-bg))',
                border: '1px solid var(--accent-indigo-border)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-indigo">{result.prediction.target_role}</span>
                      <span className="badge badge-cyan">{result.prediction.target_district}</span>
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
                      {result.prediction.candidate_name}'s Career Evaluation
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '2.4rem',
                      fontWeight: 900,
                      color: result.prediction.placement_readiness_pct > 70 ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                      lineHeight: 1
                    }}>
                      {result.prediction.placement_readiness_pct}%
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Placement Readiness Odds
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--card-border)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarSign size={18} color="var(--accent-emerald)" />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Salary Benchmark:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{result.prediction.expected_salary_benchmark}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Briefcase size={18} color="var(--accent-cyan)" />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Local Vacancies:</span>
                      <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>{result.prediction.local_employer_hiring_count}+ Openings</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills Analysis: Matched vs Missing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Matched */}
                <div className="glass-panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>Matched Verified Skills</h4>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.prediction.matched_skills || []).map((sk, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: 'var(--accent-emerald-bg)',
                        color: 'var(--accent-emerald-text)',
                        border: '1px solid var(--accent-emerald-border)'
                      }}>
                        ✓ {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="glass-panel" style={{ padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AlertCircle size={16} color="var(--accent-rose)" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-rose)' }}>Missing High-Impact Skills</h4>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {(result.prediction.missing_critical_skills || []).map((sk, idx) => (
                      <span key={idx} style={{
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: 'var(--accent-rose-bg)',
                        color: 'var(--accent-rose-text)',
                        border: '1px solid var(--accent-rose-border)'
                      }}>
                        ✕ {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Bridge Micro-Credentials */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <Award size={18} color="var(--accent-amber)" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Targeted Bridge Courses to Reach 95%+ Employability
                  </h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(result.prediction.recommended_bridge_courses || []).map((course, cIdx) => (
                    <div key={cIdx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'var(--card-inner-bg)',
                      borderRadius: 8,
                      border: '1px solid var(--card-border)',
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{course}</span>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>Fast-Track Certificate</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local District Hiring Opportunities */}
              {(result.matchingJobs && result.matchingJobs.length > 0) && (
                <div className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Briefcase size={18} color="var(--accent-cyan)" />
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        Active Employers Hiring in {result.prediction.target_district}
                      </h4>
                    </div>
                    <span className="badge badge-low">Verified Openings</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
                    {result.matchingJobs.map((job, jIdx) => (
                      <div key={jIdx} style={{
                        padding: '12px 14px',
                        background: 'var(--card-inner-bg)',
                        borderRadius: 8,
                        border: '1px solid var(--card-border)'
                      }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.85rem' }}>{job.jobTitle}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: 2, fontWeight: 600 }}>{job.company}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <span>Vacancies: <strong>{job.hiringVolume}</strong></span>
                          <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>₹ {job.avgSalaryLPA} LPA</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="glass-panel" style={{
              textAlign: 'center',
              padding: '60px 20px',
              border: '1px dashed var(--card-border)'
            }}>
              <Compass size={44} color="var(--accent-cyan)" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Explore Your Career Trajectory & Bridge Skills
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: 440, margin: '8px auto 0' }}>
                Fill in your completed course, target role, and district on the left to calculate your placement readiness score and discover high-paying opportunities.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
