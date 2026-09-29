import React from 'react';
import { Cpu, Activity, RefreshCw, Sun, Moon, LogIn, LogOut, User } from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  mlStatus,
  onRefresh,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout
}) {
  const tabs = [
    { id: 'overview', label: 'Executive Summary', icon: '📊' },
    { id: 'analytics', label: 'Labour Data Analysis', icon: '📈' },
    { id: 'curriculum', label: 'Curriculum Alignment', icon: '📚' },
    { id: 'district', label: 'District Training Planner', icon: '🗺️' },
    { id: 'employer', label: 'Employer Validation', icon: '🤝' },
    { id: 'candidate', label: 'Candidate Pathways', icon: '🧭' },
    { id: 'ml-studio', label: 'Model Evaluation', icon: '⚙️' }
  ];

  const getRoleLabel = (role) => {
    switch (role) {
      case 'officer': return 'District Officer';
      case 'trainer': return 'Faculty / Trainer';
      case 'employer': return 'Industry Partner';
      case 'candidate': return 'Candidate';
      default: return 'User';
    }
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--card-border)',
      background: 'var(--card-bg)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '12px 24px',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'var(--primary)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1rem'
          }}>
            SP
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                SkillPulse
              </h1>
              <span className="badge badge-slate" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                SSDM Labour Intelligence
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Curriculum Alignment & District Training Capacity Planning
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Status badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            background: 'var(--card-inner-bg)',
            borderRadius: 6,
            border: '1px solid var(--card-border)',
            fontSize: '0.76rem'
          }}>
            <span className="live-indicator"></span>
            <span style={{ color: 'var(--text-muted)' }}>Status:</span>
            <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
              Online
            </span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <button 
            onClick={onRefresh}
            className="btn btn-secondary" 
            style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
            title="Refresh Data"
          >
            <RefreshCw size={13} /> Refresh
          </button>

          {/* User Profile / Auth State */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={onOpenProfile}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '4px 10px 4px 6px',
                  background: 'var(--card-inner-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
                title="View Profile & User Directory"
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {currentUser.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {getRoleLabel(currentUser.role)}
                  </div>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
                title="Sign Out"
              >
                <LogOut size={13} /> Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
            >
              <LogIn size={13} /> Sign In
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        maxWidth: 1400,
        margin: '10px auto 0',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 2
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            style={{ fontSize: '0.84rem' }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
