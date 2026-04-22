import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockLectures } from '../../data/mockData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const LecturerSchedule: React.FC = () => {
  const { user } = useAuth();
  const myLectures = mockLectures.filter(l => l.lecturerId === user?.id);

  return (
    <div>
      <div className="welcome-banner welcome-banner-lecturer mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-calendar-week me-2"></i>Teaching Schedule
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          {user?.department} · Semester 1, 2024 · {myLectures.length} course{myLectures.length !== 1 ? 's' : ''}
        </p>
      </div>

      {days.map(day => {
        const dayLectures = myLectures.filter(l => l.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
        return (
          <div key={day} className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h6 className="fw-bold mb-0" style={{ color: '#1a2332', fontSize: 14 }}>{day}</h6>
              {dayLectures.length === 0 && <span style={{ fontSize: 12, color: '#adb5bd' }}>— No lectures</span>}
            </div>
            {dayLectures.map(l => (
              <div key={l.id} className="schedule-item">
                <div className="schedule-time schedule-time-lecturer">
                  <div>{l.startTime}</div>
                  <div style={{ opacity: 0.5, fontSize: 11, textAlign: 'center' }}>|</div>
                  <div>{l.endTime}</div>
                </div>
                <div className="schedule-info">
                  <div className="schedule-course">{l.title}</div>
                  <div className="schedule-meta d-flex flex-wrap gap-2 align-items-center mt-1">
                    <span><i className="bi bi-tag me-1"></i>{l.courseCode}</span>
                    <span><i className={`bi ${l.isOnline ? 'bi-camera-video' : 'bi-geo-alt'} me-1`}></i>{l.venue}</span>
                    <span><i className="bi bi-people me-1"></i>{l.enrolledStudents.length} students</span>
                  </div>
                </div>
                <div className="d-flex flex-column gap-2 align-items-end">
                  {l.isOnline ? (
                    <span className="badge-online"><i className="bi bi-wifi"></i> Online</span>
                  ) : (
                    <span style={{ background: '#f0f0f0', color: '#6c757d', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>
                      <i className="bi bi-building me-1"></i>In-Person
                    </span>
                  )}
                  {l.isOnline && l.meetingLink && (
                    <a href={l.meetingLink} target="_blank" rel="noreferrer" className="online-join-btn" style={{ fontSize: 11, padding: '4px 12px' }}>
                      <i className="bi bi-box-arrow-up-right"></i> Open Link
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export const LecturerProfile: React.FC = () => {
  const { user, loginSession } = useAuth();
  const myLectures = mockLectures.filter(l => l.lecturerId === user?.id);
  const loginTime = loginSession?.loginTime ? new Date(loginSession.loginTime) : null;

  return (
    <div>
      <div className="welcome-banner welcome-banner-lecturer mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-person-badge me-2"></i>Faculty Profile
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>Your faculty information and current session</p>
      </div>

      <div className="row g-3">
        <div className="col-md-5">
          <div className="content-card mb-3">
            <div className="card-body-custom">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'var(--lecturer-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 26, fontWeight: 800, color: 'white'
                }}>
                  {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h5 className="fw-bold mb-1" style={{ fontSize: 17 }}>{user?.name}</h5>
                  <p className="mb-1 text-muted" style={{ fontSize: 12 }}>{user?.email}</p>
                  <span style={{ background: 'var(--lecturer-accent-light)', color: 'var(--lecturer-primary)', borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>
                    {user?.lecturerId}
                  </span>
                </div>
              </div>
              {[
                { label: 'Department', value: user?.department },
                { label: 'Role', value: 'Lecturer / Faculty' },
                { label: 'Courses Teaching', value: `${myLectures.length} active courses` },
                { label: 'Total Students', value: `${[...new Set(myLectures.flatMap(l => l.enrolledStudents))].length} students` },
                { label: 'Semester', value: 'Semester 1, 2024' },
              ].map(item => (
                <div key={item.label} className="login-info-row">
                  <div className="login-info-icon login-info-icon-lecturer">
                    <i className="bi bi-info-circle"></i>
                  </div>
                  <div>
                    <div className="login-info-label">{item.label}</div>
                    <div className="login-info-value" style={{ fontFamily: 'inherit', fontSize: 13 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-7">
          <div className="content-card mb-3">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-shield-check me-2" style={{ color: 'var(--lecturer-accent)' }}></i>Current Login Session</h6>
            </div>
            <div className="card-body-custom">
              <div className="attendance-code-box mb-3">
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>SESSION ACTIVE SINCE</div>
                <div className="attendance-code" style={{ fontSize: 22, letterSpacing: 2 }}>
                  {loginTime ? loginTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                  {loginTime ? loginTime.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                </div>
              </div>
              {[
                { icon: 'bi-laptop', label: 'Device', value: loginSession?.device || 'Web Browser' },
                { icon: 'bi-hdd-network', label: 'IP Address', value: loginSession?.ipAddress || '—' },
              ].map(item => (
                <div key={item.label} className="login-info-row">
                  <div className="login-info-icon login-info-icon-lecturer">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="login-info-label">{item.label}</div>
                    <div className="login-info-value">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-book me-2" style={{ color: 'var(--lecturer-accent)' }}></i>My Courses</h6>
            </div>
            <div className="card-body-custom">
              {myLectures.map(l => (
                <div key={l.id} className="d-flex justify-content-between align-items-center p-3 mb-2"
                  style={{ background: '#f8f9fa', borderRadius: 10, border: '1px solid #e9ecef' }}>
                  <div>
                    <div className="fw-bold" style={{ fontSize: 13 }}>{l.courseCode}</div>
                    <div style={{ fontSize: 11, color: '#6c757d' }}>{l.title} · {l.day} {l.startTime}</div>
                  </div>
                  <div className="d-flex gap-2 align-items-center">
                    <span style={{ fontSize: 12, color: '#6c757d' }}>{l.enrolledStudents.length} <i className="bi bi-people"></i></span>
                    {l.isOnline
                      ? <span className="badge-online" style={{ fontSize: 10 }}>Online</span>
                      : <span style={{ background: '#f0f0f0', color: '#6c757d', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 600 }}>Physical</span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
