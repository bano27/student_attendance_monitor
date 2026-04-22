import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockLectures } from '../../data/mockData';

const StudentDashboard: React.FC = () => {
  const { user, loginSession } = useAuth();
  const { getStudentAttendance } = useAttendance();

  const myLectures = mockLectures.filter(l => l.enrolledStudents.includes(user?.id || ''));
  const allRecords = getStudentAttendance(user?.id || '');
  const present = allRecords.filter(r => r.status === 'present').length;
  const late = allRecords.filter(r => r.status === 'late').length;
  const absent = allRecords.filter(r => r.status === 'absent').length;
  const total = allRecords.length;
  const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = days[new Date().getDay() - 1] || 'Monday';
  const todayLectures = myLectures.filter(l => l.day === today);
  const onlineLectures = myLectures.filter(l => l.isOnline);

  const loginTime = loginSession?.loginTime
    ? new Date(loginSession.loginTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '—';

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner welcome-banner-student">
        <div className="row align-items-center">
          <div className="col">
            <div className="welcome-greeting">Good {getGreeting()}, {user?.name?.split(' ')[0]}! 👋</div>
            <div className="welcome-subtitle">{user?.course} · Year {user?.year} · {user?.studentId}</div>
          </div>
          <div className="col-auto d-none d-md-block">
            <div style={{ fontSize: 64, opacity: 0.2 }}>
              <i className="bi bi-mortarboard"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card stat-card-student h-100">
            <div className="stat-icon stat-icon-student">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div className="stat-value stat-value-student">{rate}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card stat-card-student h-100">
            <div className="stat-icon stat-icon-student">
              <i className="bi bi-book-fill"></i>
            </div>
            <div className="stat-value stat-value-student">{myLectures.length}</div>
            <div className="stat-label">Enrolled Courses</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card stat-card-student h-100">
            <div className="stat-icon stat-icon-student">
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <div className="stat-value stat-value-student">{absent}</div>
            <div className="stat-label">Absences</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card stat-card-student h-100">
            <div className="stat-icon stat-icon-student">
              <i className="bi bi-camera-video-fill"></i>
            </div>
            <div className="stat-value stat-value-student">{onlineLectures.length}</div>
            <div className="stat-label">Online Classes</div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Attendance Summary */}
        <div className="col-md-5">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-pie-chart-fill me-2" style={{ color: 'var(--student-accent)' }}></i>Attendance Summary</h6>
            </div>
            <div className="card-body-custom">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ fontSize: 13 }}>Overall Attendance</span>
                  <strong style={{ color: rate >= 75 ? '#28a745' : '#dc3545' }}>{rate}%</strong>
                </div>
                <div className="attendance-bar">
                  <div className="attendance-fill-student" style={{ width: `${rate}%` }}></div>
                </div>
                {rate < 75 && (
                  <div className="alert-custom alert-info-student mt-2" style={{ fontSize: 12, padding: '8px 12px', borderRadius: 8 }}>
                    <i className="bi bi-exclamation-triangle me-1"></i>
                    Attendance below 75% threshold. {total > 0 && `Need ${Math.ceil(total * 0.75 - (present + late))} more to qualify.`}
                  </div>
                )}
              </div>
              <div className="row g-2 text-center">
                {[
                  { label: 'Present', count: present, color: '#28a745', bg: '#d4edda' },
                  { label: 'Late', count: late, color: '#ffc107', bg: '#fff3cd' },
                  { label: 'Absent', count: absent, color: '#dc3545', bg: '#fde8e8' },
                  { label: 'Excused', count: allRecords.filter(r => r.status === 'excused').length, color: '#6366f1', bg: '#e0e7ff' },
                ].map(s => (
                  <div key={s.label} className="col-6">
                    <div style={{ background: s.bg, borderRadius: 10, padding: '12px 8px' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
                      <div style={{ fontSize: 11, color: '#6c757d', fontWeight: 600 }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="col-md-7">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-calendar-day-fill me-2" style={{ color: 'var(--student-accent)' }}></i>Today – {today}</h6>
              <span style={{ fontSize: 12, color: '#6c757d' }}>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="card-body-custom">
              {todayLectures.length === 0 ? (
                <div className="text-center py-4" style={{ color: '#adb5bd' }}>
                  <i className="bi bi-calendar-x" style={{ fontSize: 36 }}></i>
                  <div className="mt-2" style={{ fontSize: 13 }}>No classes today. Enjoy your day!</div>
                </div>
              ) : (
                todayLectures.map(l => (
                  <div key={l.id} className="schedule-item">
                    <div className="schedule-time schedule-time-student">
                      <div>{l.startTime}</div>
                      <div style={{ opacity: 0.6, fontSize: 11 }}>–</div>
                      <div>{l.endTime}</div>
                    </div>
                    <div className="schedule-info">
                      <div className="schedule-course">{l.title}</div>
                      <div className="schedule-meta">
                        <i className="bi bi-tag me-1"></i>{l.courseCode}
                        <span className="mx-2">·</span>
                        <i className={`bi ${l.isOnline ? 'bi-camera-video' : 'bi-building'} me-1`}></i>
                        {l.venue}
                      </div>
                    </div>
                    <div>
                      {l.isOnline && l.meetingLink && (
                        <a href={l.meetingLink} target="_blank" rel="noreferrer" className="online-join-btn">
                          <i className="bi bi-camera-video-fill"></i> Join
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Login Info */}
        <div className="col-md-6">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-shield-check me-2" style={{ color: 'var(--student-accent)' }}></i>Current Session</h6>
            </div>
            <div className="card-body-custom">
              {[
                { icon: 'bi-clock', label: 'Login Time', value: loginTime },
                { icon: 'bi-calendar', label: 'Date', value: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) },
                { icon: 'bi-laptop', label: 'Device', value: loginSession?.device || 'Web Browser' },
                { icon: 'bi-hdd-network', label: 'IP Address', value: loginSession?.ipAddress || '—' },
              ].map(item => (
                <div key={item.label} className="login-info-row">
                  <div className="login-info-icon login-info-icon-student">
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
        </div>

        {/* Per-course attendance */}
        <div className="col-md-6">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-bar-chart-fill me-2" style={{ color: 'var(--student-accent)' }}></i>Per-Course Attendance</h6>
            </div>
            <div className="card-body-custom">
              {myLectures.map(l => {
                const recs = getStudentAttendance(user?.id || '', l.id);
                const p = recs.filter(r => r.status === 'present' || r.status === 'late').length;
                const t = recs.length;
                const pct = t > 0 ? Math.round((p / t) * 100) : 0;
                return (
                  <div key={l.id} className="mb-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12 }}>
                      <span className="fw-semibold">{l.courseCode} – {l.title.length > 28 ? l.title.slice(0, 28) + '…' : l.title}</span>
                      <span style={{ color: pct >= 75 ? '#28a745' : '#dc3545', fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div className="attendance-bar">
                      <div className="attendance-fill-student" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div style={{ fontSize: 11, color: '#adb5bd', marginTop: 3 }}>{p}/{t} sessions attended</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

export default StudentDashboard;
