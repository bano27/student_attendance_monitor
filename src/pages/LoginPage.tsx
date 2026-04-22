import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email.trim(), password);
    setLoading(false);
    if (result.success) {
      navigate(role === 'student' ? '/student/dashboard' : '/lecturer/dashboard');
    } else {
      setError(result.message);
    }
  };

  const fillDemo = () => {
    if (role === 'student') {
      setEmail('amara.osei@student.edu');
      setPassword('student123');
    } else {
      setEmail('j.kariuki@faculty.edu');
      setPassword('lecturer123');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <h1 className="login-title">EduTrack</h1>
        <p className="login-subtitle">Attendance Management System</p>

        {/* Role Tabs */}
        <ul className="nav nav-pills role-tabs justify-content-center mb-4 gap-2">
          <li className="nav-item">
            <button
              className={`nav-link student-tab ${role === 'student' ? 'active' : ''}`}
              onClick={() => { setRole('student'); setError(''); }}
            >
              <i className="bi bi-person-fill me-2"></i>Student
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link lecturer-tab ${role === 'lecturer' ? 'active' : ''}`}
              onClick={() => { setRole('lecturer'); setError(''); }}
            >
              <i className="bi bi-person-badge-fill me-2"></i>Lecturer
            </button>
          </li>
        </ul>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3 py-2 rounded-3" style={{ fontSize: 13 }}>
              <i className="bi bi-exclamation-circle-fill"></i> {error}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: 13, color: '#495057' }}>
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#fafafa', borderRight: 'none', border: '2px solid #e9ecef', borderRadius: '10px 0 0 10px' }}>
                <i className="bi bi-envelope" style={{ color: '#adb5bd' }}></i>
              </span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`form-control-custom form-control ${role}-input`}
                style={{ borderLeft: 'none', borderRadius: '0 10px 10px 0' }}
                placeholder={role === 'student' ? 'student@student.edu' : 'faculty@faculty.edu'}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: 13, color: '#495057' }}>
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text" style={{ background: '#fafafa', borderRight: 'none', border: '2px solid #e9ecef', borderRadius: '10px 0 0 10px' }}>
                <i className="bi bi-lock" style={{ color: '#adb5bd' }}></i>
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={`form-control-custom form-control ${role}-input`}
                style={{ borderLeft: 'none', borderRight: 'none', borderRadius: 0 }}
                placeholder="Enter your password"
                required
              />
              <span
                className="input-group-text"
                style={{ background: '#fafafa', borderLeft: 'none', border: '2px solid #e9ecef', borderRadius: '0 10px 10px 0', cursor: 'pointer' }}
                onClick={() => setShowPw(v => !v)}
              >
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} style={{ color: '#adb5bd' }}></i>
              </span>
            </div>
          </div>
          <button
            type="submit"
            className={`btn-login-${role} mb-3`}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Signing in…</>
            ) : (
              <><i className={`bi bi-box-arrow-in-right me-2`}></i>Sign In as {role === 'student' ? 'Student' : 'Lecturer'}</>
            )}
          </button>
        </form>

        <div className="demo-creds">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <strong style={{ fontSize: 12, color: '#495057' }}>
              <i className="bi bi-info-circle me-1"></i> Demo Credentials
            </strong>
            <button onClick={fillDemo} className="btn btn-sm btn-outline-secondary" style={{ fontSize: 11, padding: '2px 10px', borderRadius: 6 }}>
              Auto-fill
            </button>
          </div>
          {role === 'student' ? (
            <div>
              <div className="mb-1">Email: <code>amara.osei@student.edu</code></div>
              <div>Password: <code>student123</code></div>
            </div>
          ) : (
            <div>
              <div className="mb-1">Email: <code>j.kariuki@faculty.edu</code></div>
              <div>Password: <code>lecturer123</code></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
