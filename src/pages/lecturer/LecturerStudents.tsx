import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockLectures, mockUsers } from '../../data/mockData';

const LecturerStudents: React.FC = () => {
  const { user } = useAuth();
  const { sessions } = useAttendance();
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [viewStudent, setViewStudent] = useState<string | null>(null);

  const myLectures = mockLectures.filter(l => l.lecturerId === user?.id);
  const mySessions = sessions.filter(s => myLectures.some(l => l.id === s.lectureId));

  // Build unique student list
  const studentIds = [...new Set(myLectures
    .filter(l => selectedCourse === 'All' || l.id === selectedCourse)
    .flatMap(l => l.enrolledStudents))];

  const students = studentIds.map(sid => {
    const student = mockUsers.find(u => u.id === sid);
    const enrolledLectures = myLectures.filter(l => l.enrolledStudents.includes(sid));
    const allRecords = mySessions.flatMap(s =>
      s.records.filter(r => r.studentId === sid)
    );
    const present = allRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const total = allRecords.length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 0;
    return { student, enrolledLectures, allRecords, present, total, rate };
  });

  const detailStudent = viewStudent ? students.find(s => s.student?.id === viewStudent) : null;

  return (
    <div>
      <div className="welcome-banner welcome-banner-lecturer mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-people me-2"></i>Student Overview
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          Track individual student attendance across all your courses
        </p>
      </div>

      {/* Course Filter */}
      <div className="d-flex gap-2 align-items-center mb-3 flex-wrap">
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto', fontSize: 12, borderRadius: 8 }}
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="All">All Courses</option>
          {myLectures.map(l => <option key={l.id} value={l.id}>{l.courseCode} – {l.title}</option>)}
        </select>
        <span style={{ fontSize: 12, color: '#6c757d' }}>{students.length} student{students.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="content-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Student</th>
                <th>Courses</th>
                <th>Sessions</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Rate</th>
                <th>Standing</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map(({ student, enrolledLectures, allRecords, present, total, rate }) => {
                const absent = allRecords.filter(r => r.status === 'absent').length;
                const standing = rate >= 75 ? 'Good' : rate >= 50 ? 'At Risk' : 'Critical';
                const standingColor = rate >= 75 ? '#28a745' : rate >= 50 ? '#ffc107' : '#dc3545';
                return (
                  <tr key={student?.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--lecturer-gradient)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0
                        }}>
                          {student?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: 13 }}>{student?.name}</div>
                          <div style={{ fontSize: 11, color: '#6c757d', fontFamily: 'var(--font-mono)' }}>{student?.studentId}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 12 }}>{enrolledLectures.map(l => l.courseCode).join(', ')}</td>
                    <td style={{ fontSize: 13, fontWeight: 600 }}>{total}</td>
                    <td><span className="badge-present">{present}</span></td>
                    <td><span className="badge-absent">{absent}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, minWidth: 60 }}>
                          <div className="attendance-bar">
                            <div className="attendance-fill-lecturer" style={{ width: `${rate}%` }}></div>
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 13, color: standingColor, minWidth: 36 }}>{rate}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ background: `${standingColor}22`, color: standingColor, borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                        {standing}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-outline-custom"
                        style={{ padding: '5px 12px', fontSize: 12 }}
                        onClick={() => setViewStudent(student?.id || null)}
                      >
                        <i className="bi bi-eye"></i> Details
                      </button>
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr><td colSpan={8} className="text-center py-4" style={{ color: '#adb5bd' }}>No students found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {viewStudent && detailStudent && (
        <div className="modal-backdrop-custom" onClick={() => setViewStudent(null)}>
          <div className="modal-box" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div className="d-flex gap-3 align-items-center">
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: 'var(--lecturer-gradient)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 800, color: 'white'
                }}>
                  {detailStudent.student?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h5 className="fw-bold mb-0" style={{ fontSize: 16 }}>{detailStudent.student?.name}</h5>
                  <div style={{ fontSize: 12, color: '#6c757d', fontFamily: 'var(--font-mono)' }}>{detailStudent.student?.studentId}</div>
                </div>
              </div>
              <button onClick={() => setViewStudent(null)} style={{ background: 'none', border: 'none', fontSize: 20, color: '#adb5bd', cursor: 'pointer' }}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Per-course breakdown */}
            <div className="mb-3">
              <h6 className="fw-bold mb-3" style={{ fontSize: 13, color: '#6c757d', textTransform: 'uppercase', letterSpacing: 0.5 }}>Course Breakdown</h6>
              {detailStudent.enrolledLectures.map(l => {
                const recs = mySessions
                  .filter(s => s.lectureId === l.id)
                  .flatMap(s => s.records.filter(r => r.studentId === viewStudent));
                const p = recs.filter(r => r.status === 'present' || r.status === 'late').length;
                const t = recs.length;
                const pct = t > 0 ? Math.round((p / t) * 100) : 0;
                return (
                  <div key={l.id} className="mb-3 p-3" style={{ background: '#f8f9fa', borderRadius: 10 }}>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-semibold" style={{ fontSize: 13 }}>{l.courseCode} – {l.title}</span>
                      <span style={{ fontWeight: 700, color: pct >= 75 ? '#28a745' : '#dc3545', fontSize: 14 }}>{pct}%</span>
                    </div>
                    <div className="attendance-bar mb-1">
                      <div className="attendance-fill-lecturer" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="d-flex gap-3" style={{ fontSize: 11, color: '#6c757d' }}>
                      <span><span className="badge-present">{recs.filter(r => r.status === 'present').length}</span> Present</span>
                      <span><span className="badge-late">{recs.filter(r => r.status === 'late').length}</span> Late</span>
                      <span><span className="badge-absent">{recs.filter(r => r.status === 'absent').length}</span> Absent</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent records */}
            <h6 className="fw-bold mb-2" style={{ fontSize: 13, color: '#6c757d', textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent Attendance</h6>
            <div style={{ maxHeight: 200, overflowY: 'auto' }}>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Course</th>
                    <th>Check-in</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detailStudent.allRecords.slice(0, 10).map(r => {
                    const lec = myLectures.find(l => l.id === r.lectureId);
                    return (
                      <tr key={r.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{r.date}</td>
                        <td style={{ fontSize: 12 }}>{lec?.courseCode}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>{r.checkInTime || '—'}</td>
                        <td><span className={`badge-${r.status}`} style={{ fontSize: 10 }}>{r.status}</span></td>
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

export default LecturerStudents;
