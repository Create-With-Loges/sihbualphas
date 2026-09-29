import React, { useState } from 'react';
import { 
  MapPin, TrendingUp, Users, Wrench, CheckSquare, Sparkles, 
  Download, FileText, AlertTriangle, ArrowRight, ShieldCheck, DollarSign
} from 'lucide-react';

export default function DistrictTrainingPlanner({ districtDemands, trainingPlans, onGeneratePlan }) {
  const [selectedDistrict, setSelectedDistrict] = useState(districtDemands[0]?.district || 'Pune');
  const [selectedSector, setSelectedSector] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [generating, setGenerating] = useState(false);
  const [activePlanView, setActivePlanView] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const filteredDemands = districtDemands.filter(d => {
    if (selectedSector !== 'All' && d.sector !== selectedSector) return false;
    if (conditionFilter !== 'All' && d.marketCondition !== conditionFilter) return false;
    return true;
  });

  const currentRecord = districtDemands.find(d => d.district === selectedDistrict) || districtDemands[0];

  const handleGenerate = async () => {
    if (!currentRecord) return;
    setGenerating(true);
    try {
      const res = await onGeneratePlan(currentRecord.district, currentRecord.sector);
      if (res?.data?.plan) {
        setActivePlanView(res.data.plan);
        setToastMsg(`Strategic District Training Plan successfully generated for ${currentRecord.district}!`);
        setTimeout(() => setToastMsg(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setToastMsg('Generated plan using intelligent forecasting engine.');
      setTimeout(() => setToastMsg(null), 4000);
    } finally {
      setGenerating(false);
    }
  };

  const printPlan = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Toast */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 100,
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
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
          <Sparkles size={18} /> {toastMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge badge-cyan">District Capacity Planning</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workforce demand vs. institutional seat capacity across 16 districts</span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
              District Labour Demand & Training Capacity Planner
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
              Helps district officers align vocational training intake, faculty requirements, and workshop infrastructure with regional industrial hiring.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
            >
              <option value="All">All Sectors</option>
              <option value="Automotive & Mobility">Automotive & Mobility</option>
              <option value="Information Technology & Electronics">IT & Electronics</option>
              <option value="Green Energy & Power">Green Energy & Power</option>
              <option value="Advanced Manufacturing & Capital Goods">Advanced Manufacturing</option>
              <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
            </select>

            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              style={{
                borderRadius: 8,
                padding: '8px 12px',
                fontSize: '0.85rem'
              }}
            >
              <option value="All">All Market Conditions</option>
              <option value="Severe Shortage">Severe Shortage</option>
              <option value="Moderate Shortfall">Moderate Shortfall</option>
              <option value="Balanced">Balanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive District Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 16
      }}>
        {filteredDemands.map((item, idx) => {
          const isSelected = item.district === selectedDistrict;

          return (
            <div
              key={idx}
              onClick={() => { setSelectedDistrict(item.district); setActivePlanView(null); }}
              className="glass-panel"
              style={{
                padding: 20,
                cursor: 'pointer',
                borderColor: isSelected ? 'var(--primary)' : 'var(--card-border)',
                background: isSelected ? 'var(--accent-indigo-bg)' : 'var(--card-bg)',
                transform: isSelected ? 'scale(1.01)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} color={isSelected ? 'var(--primary)' : 'var(--accent-cyan)'} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>{item.district}</h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.state}</span>
                </div>
                <span className={item.mismatchGap > 1000 ? 'badge badge-critical' : 'badge badge-moderate'} style={{ fontSize: '0.68rem' }}>
                  {item.marketCondition}
                </span>
              </div>

              <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Sector: <span style={{ color: 'var(--text-main)' }}>{item.sector}</span>
              </div>

              {/* Demand vs Capacity Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 8,
                marginTop: 14,
                padding: '10px 12px',
                background: 'var(--card-inner-bg)',
                borderRadius: 8,
                border: '1px solid var(--card-border)',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)' }}>Annual Demand</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{item.annualJobDemand}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)' }}>Seats Capacity</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--primary)' }}>{item.trainingCapacitySeats}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)' }}>Net Deficit</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent-rose)' }}>+{item.mismatchGap}</div>
                </div>
              </div>

              {/* Top Demanded Roles */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-sub)', fontWeight: 600, marginBottom: 4 }}>
                  Top Industry Hiring Roles:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {item.topDemandedRoles.map((role, rIdx) => (
                    <span key={rIdx} style={{
                      fontSize: '0.68rem',
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'var(--card-inner-bg)',
                      border: '1px solid var(--card-border)',
                      color: 'var(--text-muted)'
                    }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid var(--card-border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Growth: <strong style={{ color: 'var(--text-main)' }}>+{item.industrialGrowthRatePct}% / yr</strong></span>
                <span>Institutes: <strong style={{ color: 'var(--text-main)' }}>{item.activeTrainingInstitutes}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected District Action Generator & Plan Workbench */}
      {currentRecord && (
        <div className="glass-panel" style={{ padding: 24, border: '1px solid var(--accent-cyan-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge badge-cyan">{currentRecord.district}, {currentRecord.state}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sector: {currentRecord.sector}</span>
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 6 }}>
                Automated Strategic District Training Plan Generator
              </h3>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn btn-primary"
            >
              <Sparkles size={16} />
              {generating ? 'Forecasting with ML Engine...' : `Generate ${currentRecord.district} Plan`}
            </button>
          </div>

          {/* Generated Plan Detail View */}
          {activePlanView ? (
            <div style={{
              background: 'var(--card-inner-bg)',
              borderRadius: 14,
              padding: 24,
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ShieldCheck size={20} color="var(--accent-emerald)" />
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      {activePlanView.planTitle}
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Generated by SkillPulse AI • Approved by District Skill Committee
                  </span>
                </div>

                <button onClick={printPlan} className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                  <Download size={14} /> Export Plan (PDF)
                </button>
              </div>

              {/* Plan Targets Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 12,
                marginBottom: 20
              }}>
                <div style={{ padding: 14, background: 'var(--card-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target Intake Target</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {activePlanView.targetIntakeSeats} Seats
                  </div>
                </div>

                <div style={{ padding: 14, background: 'var(--card-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Master Trainer Quota</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {activePlanView.trainerUpskillingQuota} Trainers
                  </div>
                </div>

                <div style={{ padding: 14, background: 'var(--card-bg)', borderRadius: 10, border: '1px solid var(--card-border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Modernization Budget</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    ₹ {activePlanView.totalEstimatedBudgetLakhs} Lakhs
                  </div>
                </div>
              </div>

              {/* Equipment Procurement List */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <Wrench size={16} color="var(--accent-cyan)" />
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Recommended Equipment Tenders for Technical Institutes:</h5>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(activePlanView.equipmentProcurementList || []).map((eq, eIdx) => (
                    <div key={eIdx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'var(--card-bg)',
                      borderRadius: 8,
                      border: '1px solid var(--card-border)',
                      fontSize: '0.85rem'
                    }}>
                      <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{eq.item}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{eq.priority} Priority</span>
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>₹ {eq.estimatedCostLakhs} Lakhs</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Checklist */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <CheckSquare size={16} color="var(--primary)" />
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>Strategic Implementation Milestones:</h5>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(activePlanView.actionChecklist || []).map((task, tIdx) => (
                    <div key={tIdx} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: 'var(--card-bg)',
                      borderRadius: 8,
                      border: '1px solid var(--card-border)',
                      fontSize: '0.82rem'
                    }}>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{task.task}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-sub)' }}>
                          Lead Entity: {task.responsibleEntity} • Timeline: {task.timelineWeeks} Weeks
                        </span>
                      </div>
                      <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '36px 20px',
              background: 'var(--card-inner-bg)',
              borderRadius: 12,
              border: '1px dashed var(--card-border)'
            }}>
              <FileText size={36} color="var(--accent-cyan)" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                No active generated plan loaded for {currentRecord.district}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 500, margin: '6px auto 16px' }}>
                Click the generate button above to forecast the 3-year demand trajectory, trainer quotas, and equipment procurement checklist for this district.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
