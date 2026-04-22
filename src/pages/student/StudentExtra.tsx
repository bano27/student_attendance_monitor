import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockLectures } from '../../data/mockData';

export const StudentOnlineClasses: React.FC = () => {
  const { user } = useAuth();
  const myLectures = mockLectures.filter(l => l.enrolledStudents.includes(user?.id || '') && l.isOnline);

  return (
    <div>
      <div className="welcome-banner welcome-banner-student mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-camera-video me-2"></i>Online Lectures
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          All your virtual classes in one place
        </p>
      </div>

      {myLectures.length === 0 ? (
        <div className="content-card">
          <div className="card-body-custom text-center py-5" style={{ color: '#adb5bd' }}>
            <i className="bi bi-camera-video-off" style={{ fontSize: 48 }}></i>
            <div className="mt-2">No online classes enrolled</div>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {myLectures.map(l => (
            <div key={l.id} className="col-md-6">
              <div className="content-card">
                <div className="card-body-custom">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    <div>
                      <span className="badge-online mb-2 d-inline-block"><i className="bi bi-wifi me-1"></i>Online</span>
                      <h6 className="fw-bold mb-1" style={{ color: '#1a2332' }}>{l.title}</h6>
                      <p className="mb-0" style={{ fontSize: 12, color: '#6c757d' }}>{l.courseCode} · {l.lecturerName}</p>
                    </div>
                    <div style={{ background: 'var(--student-accent-light)', borderRadius: 10, padding: 12 }}>
                      <i className="bi bi-camera-video-fill" style={{ fontSize: 24, color: 'var(--student-accent)' }}></i>
                    </div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap mb-3" style={{ fontSize: 12, color: '#6c757d' }}>
                    <span><i className="bi bi-calendar me-1"></i>{l.day}</span>
                    <span><i className="bi bi-clock me-1"></i>{l.startTime} – {l.endTime}</span>
                    <span><i className="bi bi-geo-alt me-1"></i>{l.venue}</span>
                  </div>
                  {l.meetingLink ? (
                    <a href={l.meetingLink} target="_blank" rel="noreferrer" className="btn-student-primary" style={{ textDecoration: 'none', display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
                      <i className="bi bi-box-arrow-up-right"></i> Join Online Session
                    </a>
                  ) : (
                    <div style={{ fontSize: 12, color: '#adb5bd', textAlign: 'center', padding: '8px', background: '#f8f9fa', borderRadius: 8 }}>
                      Meeting link not yet available
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const StudentLoginInfo: React.FC = () => {
  const { user, loginSession } = useAuth();

  const loginTime = loginSession?.loginTime ? new Date(loginSession.loginTime) : null;

  const mockHistory = [
    { time: new Date(Date.now() - 86400000), device: 'Chrome / Windows', ip: '192.168.1.12', status: 'success' },
    { time: new Date(Date.now() - 172800000), device: 'Mobile Safari / iOS', ip: '192.168.1.25', status: 'success' },
    { time: new Date(Date.now() - 259200000), device: 'Chrome / Windows', ip: '192.168.1.12', status: 'success' },
    { time: new Date(Date.now() - 432000000), device: 'Firefox / Linux', ip: '10.0.0.5', status: 'failed' },
  ];

  return (
    <div>
      <div className="welcome-banner welcome-banner-student mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-shield-lock me-2"></i>Login History & Security
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          Review your account access history
        </p>
      </div>

      <div className="row g-3">
        <div className="col-md-5">
          <div className="content-card mb-3">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-person-check me-2" style={{ color: 'var(--student-accent)' }}></i>Account Details</h6>
            </div>
            <div className="card-body-custom">
              {[
                { icon: 'bi-person', label: 'Full Name', value: user?.name },
                { icon: 'bi-envelope', label: 'Email', value: user?.email },
                { icon: 'bi-card-text', label: 'Student ID', value: user?.studentId },
                { icon: 'bi-building', label: 'Department', value: user?.department },
                { icon: 'bi-mortarboard', label: 'Programme', value: user?.course },
                { icon: 'bi-layers', label: 'Year of Study', value: `Year ${user?.year}` },
              ].map(item => (
                <div key={item.label} className="login-info-row">
                  <div className="login-info-icon login-info-icon-student">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="login-info-label">{item.label}</div>
                    <div className="login-info-value" style={{ fontFamily: 'inherit', fontSize: 13 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-shield-check me-2" style={{ color: 'var(--student-accent)' }}></i>Current Session</h6>
            </div>
            <div className="card-body-custom">
              <div className="attendance-code-box">
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>LOGGED IN SINCE</div>
                <div className="attendance-code" style={{ fontSize: 22, letterSpacing: 2 }}>
                  {loginTime ? loginTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {loginTime ? loginTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-clock-history me-2" style={{ color: 'var(--student-accent)' }}></i>Recent Logins</h6>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Device</th>
                    <th>IP Address</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Current session first */}
                  {loginTime && (
                    <tr style={{ background: 'rgba(0,184,169,0.05)' }}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {loginTime.toLocaleDateString('en-GB')} {loginTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                        <span className="badge-active ms-2">Current</span>
                      </td>
                      <td style={{ fontSize: 12 }}>{loginSession?.device}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{loginSession?.ipAddress}</td>
                      <td><span className="badge-present">Success</span></td>
                    </tr>
                  )}
                  {mockHistory.map((h, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {h.time.toLocaleDateString('en-GB')} {h.time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ fontSize: 12 }}>{h.device}</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{h.ip}</td>
                      <td>
                        {h.status === 'success'
                          ? <span className="badge-present">Success</span>
                          : <span className="badge-absent">Failed</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="welcome-banner welcome-banner-student mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-person-circle me-2"></i>My Profile
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>Your academic profile</p>
      </div>
      <div className="content-card" style={{ maxWidth: 600 }}>
        <div className="card-body-custom">
          <div className="d-flex align-items-center gap-4 mb-4">
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'var(--student-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 800, color: 'white'
            }}>
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h5 className="fw-bold mb-1">{user?.name}</h5>
              <p className="mb-0 text-muted" style={{ fontSize: 13 }}>{user?.email}</p>
              <span className="badge-online mt-1 d-inline-block">{user?.studentId}</span>
            </div>
          </div>
          <div className="row g-3">
            {[
              { label: 'Department', value: user?.department },
              { label: 'Programme', value: user?.course },
              { label: 'Year of Study', value: `Year ${user?.year}` },
              { label: 'Semester', value: 'Semester 1, 2024' },
            ].map(item => (
              <div key={item.label} className="col-6">
                <div style={{ background: '#f8f9fa', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, color: '#adb5bd', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{item.label}</div>
                  <div style={{ fontWeight: 700, color: '#1a2332', fontSize: 14, marginTop: 4 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
