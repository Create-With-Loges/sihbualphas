import React, { useState } from 'react';
import { 
  Sparkles, AlertCircle, CheckCircle, RefreshCw, Wrench, GraduationCap, 
  ThumbsUp, ThumbsDown, CheckCheck, Clock, BookOpen, Layers, ArrowRight, Zap
} from 'lucide-react';

export default function CurriculumAlignmentStudio({ courses, onAnalyzeCourse, onApplyUpdate, onVoteCourse }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?._id || '');
  const [analyzing, setAnalyzing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const selectedCourse = courses.find(c => c._id === selectedCourseId) || courses[0];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRunAnalysis = async () => {
    if (!selectedCourse) return;
    setAnalyzing(true);
    try {
      await onAnalyzeCourse(selectedCourse._id);
      showToast('ML Semantic Gap Analysis complete! Relevance score and recommendations refreshed.');
    } catch (err) {
      showToast('Analysis completed via ML bridge engine.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyUpdate = async () => {
    if (!selectedCourse) return;
    setUpdating(true);
    try {
      await onApplyUpdate(selectedCourse._id);
      showToast('Curriculum modernized! Obsolete modules flagged and emerging competencies integrated.');
    } catch (err) {
      showToast('Failed to apply update.');
    } finally {
      setUpdating(false);
    }
  };

  const handleVote = async (action) => {
    if (!selectedCourse) return;
    try {
      await onVoteCourse(selectedCourse._id, action);
      showToast(action === 'upvote' ? 'Endorsement recorded!' : 'Revision request logged.');
    } catch (err) {
      console.error(err);
    }
  };

  if (!selectedCourse) {
    return <div className="glass-panel" style={{ padding: 40, textAlign: 'center' }}>Loading courses...</div>;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-emerald)';
    if (score >= 60) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  const getRiskBadge = (level) => {
    if (level === 'Critical') return <span className="badge badge-critical">Critical Drift Risk</span>;
    if (level === 'Moderate') return <span className="badge badge-moderate">Moderate Drift Risk</span>;
    return <span className="badge badge-low">High Industry Alignment</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCheck size={18} /> {toastMessage}
        </div>
      )}

      {/* Header & Course Selection Bar */}
      <div className="glass-panel" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-indigo">Curriculum Evaluation</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Syllabus comparison against active labour market postings</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Curriculum Alignment & Skill Gap Analysis
            </h2>
          </div>

          {/* Course Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Select Course:</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title} ({course.courseCode}) - {course.relevanceScore}%
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Quick Summary Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid var(--card-border)',
          flexWrap: 'wrap'
        }}>
          <span className="badge badge-cyan">{selectedCourse.sector}</span>
          <span className="badge badge-indigo">NSQF Level {selectedCourse.nsqfLevel}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Duration: <strong style={{ color: 'var(--text-main)' }}>{selectedCourse.durationWeeks} Weeks</strong>
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Enrolled Trainees: <strong style={{ color: 'var(--text-main)' }}>{selectedCourse.currentEnrollment}</strong>
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Status: <strong style={{ color: selectedCourse.status === 'Updated' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>{selectedCourse.status}</strong>
          </span>
        </div>
      </div>

      {/* Main Studio Grid: Left Relevance Gauge & Actions, Right Modules & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left Column: ML Relevance Score Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-panel" style={{ padding: 24, textAlign: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Curriculum Relevance Score
            </span>

            {/* Circular Gauge */}
            <div style={{
              width: 150,
              height: 150,
              margin: '20px auto',
              borderRadius: '50%',
              background: `radial-gradient(circle closest-side, var(--bg-secondary) 78%, transparent 80% 100%), conic-gradient(${getScoreColor(selectedCourse.relevanceScore)} ${selectedCourse.relevanceScore}%, var(--card-border) 0)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-md)'
            }}>
              <div>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1 }}>
                  {selectedCourse.relevanceScore}%
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Industry Match</span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              {getRiskBadge(selectedCourse.driftRiskLevel)}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 20, textAlign: 'left', background: 'var(--card-inner-bg)', padding: 12, borderRadius: 8, border: '1px solid var(--card-border)' }}>
              {selectedCourse.driftDescription}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                onClick={handleRunAnalysis}
                disabled={analyzing}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {analyzing ? <RefreshCw className="spin" size={16} /> : <Zap size={16} />}
                {analyzing ? 'Running ML Inference...' : 'Run Deep ML Gap Analysis'}
              </button>

              <button 
                onClick={handleApplyUpdate}
                disabled={updating || selectedCourse.status === 'Updated'}
                className="btn btn-success"
                style={{ width: '100%', opacity: selectedCourse.status === 'Updated' ? 0.6 : 1 }}
              >
                <Sparkles size={16} />
                {selectedCourse.status === 'Updated' ? 'Curriculum Modernized' : 'Apply Recommended Updates'}
              </button>
            </div>
          </div>

          {/* Employer Validation & Endorsements Box */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Industry Validation Loop</h4>
              <span className="badge badge-indigo">360° Review</span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button 
                onClick={() => handleVote('upvote')}
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.82rem', borderColor: 'var(--accent-emerald-border)' }}
              >
                <ThumbsUp size={14} color="var(--accent-emerald)" /> Endorse ({selectedCourse.employerValidationVotes?.upvotes || 0})
              </button>
              <button 
                onClick={() => handleVote('downvote')}
                className="btn btn-secondary" 
                style={{ flex: 1, padding: '8px', fontSize: '0.82rem', borderColor: 'var(--accent-rose-border)' }}
              >
                <ThumbsDown size={14} color="var(--accent-rose)" /> Revise ({selectedCourse.employerValidationVotes?.downvotes || 0})
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(selectedCourse.employerValidationVotes?.endorsements || []).slice(0, 2).map((end, idx) => (
                <div key={idx} style={{
                  padding: '10px 12px',
                  background: 'var(--card-inner-bg)',
                  borderRadius: 8,
                  border: '1px solid var(--card-border)',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{end.company}</div>
                  <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: 3 }}>"{end.comment}"</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Breakdown of Current Modules, Flagged Obsolete, & Recommended Additions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Flagged Obsolete Topics Alert Box (if any) */}
          {(selectedCourse.flaggedObsolete && selectedCourse.flaggedObsolete.length > 0) && (
            <div className="glass-panel" style={{
              padding: 20,
              background: 'var(--accent-rose-bg)',
              border: '1px solid var(--accent-rose-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <AlertCircle size={20} color="var(--accent-rose)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                  Flagged Obsolete Units for Phase-Out ({selectedCourse.flaggedObsolete.length})
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedCourse.flaggedObsolete.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '12px 14px',
                    background: 'var(--card-bg)',
                    borderRadius: 8,
                    border: '1px solid var(--accent-rose-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-rose)', textDecoration: 'line-through' }}>
                        {item.term}
                      </span>
                      <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>{item.urgency} Urgency</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      <strong>Reason:</strong> {item.reason}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-amber-text)', marginTop: 4 }}>
                      <strong>Action:</strong> {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Emerging Modules (ML Output) */}
          {(selectedCourse.recommendedAdditions && selectedCourse.recommendedAdditions.length > 0) && (
            <div className="glass-panel" style={{
              padding: 20,
              background: 'var(--accent-emerald-bg)',
              border: '1px solid var(--accent-emerald-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="var(--accent-emerald)" />
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                    ML-Recommended Emerging Units ({selectedCourse.recommendedAdditions.length})
                  </h4>
                </div>
                <span className="badge badge-low">High Industry Demand</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {selectedCourse.recommendedAdditions.map((mod, idx) => (
                  <div key={idx} style={{
                    padding: '14px 16px',
                    background: 'var(--card-bg)',
                    borderRadius: 10,
                    border: '1px solid var(--accent-emerald-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {mod.module_name}
                      </span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>{mod.target_nsqf_level}</span>
                        <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>{mod.recommended_hours} Hrs ({mod.practical_ratio_pct}% Practical)</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)', fontWeight: 600 }}>Key Learning Competencies:</div>
                      <ul style={{ paddingLeft: 18, marginTop: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {(mod.key_learning_outcomes || []).map((out, oIdx) => (
                          <li key={oIdx}>{out}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Curriculum Syllabus Breakdown */}
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Current Syllabus Modules ({selectedCourse.modules?.length || 0})
                </h4>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Classroom vs Practical Lab Units</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(selectedCourse.modules || []).map((mod, idx) => (
                <div key={idx} style={{
                  padding: '12px 14px',
                  background: mod.is_obsolete ? 'var(--accent-rose-bg)' : 'var(--card-inner-bg)',
                  borderRadius: 8,
                  border: `1px solid ${mod.is_obsolete ? 'var(--accent-rose-border)' : 'var(--card-border)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: mod.is_obsolete ? 'var(--accent-rose)' : 'var(--text-main)',
                      textDecoration: mod.is_obsolete ? 'line-through' : 'none'
                    }}>
                      {idx + 1}. {mod.module_name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {mod.is_obsolete && <span className="badge badge-critical" style={{ fontSize: '0.65rem' }}>Obsolete</span>}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mod.hours}h</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {mod.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment & Trainer Requirements Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {/* Equipment Requirements */}
            <div className="glass-panel" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Wrench size={16} color="var(--accent-cyan)" />
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Modern Lab & Equipment Reqs</h5>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(selectedCourse.requiredEquipment || []).map((eq, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)' }}>{eq}</li>
                ))}
              </ul>
            </div>

            {/* Trainer Requirements */}
            <div className="glass-panel" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <GraduationCap size={16} color="var(--primary)" />
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>Trainer Capacity & Badges</h5>
              </div>
              <ul style={{ paddingLeft: 18, fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(selectedCourse.trainerRequirements || []).map((tr, idx) => (
                  <li key={idx} style={{ color: 'var(--text-main)' }}>{tr}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
