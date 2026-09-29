import React from 'react';
import { 
  TrendingUp, AlertTriangle, CheckCircle2, Briefcase, 
  DollarSign, ArrowUpRight, ShieldAlert, Building2, MapPin
} from 'lucide-react';

export default function ExecutiveOverview({ overviewData, jobSignals, onSelectCourseTab, onSelectDistrictTab }) {
  const kpis = overviewData?.kpis || {
    totalCoursesTracked: 5,
    criticalDriftCount: 1,
    modernizedCoursesCount: 2,
    activeJobSignalsCount: 10509,
    averageGraduatePlacementLPA: 5.2,
    overallPlacementRatePct: 82.7
  };

  const sectorStats = overviewData?.sectorStats || [];
  const topShortages = overviewData?.topShortages || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Overview Banner */}
      <div className="card" style={{
        padding: '24px 28px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="badge badge-slate">SSDM Technical Portal</span>
            <span className="badge badge-indigo">10,500+ Signals Analyzed</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            Vocational Curriculum Alignment & Capacity Planning
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, marginTop: 4 }}>
            Integrates real-time job posting signals, employer survey responses, and district-level placement outcomes 
            to help training institutions update syllabi, plan trainer development, and avoid skill mismatches.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onSelectCourseTab} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
            Review Course Gaps <ArrowUpRight size={15} />
          </button>
          <button onClick={onSelectDistrictTab} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
            District Capacity <MapPin size={15} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 14
      }}>
        {/* Total Courses */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Courses Tracked</span>
            <Briefcase size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{kpis.totalCoursesTracked}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={13} /> NSQF Levels 3 to 7
          </div>
        </div>

        {/* Critical Drift Alert */}
        <div className="card" style={{ padding: 18, borderColor: 'var(--accent-rose-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose-text)', fontWeight: 600 }}>Outdated / Flagged</span>
            <ShieldAlert size={16} color="var(--accent-rose)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-rose)' }}>{kpis.criticalDriftCount} Course</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: '0.75rem', color: 'var(--accent-rose-text)' }}>
            <AlertTriangle size={13} /> Syllabus update recommended
          </div>
        </div>

        {/* Placement Rate */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Placement Rate</span>
            <TrendingUp size={16} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>{kpis.overallPlacementRatePct}%</div>
          <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
            Across aligned curricula
          </div>
        </div>

        {/* Avg Graduate Salary */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Starting Wage</span>
            <DollarSign size={16} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>₹ {kpis.averageGraduatePlacementLPA} LPA</div>
          <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Industrial benchmark
          </div>
        </div>

        {/* Active Industry Signals */}
        <div className="card" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Labour Signals</span>
            <Building2 size={16} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>10,509</div>
          <div style={{ marginTop: 4, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            16 districts • 7 sectors
          </div>
        </div>
      </div>

      {/* Sector Mismatch & Skill Deficits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {/* Sectoral Demand vs Training Capacity */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Sectoral Demand vs. Training Capacity</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Annual Job Vacancies compared to Regional Technical Seats</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sectorStats.slice(0, 5).map((item, idx) => {
              const maxVal = Math.max(...sectorStats.map(s => s.totalDemand), 1000);
              const demandPct = Math.round((item.totalDemand / maxVal) * 100);

              return (
                <div key={idx} style={{ padding: '10px 14px', background: 'var(--card-inner-bg)', borderRadius: 8, border: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.86rem', color: 'var(--text-main)' }}>{item._id}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {item.totalDemand?.toLocaleString()} Vacancies
                    </span>
                  </div>

                  <div style={{ height: 6, background: 'var(--card-border)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${demandPct}%`,
                      background: 'var(--primary)',
                      borderRadius: 9999
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Critical Skill Deficits */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Priority Industry Skill Requirements</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Skills with high employer demand and low curricular coverage</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topShortages.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--card-inner-bg)',
                borderRadius: 8,
                border: '1px solid var(--card-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: 'var(--primary)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)' }}>{item.skill}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.sector}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                    Gap: {item.shortageScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Industry Hiring Signals */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Recent Employer Hiring Postings
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From live labour market signals</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12
        }}>
          {jobSignals.slice(0, 4).map((signal, idx) => (
            <div key={idx} style={{
              padding: '12px 14px',
              background: 'var(--card-inner-bg)',
              borderRadius: 8,
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-main)' }}>{signal.jobTitle}</span>
                <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>{signal.locationDistrict}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 2, fontWeight: 600 }}>{signal.company}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Vacancies: <strong>{signal.hiringVolume}</strong></span>
                <span style={{ color: '#10b981', fontWeight: 600 }}>₹ {signal.avgSalaryLPA} LPA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
