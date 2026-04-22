import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockLectures, mockUsers } from '../../data/mockData';

const LecturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { sessions } = useAttendance();

  const myLectures = mockLectures.filter(l => l.lecturerId === user?.id);
  const mySessions = sessions.filter(s => myLectures.some(l => l.id === s.lectureId));
  const activeSession = mySessions.find(s => s.isActive);
  const totalStudents = [...new Set(myLectures.flatMap(l => l.enrolledStudents))].length;
  const totalSessions = mySessions.length;
  const allRecords = mySessions.flatMap(s => s.records);
  const presentCount = allRecords.filter(r => r.status === 'present' || r.status === 'late').length;
  const avgRate = allRecords.length > 0 ? Math.round((presentCount / allRecords.length) * 100) : 0;

  const recentSessions = [...mySessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = days[new Date().getDay() - 1] || 'Monday';
  const todayLectures = myLectures.filter(l => l.day === today);

  return (
    <div>
      <div className="welcome-banner welcome-banner-lecturer mb-4">
        <div className="row align-items-center">
          <div className="col">
            <div className="welcome-greeting">Good {getGreeting()}, {user?.name?.split(' ').slice(-1)[0]}! 👨‍🏫</div>
            <div className="welcome-subtitle">{user?.department} · Faculty ID: {user?.lecturerId}</div>
          </div>
          <div className="col-auto d-none d-md-block">
            <div style={{ fontSize: 64, opacity: 0.2 }}>
              <i className="bi bi-person-badge"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Active Session Alert */}
      {activeSession && (
        <div className="alert-custom alert-info-lecturer mb-4" style={{ borderRadius: 12, border: '1px solid var(--lecturer-accent)' }}>
          <i className="bi bi-broadcast me-2" style={{ fontSize: 18 }}></i>
          <div>
            <strong>Active Session Running</strong>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              {mockLectures.find(l => l.id === activeSession.lectureId)?.title} · Code: <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(0,0,0,0.1)', padding: '2px 6px', borderRadius: 4 }}>{activeSession.attendanceCode}</code> · {activeSession.records.length} checked in
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'My Courses', value: myLectures.length, icon: 'bi-book-fill' },
          { label: 'Total Students', value: totalStudents, icon: 'bi-people-fill' },
          { label: 'Sessions Held', value: totalSessions, icon: 'bi-calendar-check-fill' },
          { label: 'Avg Attendance', value: `${avgRate}%`, icon: 'bi-graph-up-arrow' },
        ].map(stat => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className="stat-card stat-card-lecturer h-100">
              <div className="stat-icon stat-icon-lecturer">
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <div className="stat-value stat-value-lecturer">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Today's classes */}
        <div className="col-md-6">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-calendar-day-fill me-2" style={{ color: 'var(--lecturer-accent)' }}></i>Today – {today}</h6>
            </div>
            <div className="card-body-custom">
              {todayLectures.length === 0 ? (
                <div className="text-center py-4" style={{ color: '#adb5bd' }}>
                  <i className="bi bi-calendar-x" style={{ fontSize: 36 }}></i>
                  <div className="mt-2" style={{ fontSize: 13 }}>No lectures scheduled today</div>
                </div>
              ) : (
                todayLectures.map(l => (
                  <div key={l.id} className="schedule-item">
                    <div className="schedule-time schedule-time-lecturer">
                      <div>{l.startTime}</div>
                      <div style={{ opacity: 0.5, fontSize: 11, textAlign: 'center' }}>–</div>
                      <div>{l.endTime}</div>
                    </div>
                    <div className="schedule-info">
                      <div className="schedule-course">{l.title}</div>
                      <div className="schedule-meta">
                        <i className="bi bi-tag me-1"></i>{l.courseCode}
                        <span className="mx-2">·</span>
                        <i className="bi bi-people me-1"></i>{l.enrolledStudents.length} students
                        <span className="mx-2">·</span>
                        {l.venue}
                      </div>
                    </div>
                    <div>
                      {l.isOnline && <span className="badge-online"><i className="bi bi-wifi"></i> Online</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="col-md-6">
          <div className="content-card h-100">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-clock-history me-2" style={{ color: 'var(--lecturer-accent)' }}></i>Recent Sessions</h6>
            </div>
            <div className="card-body-custom">
              {recentSessions.length === 0 ? (
                <div className="text-center py-4" style={{ color: '#adb5bd' }}>
                  <i className="bi bi-journal-x" style={{ fontSize: 36 }}></i>
                  <div className="mt-2" style={{ fontSize: 13 }}>No sessions recorded yet</div>
                </div>
              ) : (
                recentSessions.map(s => {
                  const lecture = myLectures.find(l => l.id === s.lectureId);
                  const attended = s.records.filter(r => r.status === 'present' || r.status === 'late').length;
                  const total = s.records.length;
                  const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
                  return (
                    <div key={s.id} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ background: '#f8f9fa', borderRadius: 10, border: '1px solid #e9ecef' }}>
                      {s.isActive && <span className="badge-active">Live</span>}
                      <div className="flex-grow-1">
                        <div className="fw-semibold" style={{ fontSize: 13 }}>{lecture?.courseCode}</div>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>{s.date} · {s.startTime}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold" style={{ color: pct >= 75 ? '#28a745' : '#dc3545', fontSize: 15 }}>{pct}%</div>
                        <div style={{ fontSize: 11, color: '#adb5bd' }}>{attended}/{total}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Per-course overview */}
        <div className="col-12">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-bar-chart-line-fill me-2" style={{ color: 'var(--lecturer-accent)' }}></i>Course Attendance Overview</h6>
            </div>
            <div className="card-body-custom">
              <div className="row g-3">
                {myLectures.map(l => {
                  const courseSessions = sessions.filter(s => s.lectureId === l.id);
                  const recs = courseSessions.flatMap(s => s.records);
                  const p = recs.filter(r => r.status === 'present' || r.status === 'late').length;
                  const t = recs.length;
                  const pct = t > 0 ? Math.round((p / t) * 100) : 0;
                  return (
                    <div key={l.id} className="col-md-6">
                      <div style={{ background: '#f8f9fa', borderRadius: 12, padding: '16px' }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-bold" style={{ fontSize: 13 }}>{l.courseCode}</div>
                            <div style={{ fontSize: 11, color: '#6c757d' }}>{l.title}</div>
                          </div>
                          <div className="text-end">
                            <div style={{ fontWeight: 800, fontSize: 18, color: pct >= 75 ? '#28a745' : '#dc3545' }}>{pct}%</div>
                            <div style={{ fontSize: 10, color: '#adb5bd' }}>{courseSessions.length} sessions</div>
                          </div>
                        </div>
                        <div className="attendance-bar">
                          <div className="attendance-fill-lecturer" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <span style={{ fontSize: 11, color: '#6c757d' }}>{l.enrolledStudents.length} students</span>
                          <span style={{ fontSize: 11, color: '#6c757d' }}>{p}/{t} present</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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

export default LecturerDashboard;
