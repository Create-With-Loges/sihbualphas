import React, { useState } from 'react';
import { X, Lock, Mail, User, Building, MapPin, Briefcase, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'officer',
    organization: 'State Skill Development Mission',
    district: 'Pune',
    sector: 'Automotive & Mobility',
    designation: 'District Skill Planning Officer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleQuickDemoLogin = async (demoEmail) => {
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
        throw new Error(data.message || 'Demo login failed');
      }

      localStorage.setItem('skillpulse_token', data.token);
      localStorage.setItem('skillpulse_user', JSON.stringify(data.user));
      setSuccessMsg(`Welcome, ${data.user.name}!`);
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 700);
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
      setSuccessMsg(isLogin ? `Welcome back, ${data.user.name}!` : 'Account created successfully!');
      
      setTimeout(() => {
        onAuthSuccess(data.user, data.token);
        onClose();
      }, 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 540,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        padding: '28px 24px',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 4
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
          }}>
            <Lock size={22} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {isLogin ? 'Sign In to SkillPulse' : 'Create Stakeholder Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
            Evidence-Based Labour Market Intelligence & Curriculum Alignment Platform
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--card-inner-bg)',
          borderRadius: 12,
          padding: 4,
          marginBottom: 20,
          border: '1px solid var(--card-border)'
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: isLogin ? 'var(--primary)' : 'transparent',
              color: isLogin ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: !isLogin ? 'var(--primary)' : 'transparent',
              color: !isLogin ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Register Account
          </button>
        </div>

        {/* Error / Success alerts */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 14px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 10,
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
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 10,
            color: '#10b981',
            fontSize: '0.82rem',
            marginBottom: 16
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1-Click Quick Demo Login Shortcuts */}
        {isLogin && (
          <div style={{
            background: 'var(--card-inner-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: 12,
            padding: 14,
            marginBottom: 20
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10 }}>
              <Sparkles size={14} color="#f59e0b" />
              <span>1-CLICK DEMO EVALUATION LOGINS:</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('officer@skillpulse.gov.in')}
                className="btn btn-secondary"
                style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                🏛️ <strong>District Officer</strong>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('trainer@skillpulse.edu.in')}
                className="btn btn-secondary"
                style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                🎓 <strong>Master Trainer</strong>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('employer@tata.com')}
                className="btn btn-secondary"
                style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                🏢 <strong>Industry Partner</strong>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('candidate@skillpulse.org')}
                className="btn btn-secondary"
                style={{ padding: '8px 10px', fontSize: '0.78rem', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                👨‍🎓 <strong>Candidate</strong>
              </button>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isLogin && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%', paddingLeft: 36 }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                required
                placeholder="e.g. officer@skillpulse.gov.in"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', paddingLeft: 36 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              Password * {isLogin ? '' : '(min. 6 characters)'}
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                style={{ width: '100%', paddingLeft: 36 }}
              />
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  Platform Stakeholder Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="officer">🏛️ District Skill Development Officer / Administrator</option>
                  <option value="trainer">🎓 Master Trainer / ITI Faculty / Curriculum Designer</option>
                  <option value="employer">🏢 Industry Partner / Recruiter / Enterprise</option>
                  <option value="candidate">👨‍🎓 Vocational Trainee / Student</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                    Organization / Entity
                  </label>
                  <input
                    type="text"
                    name="organization"
                    placeholder="e.g. SSDM Maharashtra"
                    value={formData.organization}
                    onChange={handleChange}
                    className="input-field"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                    District Location
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="input-field"
                    style={{ width: '100%' }}
                  >
                    <option value="Pune">Pune (Maharashtra)</option>
                    <option value="Bengaluru Urban">Bengaluru Urban (Karnataka)</option>
                    <option value="Ahmedabad">Ahmedabad (Gujarat)</option>
                    <option value="Chennai">Chennai (Tamil Nadu)</option>
                    <option value="Hyderabad">Hyderabad (Telangana)</option>
                    <option value="Gurgaon">Gurgaon (Haryana)</option>
                    <option value="Noida">Noida (Uttar Pradesh)</option>
                    <option value="Coimbatore">Coimbatore (Tamil Nadu)</option>
                    <option value="Surat">Surat (Gujarat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  Focus Industrial Sector
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Automotive & Mobility">Automotive & Mobility (EV, Connected)</option>
                  <option value="Information Technology & Electronics">Information Technology & Electronics (AI, Cloud)</option>
                  <option value="Green Energy & Power">Green Energy & Power (Solar, BESS, Hydrogen)</option>
                  <option value="Advanced Manufacturing & Capital Goods">Advanced Manufacturing & Capital Goods (Robotics, CNC)</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences (Digital Health, EHR)</option>
                  <option value="Smart Infrastructure & Construction">Smart Infrastructure & Construction (BIM, IoT)</option>
                  <option value="AgriTech & Automation">AgriTech & Automation (Drones, Hydroponics)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '12px 20px',
              fontSize: '0.95rem',
              fontWeight: 700,
              width: '100%',
              marginTop: 8
            }}
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In to Workspace' : 'Complete Registration')}
          </button>
        </form>
      </div>
    </div>
  );
}
