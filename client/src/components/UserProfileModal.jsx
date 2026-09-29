import React, { useState, useEffect } from 'react';
import { X, User, Building, MapPin, Briefcase, Mail, Shield, Users, Check, RefreshCw } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, currentUser, onUpdateUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    district: '',
    sector: '',
    designation: '',
    role: ''
  });
  const [directoryUsers, setDirectoryUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        organization: currentUser.organization || '',
        district: currentUser.district || '',
        sector: currentUser.sector || '',
        designation: currentUser.designation || '',
        role: currentUser.role || 'officer'
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (isOpen && activeTab === 'directory') {
      fetchDirectory();
    }
  }, [isOpen, activeTab]);

  const fetchDirectory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        setDirectoryUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const token = localStorage.getItem('skillpulse_token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('skillpulse_user', JSON.stringify(data.user));
        onUpdateUser(data.user);
        setMsg('Profile details saved successfully!');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'officer': return <span className="badge badge-indigo">🏛️ District Officer</span>;
      case 'trainer': return <span className="badge badge-emerald">🎓 Master Faculty</span>;
      case 'employer': return <span className="badge badge-cyan">🏢 Industry Employer</span>;
      case 'candidate': return <span className="badge badge-amber">👨‍🎓 Trainee / Candidate</span>;
      default: return <span className="badge badge-slate">Platform User</span>;
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
        maxWidth: 620,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow-xl)',
        padding: '28px 24px',
        position: 'relative'
      }}>
        {/* Close Button */}
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

        {/* Header with Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
          }}>
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {currentUser.name}
              </h2>
              {getRoleBadge(currentUser.role)}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {currentUser.email} • {currentUser.organization}
            </p>
          </div>
        </div>

        {/* Tab switch: Profile Edit vs Team Directory */}
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
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'profile' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'profile' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            My Stakeholder Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            style={{
              flex: 1,
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === 'directory' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'directory' ? '#fff' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Stakeholder Directory (Common Endpoint)
          </button>
        </div>

        {msg && (
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
            <Check size={16} />
            <span>{msg}</span>
          </div>
        )}

        {activeTab === 'profile' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                style={{ width: '100%' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  Designation / Title
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="input-field"
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  Stakeholder Role
                </label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="officer">🏛️ District Officer</option>
                  <option value="trainer">🎓 Master Trainer</option>
                  <option value="employer">🏢 Industry Employer</option>
                  <option value="candidate">👨‍🎓 Trainee / Candidate</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                Organization / Institution
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={e => setFormData({ ...formData, organization: e.target.value })}
                className="input-field"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  District Location
                </label>
                <select
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Noida">Noida</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Surat">Surat</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
                  Focus Industrial Sector
                </label>
                <select
                  value={formData.sector}
                  onChange={e => setFormData({ ...formData, sector: e.target.value })}
                  className="input-field"
                  style={{ width: '100%' }}
                >
                  <option value="Automotive & Mobility">Automotive & Mobility</option>
                  <option value="Information Technology & Electronics">IT & Electronics</option>
                  <option value="Green Energy & Power">Green Energy & Power</option>
                  <option value="Advanced Manufacturing & Capital Goods">Advanced Manufacturing</option>
                  <option value="Healthcare & Life Sciences">Healthcare & Life Sciences</option>
                  <option value="Smart Infrastructure & Construction">Smart Infrastructure</option>
                  <option value="AgriTech & Automation">AgriTech & Automation</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px 18px' }}
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ padding: '10px 18px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                Sign Out
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12
            }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Registered Platform Stakeholders ({directoryUsers.length} Active):
              </p>
              <button
                onClick={fetchDirectory}
                className="btn btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
              {directoryUsers.map(u => (
                <div
                  key={u._id}
                  style={{
                    padding: 12,
                    background: 'var(--card-inner-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1rem'
                    }}>
                      {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {u.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {u.designation || u.organization} • {u.district}
                      </div>
                    </div>
                  </div>
                  <div>
                    {getRoleBadge(u.role)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
