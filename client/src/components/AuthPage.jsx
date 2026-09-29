import React, { useState } from 'react';
import {
  Lock, Mail, User, Building, MapPin, Briefcase, CheckCircle2,
  AlertCircle, ArrowRight, ShieldCheck, BookOpen, Map, Users, Sun, Moon
} from 'lucide-react';

export default function AuthPage({ onAuthSuccess, theme, onToggleTheme }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'officer',
    organization: 'District Skill Development Cell',
    district: 'Pune',
    sector: 'Automotive & Mobility',
    designation: 'Skill Planning Officer'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleQuickLogin = async (demoEmail) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: 'Password123!' })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('skillpulse_token', data.token);
      localStorage.setItem('skillpulse_user', JSON.stringify(data.user));
      setSuccessMsg(`Welcome, ${data.user.name}`);
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('skillpulse_token', data.token);
      localStorage.setItem('skillpulse_user', JSON.stringify(data.user));
      setSuccessMsg(isLogin ? `Welcome back, ${data.user.name}` : 'Account registered successfully');

      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-main)',
      color: 'var(--text-main)'
    }}>
      {/* Top minimal bar */}
      <header style={{
        borderBottom: '1px solid var(--card-border)',
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--card-bg)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36,
            height: 36,
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
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              SkillPulse
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
              Labour Market Intelligence & Curriculum Alignment Platform
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={onToggleTheme}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
            <span>{theme === 'light' ? 'Dark' : 'Light'} Mode</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{
        flex: 1,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
        padding: '40px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: 48,
        alignItems: 'center'
      }}>
        {/* Left Side: Clean Platform Overview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <span className="badge badge-indigo" style={{ marginBottom: 12, display: 'inline-block' }}>
              Ministry of Skill Development & Entrepreneurship / SSDM Alignment
            </span>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.25, color: 'var(--text-main)' }}>
              Evidence-based alignment of vocational training with industrial demand.
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6 }}>
              A unified platform translating job posting signals, employer surveys, and regional economic trends
              into updated course design, trainer development, and capacity planning.
            </p>
          </div>

          {/* 3 Core Functions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              display: 'flex',
              gap: 14,
              padding: 16,
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 12
            }}>
              <div style={{ color: 'var(--primary)', marginTop: 2 }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Curriculum Gap Analysis
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  Compares course syllabi against emerging industry skills using semantic text analysis to flag obsolete units and recommend modern modules.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: 14,
              padding: 16,
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 12
            }}>
              <div style={{ color: '#06b6d4', marginTop: 2 }}>
                <Map size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  District Capacity Planning
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  Tracks local hiring demand vs. annual training seat capacity across 16 industrial districts to prevent oversupply or skill shortages.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: 14,
              padding: 16,
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 12
            }}>
              <div style={{ color: '#10b981', marginTop: 2 }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Employer Validation & Placement Pathways
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                  Enables industry partners to validate course modules and maps candidate competency profiles to realistic job roles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Secure Login / Register Box */}
        <div className="card" style={{
          padding: 32,
          boxShadow: 'var(--shadow-lg)',
          borderRadius: 16
        }}>
          {/* Form Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--card-inner-bg)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 20,
            border: '1px solid var(--card-border)'
          }}>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: isLogin ? 'var(--primary)' : 'transparent',
                color: isLogin ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: !isLogin ? 'var(--primary)' : 'transparent',
                color: !isLogin ? '#fff' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              Register
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 8,
              color: '#ef4444',
              fontSize: '0.82rem',
              marginBottom: 16
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 8,
              color: '#10b981',
              fontSize: '0.82rem',
              marginBottom: 16
            }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Role Login for Evaluators */}
          {isLogin && (
            <div style={{
              marginBottom: 20,
              padding: 14,
              background: 'var(--card-inner-bg)',
              borderRadius: 10,
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>
                TEST ACCOUNTS (1-CLICK ACCESS):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('officer@skillpulse.gov.in')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start' }}
                >
                  🏛️ District Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('trainer@skillpulse.edu.in')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start' }}
                >
                  🎓 Training Faculty
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('employer@tata.com')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start' }}
                >
                  🏢 Industry Partner
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('candidate@skillpulse.org')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start' }}
                >
                  👨‍🎓 Trainee / Candidate
                </button>
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {!isLogin && (
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. officer@skillpulse.gov.in"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                Password * {!isLogin && '(minimum 8 characters with letter & number)'}
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>

            {!isLogin && (
              <>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                    Stakeholder Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="officer">District Skill Planning Officer</option>
                    <option value="trainer">Master Trainer / ITI Faculty</option>
                    <option value="employer">Industry Employer / Recruiter</option>
                    <option value="candidate">Vocational Trainee / Student</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      placeholder="e.g. SSDM Cell"
                      value={formData.organization}
                      onChange={handleChange}
                      className="input-field"
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                      District
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="input-field"
                      style={{ width: '100%' }}
                    >
                      <option value="Pune">Pune</option>
                      <option value="Bengaluru Urban">Bengaluru Urban</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Chennai">Chennai</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Gurgaon">Gurgaon</option>
                      <option value="Coimbatore">Coimbatore</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '12px',
                fontSize: '0.92rem',
                fontWeight: 700,
                width: '100%',
                marginTop: 6
              }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In to Workspace' : 'Create Account')}
            </button>
          </form>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer style={{
        borderTop: '1px solid var(--card-border)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        background: 'var(--card-bg)'
      }}>
        SkillPulse • Labour-Market Intelligence and Curriculum-Alignment Platform
      </footer>
    </div>
  );
}
