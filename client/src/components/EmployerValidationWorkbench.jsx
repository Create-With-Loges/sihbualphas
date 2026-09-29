import React, { useState } from 'react';
import { 
  Building2, CheckCircle2, MessageSquare, ThumbsUp, Send, 
  Sparkles, ShieldCheck, HelpCircle, Briefcase, PlusCircle
} from 'lucide-react';

export default function EmployerValidationWorkbench({ courses, surveys, onSubmitSurvey }) {
  const [formData, setFormData] = useState({
    companyName: '',
    sector: 'Automotive & Mobility',
    contactPerson: '',
    designation: '',
    district: 'Pune',
    targetCourseCode: courses[0]?.courseCode || 'AUTO-MMV-401',
    curriculumRelevanceRating: 4,
    endorsedEmergingSkills: '',
    reportedObsoleteSkills: '',
    projectedAnnualHiring: 30,
    equipmentAccessOffered: true,
    qualitativeFeedback: '',
    validationVote: 'Endorsed'
  });

  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactPerson) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        endorsedEmergingSkills: formData.endorsedEmergingSkills.split(',').map(s => s.trim()).filter(Boolean),
        reportedObsoleteSkills: formData.reportedObsoleteSkills.split(',').map(s => s.trim()).filter(Boolean)
      };
      await onSubmitSurvey(payload);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
      setFormData({
        companyName: '',
        sector: 'Automotive & Mobility',
        contactPerson: '',
        designation: '',
        district: 'Pune',
        targetCourseCode: courses[0]?.courseCode || 'AUTO-MMV-401',
        curriculumRelevanceRating: 4,
        endorsedEmergingSkills: '',
        reportedObsoleteSkills: '',
        projectedAnnualHiring: 30,
        equipmentAccessOffered: true,
        qualitativeFeedback: '',
        validationVote: 'Endorsed'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100,
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontWeight: 600,
          fontSize: '0.9rem'
        }}>
          <CheckCircle2 size={18} /> Employer validation feedback recorded and integrated into ML weights!
        </div>
      )}

      {/* Header */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span className="badge badge-indigo">Industry-Academia Co-Design Loop</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Evidence-Based Employer Consultations (Integrated with 18k Dataset)</span>
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Employer Validation & Industry Consultation Workbench
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
          Empower industry leaders to validate vocational syllabi, flag obsolete operational methods, endorse emerging tech competencies, and pledge hiring quotas.
        </p>
      </div>

      {/* Two Column Layout: Left Form, Right Active Endorsements Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(360px, 1.1fr) minmax(320px, 0.9fr)', gap: 24, alignItems: 'start' }}>
        {/* Validation Form */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Building2 size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Submit Industry Validation Review
            </h3>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Company / Industry Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Motors / Ather / Infosys"
                  value={formData.companyName}
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Sector *</label>
                <select
                  value={formData.sector}
                  onChange={e => setFormData({ ...formData, sector: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="Automotive & Mobility">Automotive & Mobility</option>
                  <option value="Information Technology & Electronics">IT & Electronics</option>
                  <option value="Green Energy & Power">Green Energy & Power</option>
                  <option value="Advanced Manufacturing & Capital Goods">Advanced Manufacturing</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Contact Person & Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Head of Technical Capability"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Target Course Under Review</label>
                <select
                  value={formData.targetCourseCode}
                  onChange={e => setFormData({ ...formData, targetCourseCode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                >
                  {courses.map(c => (
                    <option key={c.courseCode} value={c.courseCode}>
                      {c.title} ({c.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Validation Vote</label>
                <select
                  value={formData.validationVote}
                  onChange={e => setFormData({ ...formData, validationVote: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                >
                  <option value="Endorsed">✅ Endorse Current / Updated Syllabus</option>
                  <option value="Needs_Revision">⚠️ Needs Urgent Curriculum Revision</option>
                  <option value="Rejected">❌ Unsuitable / Obsolete for Industry</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Endorsed Emerging Skills to Inject (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. EV Battery Management System, CAN Bus, High-Voltage Safety"
                value={formData.endorsedEmergingSkills}
                onChange={e => setFormData({ ...formData, endorsedEmergingSkills: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                Reported Obsolete Topics to Prune (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Carburetor Repair, Mechanical Distributor Tuning"
                value={formData.reportedObsoleteSkills}
                onChange={e => setFormData({ ...formData, reportedObsoleteSkills: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '0.85rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Projected Annual Hiring (Seats)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.projectedAnnualHiring}
                  onChange={e => setFormData({ ...formData, projectedAnnualHiring: parseInt(e.target.value) || 10 })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 22 }}>
                <input
                  type="checkbox"
                  id="equipAccess"
                  checked={formData.equipmentAccessOffered}
                  onChange={e => setFormData({ ...formData, equipmentAccessOffered: e.target.checked })}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <label htmlFor="equipAccess" style={{ fontSize: '0.82rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                  Offer Industry Lab / Plant Access for Practicals
                </label>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Qualitative Comments & Guidance</label>
              <textarea
                rows="3"
                placeholder="Specific recommendations for course curriculum committees and practical equipment..."
                value={formData.qualitativeFeedback}
                onChange={e => setFormData({ ...formData, qualitativeFeedback: e.target.value })}
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
              disabled={submitting}
              className="btn btn-primary"
              style={{ marginTop: 6 }}
            >
              <Send size={16} />
              {submitting ? 'Submitting Validation...' : 'Submit Official Employer Validation'}
            </button>
          </form>
        </div>

        {/* Existing Consultations Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-panel" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={18} color="var(--accent-emerald)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Active Employer Endorsements ({surveys.length})
                </h4>
              </div>
              <span className="badge badge-low">Verified SSC Partners</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {surveys.map((survey, sIdx) => (
                <div key={sIdx} style={{
                  padding: '14px 16px',
                  background: 'var(--card-inner-bg)',
                  borderRadius: 10,
                  border: '1px solid var(--card-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--primary)' }}>
                        {survey.companyName}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {survey.contactPerson} • {survey.designation} ({survey.district})
                      </div>
                    </div>
                    <span className={survey.validationVote === 'Endorsed' ? 'badge badge-low' : 'badge badge-moderate'} style={{ fontSize: '0.68rem' }}>
                      {survey.validationVote}
                    </span>
                  </div>

                  <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    "{survey.qualitativeFeedback}"
                  </div>

                  {survey.endorsedEmergingSkills?.length > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-sub)', fontWeight: 600 }}>Endorsed Skills: </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
                        {survey.endorsedEmergingSkills.map((sk, kIdx) => (
                          <span key={kIdx} style={{
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'var(--accent-emerald-bg)',
                            color: 'var(--accent-emerald-text)',
                            border: '1px solid var(--accent-emerald-border)'
                          }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid var(--card-border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Pledged Hiring: <strong style={{ color: 'var(--text-main)' }}>{survey.projectedAnnualHiring} seats</strong></span>
                    <span>Lab Access: <strong style={{ color: survey.equipmentAccessOffered ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{survey.equipmentAccessOffered ? 'Granted' : 'None'}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
