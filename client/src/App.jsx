import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import ExecutiveOverview from './components/ExecutiveOverview';
import DataAnalysisStudio from './components/DataAnalysisStudio';
import CurriculumAlignmentStudio from './components/CurriculumAlignmentStudio';
import DistrictTrainingPlanner from './components/DistrictTrainingPlanner';
import EmployerValidationWorkbench from './components/EmployerValidationWorkbench';
import CandidateCareerNavigator from './components/CandidateCareerNavigator';
import MLModelStudio from './components/MLModelStudio';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  // Primary default theme is Light as requested
  const [theme, setTheme] = useState(() => localStorage.getItem('skillpulse_theme') || 'light');
  
  // User Authentication State (If null, AuthPage is shown as 1st page)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('skillpulse_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Platform Data
  const [courses, setCourses] = useState([]);
  const [jobSignals, setJobSignals] = useState([]);
  const [districtDemands, setDistrictDemands] = useState([]);
  const [trainingPlans, setTrainingPlans] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [overviewData, setOverviewData] = useState(null);
  const [mlStatus, setMlStatus] = useState({ connected: false });
  const [loading, setLoading] = useState(true);

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skillpulse_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Sync current user with server on boot if token exists
  useEffect(() => {
    const token = localStorage.getItem('skillpulse_token');
    if (token) {
      fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.success && data.user) {
            setCurrentUser(data.user);
            localStorage.setItem('skillpulse_user', JSON.stringify(data.user));
          } else {
            // Token expired or invalid
            localStorage.removeItem('skillpulse_token');
            localStorage.removeItem('skillpulse_user');
            setCurrentUser(null);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Load all platform data
  const loadData = async () => {
    try {
      setLoading(true);
      const [
        overviewRes,
        coursesRes,
        jobsRes,
        demandsRes,
        plansRes,
        surveysRes,
        mlRes
      ] = await Promise.all([
        fetch('/api/analytics/overview').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/courses').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/job-signals').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/district-plans/demands').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/district-plans/plans').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/employer/surveys').then(r => r.json()).catch(() => ({ success: false })),
        fetch('/api/ml/health').then(r => r.json()).catch(() => ({ success: false, connected: false }))
      ]);

      if (overviewRes.success) setOverviewData(overviewRes.data);
      if (coursesRes.success) setCourses(coursesRes.data);
      if (jobsRes.success) setJobSignals(jobsRes.data);
      if (demandsRes.success) setDistrictDemands(demandsRes.data);
      if (plansRes.success) setTrainingPlans(plansRes.data);
      if (surveysRes.success) setSurveys(surveysRes.data);
      setMlStatus(mlRes);
    } catch (err) {
      console.error('[Error fetching platform data]:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Course Gap Analysis action
  const handleAnalyzeCourse = async (courseId) => {
    const res = await fetch(`/api/courses/${courseId}/analyze-gap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success && data.data?.course) {
      setCourses(prev => prev.map(c => c._id === courseId ? data.data.course : c));
      fetch('/api/analytics/overview').then(r => r.json()).then(o => o.success && setOverviewData(o.data));
    }
    return data;
  };

  // Apply recommended curriculum update
  const handleApplyUpdate = async (courseId) => {
    const res = await fetch(`/api/courses/${courseId}/apply-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success && data.data) {
      setCourses(prev => prev.map(c => c._id === courseId ? data.data : c));
      fetch('/api/analytics/overview').then(r => r.json()).then(o => o.success && setOverviewData(o.data));
    }
    return data;
  };

  // Vote / Endorse course
  const handleVoteCourse = async (courseId, action) => {
    const res = await fetch(`/api/courses/${courseId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    const data = await res.json();
    if (data.success && data.data) {
      setCourses(prev => prev.map(c => c._id === courseId ? data.data : c));
    }
    return data;
  };

  // Generate District Plan
  const handleGeneratePlan = async (district, sector) => {
    const res = await fetch('/api/district-plans/plans/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ district, sector })
    });
    const data = await res.json();
    if (data.success && data.data?.plan) {
      setTrainingPlans(prev => [data.data.plan, ...prev]);
    }
    return data;
  };

  // Submit Employer Survey
  const handleSubmitSurvey = async (payload) => {
    const res = await fetch('/api/employer/survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success && data.data) {
      setSurveys(prev => [data.data, ...prev]);
      fetch('/api/courses').then(r => r.json()).then(c => c.success && setCourses(c.data));
    }
    return data;
  };

  // Candidate Pathway Predictor
  const handlePredictPathway = async (payload) => {
    const res = await fetch('/api/candidate/pathway', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  };

  // Auth Handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    loadData();
  };

  const handleLogout = () => {
    localStorage.removeItem('skillpulse_token');
    localStorage.removeItem('skillpulse_user');
    setCurrentUser(null);
    setIsProfileOpen(false);
  };

  // 1st PAGE RULE: If user is not authenticated, show AuthPage as the 1st landing page
  if (!currentUser) {
    return (
      <AuthPage
        onAuthSuccess={handleAuthSuccess}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Once authenticated, render main workspace
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mlStatus={mlStatus}
        onRefresh={loadData}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onLogout={handleLogout}
      />

      <main style={{
        maxWidth: 1400,
        margin: '0 auto',
        width: '100%',
        padding: '24px 20px',
        flex: 1
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '3px solid var(--card-border)',
              borderTopColor: 'var(--primary)',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Loading Labour Market Data...
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
              Retrieving curriculum modules, job signals, and district demand metrics
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <ExecutiveOverview
                overviewData={overviewData}
                jobSignals={jobSignals}
                onSelectCourseTab={() => setActiveTab('curriculum')}
                onSelectDistrictTab={() => setActiveTab('district')}
              />
            )}

            {activeTab === 'analytics' && (
              <DataAnalysisStudio />
            )}

            {activeTab === 'curriculum' && (
              <CurriculumAlignmentStudio
                courses={courses}
                onAnalyzeCourse={handleAnalyzeCourse}
                onApplyUpdate={handleApplyUpdate}
                onVoteCourse={handleVoteCourse}
              />
            )}

            {activeTab === 'district' && (
              <DistrictTrainingPlanner
                districtDemands={districtDemands}
                trainingPlans={trainingPlans}
                onGeneratePlan={handleGeneratePlan}
              />
            )}

            {activeTab === 'employer' && (
              <EmployerValidationWorkbench
                courses={courses}
                surveys={surveys}
                onSubmitSurvey={handleSubmitSurvey}
              />
            )}

            {activeTab === 'candidate' && (
              <CandidateCareerNavigator
                onPredictPathway={handlePredictPathway}
              />
            )}

            {activeTab === 'ml-studio' && (
              <MLModelStudio
                mlStatus={mlStatus}
                onRefreshML={() => fetch('/api/ml/health').then(r => r.json()).then(setMlStatus)}
              />
            )}
          </>
        )}
      </main>

      {/* Auth Modal (For in-app re-auth or switching accounts) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* User Profile & Common Stakeholder Directory Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateUser={updated => setCurrentUser(updated)}
        onLogout={handleLogout}
      />

      {/* Minimal Clean Footer */}
      <footer style={{
        borderTop: '1px solid var(--card-border)',
        background: 'var(--card-bg)',
        padding: '18px 24px',
        marginTop: 40
      }}>
        <div style={{
          maxWidth: 1400,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div>
            <strong style={{ color: 'var(--text-main)' }}>SkillPulse</strong> • Labour-Market Intelligence & Evidence-Based Curriculum Alignment Platform
          </div>
          <div>
            Vocational Education & Industrial Workforce Planning
          </div>
        </div>
      </footer>
    </div>
  );
}
