import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockLectures } from '../../data/mockData';

const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const { sessions, markAttendance } = useAttendance();
  const [codeInput, setCodeInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState('All');

  const myLectures = mockLectures.filter(l => l.enrolledStudents.includes(user?.id || ''));

  const handleMarkAttendance = () => {
    const code = codeInput.trim().toUpperCase();
    const session = sessions.find(s => s.attendanceCode === code && s.isActive);
    if (!session) {
      setFeedback({ type: 'error', msg: 'Invalid or expired attendance code. Please check with your lecturer.' });
      return;
    }
    const lecture = myLectures.find(l => l.id === session.lectureId);
    if (!lecture) {
      setFeedback({ type: 'error', msg: 'You are not enrolled in this lecture.' });
      return;
    }
    const alreadyMarked = session.records.find(r => r.studentId === user?.id);
    if (alreadyMarked) {
      setFeedback({ type: 'error', msg: 'Attendance already recorded for this session.' });
      return;
    }
    markAttendance(session.id, user?.id || '', user?.name || '', lecture.isOnline);
    setFeedback({ type: 'success', msg: `Attendance marked for ${lecture.title}!` });
    setCodeInput('');
    setTimeout(() => setFeedback(null), 4000);
  };

  const allRecords = sessions
    .flatMap(s => s.records.filter(r => r.studentId === user?.id))
    .sort((a, b) => b.date.localeCompare(a.date));

  const filtered = selectedCourse === 'All'
    ? allRecords
    : allRecords.filter(r => r.lectureId === selectedCourse);

  const activeSessions = sessions.filter(s =>
    s.isActive && myLectures.some(l => l.id === s.lectureId)
  );

  return (
    <div>
      <div className="welcome-banner welcome-banner-student mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-clipboard-check me-2"></i>My Attendance Records
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>Mark attendance and view your history</p>
      </div>

      <div className="row g-3 mb-4">
        {/* Mark Attendance */}
        <div className="col-md-5">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-qr-code-scan me-2" style={{ color: 'var(--student-accent)' }}></i>Mark Attendance</h6>
            </div>
            <div className="card-body-custom">
              {activeSessions.length > 0 && (
                <div className="alert-custom alert-info-student mb-3" style={{ borderRadius: 8 }}>
                  <i className="bi bi-bell-fill me-2"></i>
                  <strong>{activeSessions.length}</strong> active session{activeSessions.length > 1 ? 's' : ''} right now!
                </div>
              )}
              <p style={{ fontSize: 13, color: '#6c757d' }}>Enter the attendance code provided by your lecturer.</p>
              <div className="mb-3">
                <input
                  type="text"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value.toUpperCase())}
                  className="form-control-custom form-control student-input text-center"
                  placeholder="e.g. CS301-A1"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 18, letterSpacing: 4, textTransform: 'uppercase' }}
                  onKeyDown={e => e.key === 'Enter' && handleMarkAttendance()}
                />
              </div>
              <button
                className="btn-student-primary w-100"
                onClick={handleMarkAttendance}
                style={{ justifyContent: 'center' }}
              >
                <i className="bi bi-check-lg"></i> Submit Attendance
              </button>
              {feedback && (
                <div className={`mt-2 p-2 rounded-3 text-center ${feedback.type === 'success' ? 'text-success bg-success bg-opacity-10' : 'text-danger bg-danger bg-opacity-10'}`} style={{ fontSize: 13 }}>
                  <i className={`bi ${feedback.type === 'success' ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                  {feedback.msg}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="col-md-7">
          <div className="content-card">
            <div className="card-header-custom">
              <h6 className="card-title-custom"><i className="bi bi-wifi me-2" style={{ color: '#28a745' }}></i>Active Sessions</h6>
            </div>
            <div className="card-body-custom">
              {activeSessions.length === 0 ? (
                <div className="text-center py-3" style={{ color: '#adb5bd' }}>
                  <i className="bi bi-clock-history" style={{ fontSize: 32 }}></i>
                  <div className="mt-2" style={{ fontSize: 13 }}>No active sessions right now</div>
                </div>
              ) : (
                activeSessions.map(s => {
                  const lecture = mockLectures.find(l => l.id === s.lectureId);
                  const alreadyIn = s.records.find(r => r.studentId === user?.id);
                  return (
                    <div key={s.id} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ background: '#f8fff9', borderRadius: 10, border: '1px solid #c3e6cb' }}>
                      <div>
                        <span className="badge-active">Live</span>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold" style={{ fontSize: 13 }}>{lecture?.title}</div>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>{lecture?.courseCode} · Code: <code style={{ fontFamily: 'var(--font-mono)' }}>{s.attendanceCode}</code></div>
                      </div>
                      {alreadyIn ? (
                        <span className="badge-present">Marked ✓</span>
                      ) : (
                        <button
                          className="btn-student-primary"
                          style={{ padding: '6px 14px', fontSize: 12 }}
                          onClick={() => { setCodeInput(s.attendanceCode || ''); }}
                        >
                          Use Code
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="content-card">
        <div className="card-header-custom">
          <h6 className="card-title-custom"><i className="bi bi-clock-history me-2" style={{ color: 'var(--student-accent)' }}></i>Attendance History</h6>
          <select
            className="form-select form-select-sm"
            style={{ width: 'auto', fontSize: 12, borderRadius: 8 }}
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
          >
            <option value="All">All Courses</option>
            {myLectures.map(l => <option key={l.id} value={l.id}>{l.courseCode}</option>)}
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course</th>
                <th>Check-in Time</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4" style={{ color: '#adb5bd' }}>No attendance records found</td></tr>
              ) : (
                filtered.map(record => {
                  const lecture = mockLectures.find(l => l.id === record.lectureId);
                  return (
                    <tr key={record.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{record.date}</td>
                      <td>
                        <div className="fw-semibold" style={{ fontSize: 13 }}>{lecture?.courseCode}</div>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>{lecture?.title}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{record.checkInTime || '—'}</td>
                      <td>{record.isOnline ? <span className="badge-online">Online</span> : <span style={{ background: '#f0f0f0', color: '#6c757d', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>In-Person</span>}</td>
                      <td>
                        <span className={`badge-${record.status}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAttendance;
