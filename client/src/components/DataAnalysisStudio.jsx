import React, { useState, useEffect } from 'react';
import {
  BarChart3, Filter, Download, Search, RefreshCw, Sliders, TrendingUp,
  AlertTriangle, CheckCircle, Database, MapPin, Briefcase, DollarSign,
  ChevronRight, ArrowUpDown, Sparkles, PieChart, Layers
} from 'lucide-react';

export default function DataAnalysisStudio() {
  // Query Filters State
  const [sector, setSector] = useState('all');
  const [district, setDistrict] = useState('all');
  const [roleType, setRoleType] = useState('all'); // all, emerging, obsolete
  const [nsqfLevel, setNsqfLevel] = useState('all');
  const [search, setSearch] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [page, setPage] = useState(1);

  // Active Analysis Sub-Tab
  const [analysisTab, setAnalysisTab] = useState('matrix'); // matrix, districts, skills, simulator, explorer

  // Data State
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState(null);
  const [visualizations, setVisualizations] = useState(null);
  const [records, setRecords] = useState([]);
  const [pagination, setPagination] = useState({ totalRecords: 0, totalPages: 1, currentPage: 1 });

  // Policy Simulator State
  const [simDistrict, setSimDistrict] = useState('Pune');
  const [simSector, setSimSector] = useState('Automotive & Mobility');
  const [simHorizon, setSimHorizon] = useState(3);
  const [simInvestment, setSimInvestment] = useState(450);
  const [simIntake, setSimIntake] = useState(1200);
  const [simTrainers, setSimTrainers] = useState(12);
  const [simModernized, setSimModernized] = useState(true);
  const [simResult, setSimResult] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Fetch Data from Analysis Endpoint
  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (sector !== 'all') params.append('sector', sector);
      if (district !== 'all') params.append('district', district);
      if (roleType !== 'all') params.append('roleType', roleType);
      if (nsqfLevel !== 'all') params.append('nsqfLevel', nsqfLevel);
      if (search.trim()) params.append('search', search.trim());
      if (minSalary) params.append('minSalary', minSalary);
      if (maxSalary) params.append('maxSalary', maxSalary);
      params.append('page', page);
      params.append('limit', 15);

      const res = await fetch(`/api/analytics/query?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setKpis(data.kpis);
        setVisualizations(data.visualizations);
        setRecords(data.records || []);
        setPagination(data.pagination || { totalRecords: 0, totalPages: 1, currentPage: 1 });
      }
    } catch (err) {
      console.error('[DataAnalysisStudio Fetch Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, [sector, district, roleType, nsqfLevel, minSalary, maxSalary, page]);

  // Run What-If Policy Simulation
  const runSimulation = async () => {
    try {
      setSimLoading(true);
      const res = await fetch('/api/analytics/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: simDistrict,
          sector: simSector,
          targetHorizonYears: simHorizon,
          investmentCrores: simInvestment,
          currentIntakeCapacity: simIntake,
          newTrainerRecruits: simTrainers,
          curriculumModernized: simModernized
        })
      });
      const data = await res.json();
      if (data.success && data.simulation) {
        setSimResult(data.simulation);
      }
    } catch (err) {
      console.error('[Simulator Error]:', err);
    } finally {
      setSimLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [simDistrict, simSector, simHorizon, simInvestment, simIntake, simTrainers, simModernized]);

  // Export CSV Handler
  const handleExportCSV = () => {
    if (!records || records.length === 0) return;
    const headers = ['SignalID', 'JobTitle', 'Company', 'Sector', 'District', 'State', 'SalaryLPA', 'HiringVolume', 'NSQFLevel', 'IsObsolete'];
    const rows = records.map(r => [
      r.signalId || '',
      `"${r.jobTitle || ''}"`,
      `"${r.company || ''}"`,
      `"${r.sector || ''}"`,
      `"${r.locationDistrict || ''}"`,
      `"${r.state || ''}"`,
      r.avgSalaryLPA || 0,
      r.hiringVolume || 0,
      r.nsqfProficiencyLevel || 4,
      r.isObsoleteRole ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SkillPulse_Labour_Analysis_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Summary
  const handleExportJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      filtersApplied: { sector, district, roleType, nsqfLevel, minSalary, maxSalary, search },
      kpis,
      visualizations,
      sampleRecordsCount: records.length,
      sampleRecords: records
    };
    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonStr);
    link.setAttribute('download', `SkillPulse_Analysis_Report_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSector('all');
    setDistrict('all');
    setRoleType('all');
    setNsqfLevel('all');
    setSearch('');
    setMinSalary('');
    setMaxSalary('');
    setPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid var(--primary-light)',
        padding: '24px 28px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <BarChart3 size={22} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                Labour-Market Data Analytics & Policy Studio
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6, maxWidth: 800 }}>
              Interactive multi-dimensional query and statistical analytics over <strong>10,500+ labour market signals</strong>, 
              evaluating demand volume, wage trajectories, emerging skills, and district-level workforce balance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleExportCSV}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
              title="Download Filtered CSV"
            >
              <Download size={14} /> Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
              title="Download Full JSON Analysis"
            >
              <Database size={14} /> Export JSON
            </button>
            <button
              onClick={fetchAnalysisData}
              className="btn btn-primary"
              style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} /> Refresh Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Parameter Precision Filter Bar */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <Filter size={18} color="var(--primary)" />
            <span>Interactive Multi-Dimensional Query Filters</span>
          </div>
          <button
            onClick={resetFilters}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Reset All Filters
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14
        }}>
          {/* Sector Filter */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Focus Sector
            </label>
            <select
              value={sector}
              onChange={e => { setSector(e.target.value); setPage(1); }}
              className="input-field"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="all">All Sectors (7 Sectors)</option>
              <option value="Automotive & Mobility">Automotive & Mobility</option>
              <option value="Information Technology & Electronics">IT & Electronics</option>
              <option value="Green Energy & Power">Green Energy & Power</option>
              <option value="Advanced Manufacturing & Capital Goods">Advanced Manufacturing</option>
              <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
              <option value="Smart Infrastructure & Construction">Smart Infrastructure</option>
              <option value="AgriTech & Automation">AgriTech & Automation</option>
            </select>
          </div>

          {/* District Filter */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Location / District
            </label>
            <select
              value={district}
              onChange={e => { setDistrict(e.target.value); setPage(1); }}
              className="input-field"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="all">All Districts (Pan-India)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
              <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
              <option value="Chennai">Chennai (Tamil Nadu)</option>
              <option value="Hyderabad">Hyderabad (Telangana)</option>
              <option value="Gurgaon">Gurgaon (Haryana)</option>
              <option value="Noida">Noida (Uttar Pradesh)</option>
              <option value="Coimbatore">Coimbatore (Tamil Nadu)</option>
              <option value="Surat">Surat (Gujarat)</option>
              <option value="Jaipur">Jaipur (Rajasthan)</option>
              <option value="Indore">Indore (Madhya Pradesh)</option>
              <option value="Visakhapatnam">Visakhapatnam (Andhra Pradesh)</option>
              <option value="Vadodara">Vadodara (Gujarat)</option>
              <option value="Mysuru">Mysuru (Karnataka)</option>
              <option value="Nashik">Nashik (Maharashtra)</option>
              <option value="Kochi">Kochi (Kerala)</option>
            </select>
          </div>

          {/* Role Status (Emerging vs Obsolete) */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Competency Horizon
            </label>
            <select
              value={roleType}
              onChange={e => { setRoleType(e.target.value); setPage(1); }}
              className="input-field"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="all">All Roles (Emerging & Obsolete)</option>
              <option value="emerging">🚀 Emerging High-Growth Roles Only</option>
              <option value="obsolete">⚠️ Flagged Obsolete / Legacy Roles Only</option>
            </select>
          </div>

          {/* NSQF Level Filter */}
          <div>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              NSQF Proficiency
            </label>
            <select
              value={nsqfLevel}
              onChange={e => { setNsqfLevel(e.target.value); setPage(1); }}
              className="input-field"
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="all">All NSQF Levels</option>
              <option value="3">NSQF Level 3 (Basic Trades)</option>
              <option value="4">NSQF Level 4 (Technician)</option>
              <option value="5">NSQF Level 5 (Senior Specialist)</option>
              <option value="6">NSQF Level 6 (Lead Engineer)</option>
              <option value="7">NSQF Level 7 (Master Specialist)</option>
            </select>
          </div>

          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
              Keyword Search
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: 10, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Role, skill, company..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                onKeyDown={e => e.key === 'Enter' && fetchAnalysisData()}
                className="input-field"
                style={{ width: '100%', paddingLeft: 32, fontSize: '0.85rem' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real-time KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16
      }}>
        {/* KPI 1 */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Matching Signals</span>
            <Database size={18} color="var(--primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
            {kpis ? kpis.totalRecords?.toLocaleString() : '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Out of 10,509 total dataset records
          </div>
        </div>

        {/* KPI 2 */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Hiring Demand Volume</span>
            <Briefcase size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
            {kpis ? kpis.totalHiringVolume?.toLocaleString() : '...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: 600, marginTop: 4 }}>
            Aggregated Industrial Vacancies
          </div>
        </div>

        {/* KPI 3 */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Annual Wage</span>
            <DollarSign size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 8 }}>
            ₹ {kpis ? kpis.avgSalary : '0'} <span style={{ fontSize: '1rem', fontWeight: 600 }}>LPA</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, marginTop: 4 }}>
            Industrial Benchmark Salary
          </div>
        </div>

        {/* KPI 4 */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Obsolescence Risk</span>
            <AlertTriangle size={18} color={kpis?.obsoletePct > 20 ? '#ef4444' : '#10b981'} />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: kpis?.obsoletePct > 20 ? '#ef4444' : '#10b981', marginTop: 8 }}>
            {kpis ? kpis.obsoletePct : 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            {kpis ? kpis.obsoleteCount?.toLocaleString() : 0} legacy roles flagged
          </div>
        </div>

        {/* KPI 5 */}
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Average Growth Rate</span>
            <TrendingUp size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: 8 }}>
            +{kpis ? kpis.avgGrowthTrend : 0}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Year-over-Year Regional Demand
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Analysis Studio */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid var(--card-border)',
        paddingBottom: 8,
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setAnalysisTab('matrix')}
          className={`btn ${analysisTab === 'matrix' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Layers size={14} /> Sector Demand Matrix
        </button>
        <button
          onClick={() => setAnalysisTab('districts')}
          className={`btn ${analysisTab === 'districts' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <MapPin size={14} /> District Deficit Ranking
        </button>
        <button
          onClick={() => setAnalysisTab('skills')}
          className={`btn ${analysisTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Sparkles size={14} /> Top In-Demand Competencies
        </button>
        <button
          onClick={() => setAnalysisTab('simulator')}
          className={`btn ${analysisTab === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Sliders size={14} /> Policy & Investment Simulator
        </button>
        <button
          onClick={() => setAnalysisTab('explorer')}
          className={`btn ${analysisTab === 'explorer' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '0.82rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Database size={14} /> Raw Signals Explorer ({pagination.totalRecords})
        </button>
      </div>

      {/* SUB-VIEW 1: SECTOR DEMAND MATRIX */}
      {analysisTab === 'matrix' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {visualizations?.sectorBreakdown?.map((s, idx) => (
            <div key={idx} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {s.sector}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {s.count.toLocaleString()} Posting Signals Ingested
                  </span>
                </div>
                <span className={`badge ${s.obsoleteRatio > 25 ? 'badge-amber' : 'badge-emerald'}`}>
                  {s.obsoleteRatio}% Obsolete Ratio
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                background: 'var(--card-inner-bg)',
                padding: 12,
                borderRadius: 10
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Hiring Volume</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    {s.hiringDemand.toLocaleString()}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Average Salary</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>
                    ₹ {s.avgSalary || 6.2} LPA
                  </div>
                </div>
              </div>

              {/* Visual demand bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Demand Share Index</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    {Math.round((s.hiringDemand / (kpis?.totalHiringVolume || 1)) * 100)}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--card-border)', borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(Math.round((s.hiringDemand / (kpis?.totalHiringVolume || 1)) * 100), 100)}%`,
                    background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                    borderRadius: 9999
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-VIEW 2: DISTRICT DEFICIT RANKING */}
      {analysisTab === 'districts' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                District-Level Labour Demand & Absorption Ranking
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sorted by aggregate vacancies across 16 industrial districts
              </p>
            </div>
            <span className="badge badge-indigo">Geo-Spatial Analysis</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--card-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 16px' }}>Rank</th>
                  <th style={{ padding: '12px 16px' }}>District Location</th>
                  <th style={{ padding: '12px 16px' }}>State</th>
                  <th style={{ padding: '12px 16px' }}>Aggregated Vacancies</th>
                  <th style={{ padding: '12px 16px' }}>Signal Records</th>
                  <th style={{ padding: '12px 16px' }}>Average Benchmark Wage</th>
                  <th style={{ padding: '12px 16px' }}>Demand Density</th>
                </tr>
              </thead>
              <tbody>
                {visualizations?.districtBreakdown?.map((d, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                      #{index + 1}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {d.district}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {d.state}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>
                      {d.totalVacancies?.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {d.recordCount} signals
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#10b981' }}>
                      ₹ {d.avgSalary || 6.4} LPA
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--card-border)', borderRadius: 9999, minWidth: 60 }}>
                          <div style={{
                            height: '100%',
                            width: `${Math.min(Math.round((d.totalVacancies / 25000) * 100), 100)}%`,
                            background: '#4f46e5',
                            borderRadius: 9999
                          }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {Math.min(Math.round((d.totalVacancies / 25000) * 100), 100)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: TOP SKILLS */}
      {analysisTab === 'skills' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Top 10 High-Frequency Industry Competencies
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Identified directly from active job postings in the current filtered dataset
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {visualizations?.topSkills?.map((skill, idx) => {
              const maxFreq = visualizations?.topSkills[0]?.frequency || 1;
              const pct = Math.round((skill.frequency / maxFreq) * 100);

              return (
                <div key={idx} style={{
                  padding: 14,
                  background: 'var(--card-inner-bg)',
                  borderRadius: 12,
                  border: '1px solid var(--card-border)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: 'var(--primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {idx + 1}
                      </span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {skill.skill}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="badge badge-indigo">
                        {skill.frequency} Mentions
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10b981' }}>
                        {skill.hiringDemand?.toLocaleString()} Associated Vacancies
                      </span>
                    </div>
                  </div>

                  <div style={{ height: 6, background: 'var(--card-border)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
                      borderRadius: 9999
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: POLICY & INVESTMENT WHAT-IF SIMULATOR */}
      {analysisTab === 'simulator' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
          {/* Controls Panel */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Sliders size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Policy Simulation Parameters
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Target District
                </label>
                <select
                  value={simDistrict}
                  onChange={e => setSimDistrict(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Pune">Pune (Maharashtra)</option>
                  <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
                  <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
                  <option value="Chennai">Chennai (Tamil Nadu)</option>
                  <option value="Hyderabad">Hyderabad (Telangana)</option>
                  <option value="Gurgaon">Gurgaon (Haryana)</option>
                  <option value="Surat">Surat (Gujarat)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>
                  Target Industrial Sector
                </label>
                <select
                  value={simSector}
                  onChange={e => setSimSector(e.target.value)}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Automotive & Mobility">Automotive & Mobility (EV)</option>
                  <option value="Information Technology & Electronics">IT & Cloud Microservices</option>
                  <option value="Green Energy & Power">Green Energy & Solar BESS</option>
                  <option value="Advanced Manufacturing & Capital Goods">Advanced Manufacturing & Cobots</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Tele-ICU</option>
                </select>
              </div>

              {/* Investment Crores Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Planned Industrial Investment:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>₹ {simInvestment} Crores</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={simInvestment}
                  onChange={e => setSimInvestment(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Annual Intake Seats */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Current Annual Vocational Intake:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{simIntake} Trainees/Yr</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={simIntake}
                  onChange={e => setSimIntake(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* New Trainer Recruits */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>New Master Trainer Sanction:</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>+{simTrainers} Trainers</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="2"
                  value={simTrainers}
                  onChange={e => setSimTrainers(parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Horizon Years */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Forecast Horizon:</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{simHorizon} Years</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3].map(yr => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setSimHorizon(yr)}
                      className={`btn ${simHorizon === yr ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ flex: 1, padding: '6px 0', fontSize: '0.8rem' }}
                    >
                      {yr} Year{yr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curriculum Modernization Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'var(--card-inner-bg)',
                borderRadius: 10,
                border: '1px solid var(--card-border)'
              }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Infuse Emerging Skills (USP 1)
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Align syllabus to live market signals
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={simModernized}
                  onChange={e => setSimModernized(e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Simulated Workforce Projections
                </h3>
              </div>
              <span className={`badge ${simResult?.projections?.netWorkforceGap > 200 ? 'badge-amber' : 'badge-emerald'}`}>
                {simResult?.projections?.marketStatus || 'Projecting...'}
              </span>
            </div>

            {simLoading ? (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                Running econometric simulation engine...
              </div>
            ) : simResult?.projections && (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12
                }}>
                  <div style={{ padding: 14, background: 'var(--card-inner-bg)', borderRadius: 10 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Projected Horizon Vacancies</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                      {simResult.projections.projectedVacanciesHorizon?.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ padding: 14, background: 'var(--card-inner-bg)', borderRadius: 10 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Expanded Annual Seat Capacity</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#06b6d4' }}>
                      {simResult.projections.projectedAnnualIntakeCapacity?.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ padding: 14, background: 'var(--card-inner-bg)', borderRadius: 10 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Net Supply Mismatch Gap</span>
                    <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: simResult.projections.netWorkforceGap > 0 ? '#ef4444' : '#10b981'
                    }}>
                      {simResult.projections.netWorkforceGap > 0 ? `+${simResult.projections.netWorkforceGap.toLocaleString()}` : simResult.projections.netWorkforceGap.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ padding: 14, background: 'var(--card-inner-bg)', borderRadius: 10 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Placement Rate</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                      {simResult.projections.estimatedPlacementRatePct}%
                    </div>
                  </div>
                </div>

                <div style={{ padding: 16, background: 'rgba(79, 70, 229, 0.05)', borderRadius: 12, border: '1px solid rgba(79, 70, 229, 0.15)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                    GOVERNMENT / SSDM ACTION RECOMMENDATION:
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    {simResult.projections.policyRecommendation}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>Recommended Modern Lab Budget:</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                    ₹ {simResult.projections.estimatedEquipmentBudgetLakhs} Lakhs
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span>Projected Average Graduate Wage:</span>
                  <strong style={{ color: '#10b981', fontSize: '0.95rem' }}>
                    ₹ {simResult.projections.estimatedAverageStartingSalaryLPA} LPA
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: RAW SIGNALS EXPLORER */}
      {analysisTab === 'explorer' && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Granular Signals Explorer (10,500+ Dataset Records)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalRecords} total matching signals)
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Next
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--card-border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px' }}>Signal ID</th>
                  <th style={{ padding: '10px 12px' }}>Role / Job Title</th>
                  <th style={{ padding: '10px 12px' }}>Employer Company</th>
                  <th style={{ padding: '10px 12px' }}>Sector</th>
                  <th style={{ padding: '10px 12px' }}>District</th>
                  <th style={{ padding: '10px 12px' }}>Required Skills</th>
                  <th style={{ padding: '10px 12px' }}>Salary</th>
                  <th style={{ padding: '10px 12px' }}>Volume</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map(rec => (
                  <tr key={rec._id || rec.signalId} style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                      {rec.signalId || 'SIG_0000'}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {rec.jobTitle}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                      {rec.company}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span className="badge badge-slate" style={{ fontSize: '0.7rem' }}>
                        {rec.sector}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-main)' }}>
                      {rec.locationDistrict}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)', maxWidth: 260 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {rec.requiredSkills?.slice(0, 2).map((sk, i) => (
                          <span key={i} className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                            {sk}
                          </span>
                        ))}
                        {rec.requiredSkills?.length > 2 && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                            +{rec.requiredSkills.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: '#10b981' }}>
                      ₹{rec.avgSalaryLPA} LPA
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--primary)' }}>
                      {rec.hiringVolume}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {rec.isObsoleteRole ? (
                        <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>⚠️ Obsolete</span>
                      ) : (
                        <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>🚀 Emerging</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                disabled={page <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(prev => prev + 1)}
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
