import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockLectures, mockUsers } from '../../data/mockData';

const LecturerSessions: React.FC = () => {
  const { user } = useAuth();
  const { sessions, createSession, closeSession, markAttendance, updateAttendanceStatus } = useAttendance();
  const [selectedLecture, setSelectedLecture] = useState('');
  const [viewSession, setViewSession] = useState<string | null>(null);

  const myLectures = mockLectures.filter(l => l.lecturerId === user?.id);
  const mySessions = sessions
    .filter(s => myLectures.some(l => l.id === s.lectureId))
    .sort((a, b) => b.date.localeCompare(a.date));

  const activeSession = mySessions.find(s => s.isActive);

  const handleStartSession = () => {
    if (!selectedLecture) return;
    createSession(selectedLecture);
    setSelectedLecture('');
  };

  const sessionDetail = viewSession ? sessions.find(s => s.id === viewSession) : null;
  const sessionLecture = sessionDetail ? mockLectures.find(l => l.id === sessionDetail.lectureId) : null;

  // Students not yet marked in session
  const unmarkedStudents = sessionDetail && sessionLecture
    ? sessionLecture.enrolledStudents
        .filter(sid => !sessionDetail.records.find(r => r.studentId === sid))
        .map(sid => mockUsers.find(u => u.id === sid))
        .filter(Boolean)
    : [];

  return (
    <div>
      <div className="welcome-banner welcome-banner-lecturer mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-play-circle me-2"></i>Manage Attendance Sessions
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          Start sessions, generate codes, and track real-time attendance
        </p>
      </div>

      <div className="row g-3 mb-4">
        {/* Start Session */}
        <div className="col-md-5">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-play-fill me-2" style={{ color: 'var(--lecturer-accent)' }}></i>Start New Session</h6>
            </div>
            <div className="card-body-custom">
              {activeSession && (
                <div className="mb-3 p-3" style={{ background: '#fff3cd', borderRadius: 10, border: '1px solid #ffc107' }}>
                  <div className="fw-bold" style={{ fontSize: 13, color: '#856404' }}>
                    <i className="bi bi-exclamation-triangle me-1"></i> A session is already active
                  </div>
                  <div style={{ fontSize: 12, color: '#856404', opacity: 0.8 }}>
                    Close the current session before starting a new one.
                  </div>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: 12 }}>Select Lecture</label>
                <select
                  className="form-select"
                  value={selectedLecture}
                  onChange={e => setSelectedLecture(e.target.value)}
                  style={{ borderRadius: 10, fontSize: 13, border: '2px solid #e9ecef' }}
                  disabled={!!activeSession}
                >
                  <option value="">— Choose a lecture —</option>
                  {myLectures.map(l => (
                    <option key={l.id} value={l.id}>{l.courseCode} – {l.title} ({l.day})</option>
                  ))}
                </select>
              </div>
              <button
                className="btn-lecturer-primary w-100"
                style={{ justifyContent: 'center' }}
                onClick={handleStartSession}
                disabled={!selectedLecture || !!activeSession}
              >
                <i className="bi bi-play-fill"></i> Start Session
              </button>
            </div>
          </div>
        </div>

        {/* Active Session */}
        <div className="col-md-7">
          {activeSession ? (
            <div className="content-card">
              <div className="card-header-custom" style={{ background: 'linear-gradient(135deg, #1a3a2a, #2d5a3d)', borderRadius: '12px 12px 0 0' }}>
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge-active">Live Session</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                      Started at {activeSession.startTime}
                    </span>
                  </div>
                  <h6 className="card-title-custom" style={{ color: 'white' }}>
                    {mockLectures.find(l => l.id === activeSession.lectureId)?.title}
                  </h6>
                </div>
              </div>
              <div className="card-body-custom">
                <div className="attendance-code-box mb-3">
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>ATTENDANCE CODE</div>
                  <div className="attendance-code">{activeSession.attendanceCode}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
                    Share this code with your students
                  </div>
                </div>
                <div className="d-flex gap-2 align-items-center mb-3">
                  <div style={{ flex: 1, background: '#f8f9fa', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#28a745' }}>{activeSession.records.length}</div>
                    <div style={{ fontSize: 11, color: '#6c757d' }}>Checked In</div>
                  </div>
                  <div style={{ flex: 1, background: '#f8f9fa', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#dc3545' }}>
                      {(mockLectures.find(l => l.id === activeSession.lectureId)?.enrolledStudents.length || 0) - activeSession.records.length}
                    </div>
                    <div style={{ fontSize: 11, color: '#6c757d' }}>Pending</div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button
                    className="btn-outline-custom flex-grow-1"
                    style={{ justifyContent: 'center' }}
                    onClick={() => setViewSession(activeSession.id)}
                  >
                    <i className="bi bi-eye"></i> View Details
                  </button>
                  <button
                    className="btn btn-danger flex-grow-1"
                    style={{ borderRadius: 8, fontSize: 13, fontWeight: 600 }}
                    onClick={() => closeSession(activeSession.id)}
                  >
                    <i className="bi bi-stop-circle me-1"></i> Close Session
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="content-card h-100">
              <div className="card-body-custom d-flex flex-column align-items-center justify-content-center py-5">
                <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--lecturer-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <i className="bi bi-wifi-off" style={{ fontSize: 28, color: 'var(--lecturer-accent)' }}></i>
                </div>
                <div className="fw-semibold mb-1" style={{ color: '#1a2332' }}>No Active Session</div>
                <div style={{ fontSize: 13, color: '#adb5bd', textAlign: 'center' }}>
                  Start a session to generate an attendance code for your students
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="content-card">
        <div className="card-header-custom">
          <h6 className="card-title-custom"><i className="bi bi-journal-text me-2" style={{ color: 'var(--lecturer-accent)' }}></i>Session History</h6>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Rate</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mySessions.filter(s => !s.isActive).map(s => {
                const lecture = myLectures.find(l => l.id === s.lectureId);
                const total = s.records.length;
                const pres = s.records.filter(r => r.status === 'present' || r.status === 'late').length;
                const enrolled = lecture?.enrolledStudents.length || 0;
                const pct = enrolled > 0 ? Math.round((pres / enrolled) * 100) : 0;
                return (
                  <tr key={s.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.date}</td>
                    <td>
                      <div className="fw-semibold" style={{ fontSize: 13 }}>{lecture?.courseCode}</div>
                      <div style={{ fontSize: 11, color: '#6c757d' }}>{lecture?.title?.slice(0, 30)}</div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{s.startTime} – {s.endTime || '?'}</td>
                    <td>{lecture?.isOnline ? <span className="badge-online">Online</span> : <span style={{ background: '#f0f0f0', color: '#6c757d', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>Physical</span>}</td>
                    <td><span className="badge-present">{pres}</span></td>
                    <td><span className="badge-absent">{enrolled - pres}</span></td>
                    <td>
                      <span style={{ fontWeight: 700, color: pct >= 75 ? '#28a745' : '#dc3545', fontSize: 13 }}>{pct}%</span>
                    </td>
                    <td>
                      <button
                        className="btn-outline-custom"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                        onClick={() => setViewSession(s.id)}
                      >
                        <i className="bi bi-eye"></i> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {mySessions.filter(s => !s.isActive).length === 0 && (
                <tr><td colSpan={8} className="text-center py-4" style={{ color: '#adb5bd' }}>No completed sessions yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Detail Modal */}
      {viewSession && sessionDetail && (
        <div className="modal-backdrop-custom" onClick={() => setViewSession(null)}>
          <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h5 className="fw-bold mb-1" style={{ color: '#1a2332', fontSize: 16 }}>
                  Session Details – {sessionLecture?.courseCode}
                </h5>
                <div style={{ fontSize: 12, color: '#6c757d' }}>
                  {sessionDetail.date} · {sessionDetail.startTime} – {sessionDetail.endTime || 'Active'} · Code: <code style={{ fontFamily: 'var(--font-mono)' }}>{sessionDetail.attendanceCode}</code>
                </div>
              </div>
              <button
                onClick={() => setViewSession(null)}
                style={{ background: 'none', border: 'none', fontSize: 20, color: '#adb5bd', cursor: 'pointer', padding: 0 }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Check-in</th>
                    <th>Status</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionLecture?.enrolledStudents.map(sid => {
                    const student = mockUsers.find(u => u.id === sid);
                    const record = sessionDetail.records.find(r => r.studentId === sid);
                    return (
                      <tr key={sid}>
                        <td>
                          <div className="fw-semibold" style={{ fontSize: 13 }}>{student?.name}</div>
                          <div style={{ fontSize: 11, color: '#6c757d' }}>{student?.studentId}</div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{record?.checkInTime || '—'}</td>
                        <td>
                          {record ? (
                            <span className={`badge-${record.status}`}>{record.status}</span>
                          ) : (
                            <span className="badge-absent">absent</span>
                          )}
                        </td>
                        <td>
                          {record && (
                            <select
                              className="form-select form-select-sm"
                              value={record.status}
                              onChange={e => updateAttendanceStatus(sessionDetail.id, record.id, e.target.value as any)}
                              style={{ fontSize: 11, width: 100, borderRadius: 6 }}
                            >
                              <option value="present">Present</option>
                              <option value="late">Late</option>
                              <option value="absent">Absent</option>
                              <option value="excused">Excused</option>
                            </select>
                          )}
                          {!record && (
                            <button
                              className="btn btn-sm btn-success"
                              style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6 }}
                              onClick={() => markAttendance(sessionDetail.id, sid, student?.name || '', false)}
                            >
                              Mark Present
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerSessions;
