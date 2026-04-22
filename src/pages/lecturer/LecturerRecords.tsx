import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { mockLectures, mockUsers } from '../../data/mockData';

const LecturerRecords: React.FC = () => {
  const { user } = useAuth();
  const { sessions } = useAttendance();
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const myLectures = mockLectures.filter(l => l.lecturerId === user?.id);
  const mySessions = sessions.filter(s => myLectures.some(l => l.id === s.lectureId));

  const allRecords = mySessions.flatMap(s =>
    s.records.map(r => ({ ...r, sessionDate: s.date, sessionStart: s.startTime }))
  ).sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));

  const filteredRecords = allRecords.filter(r => {
    const courseMatch = selectedCourse === 'All' || r.lectureId === selectedCourse;
    const statusMatch = filterStatus === 'All' || r.status === filterStatus;
    return courseMatch && statusMatch;
  });

  const totalPresent = allRecords.filter(r => r.status === 'present').length;
  const totalLate = allRecords.filter(r => r.status === 'late').length;
  const totalAbsent = allRecords.filter(r => r.status === 'absent').length;
  const totalExcused = allRecords.filter(r => r.status === 'excused').length;

  return (
    <div>
      <div className="welcome-banner welcome-banner-lecturer mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-table me-2"></i>Attendance Records
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          Full attendance history across all your courses
        </p>
      </div>

      {/* Summary */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Present', count: totalPresent, cls: 'badge-present', color: '#28a745' },
          { label: 'Late', count: totalLate, cls: 'badge-late', color: '#ffc107' },
          { label: 'Absent', count: totalAbsent, cls: 'badge-absent', color: '#dc3545' },
          { label: 'Excused', count: totalExcused, cls: 'badge-excused', color: '#6366f1' },
        ].map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="stat-card stat-card-lecturer" style={{ borderTopColor: s.color }}>
              <div className="stat-value stat-value-lecturer" style={{ color: s.color }}>{s.count}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto', fontSize: 12, borderRadius: 8 }}
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="All">All Courses</option>
          {myLectures.map(l => <option key={l.id} value={l.id}>{l.courseCode} – {l.title}</option>)}
        </select>
        <select
          className="form-select form-select-sm"
          style={{ width: 'auto', fontSize: 12, borderRadius: 8 }}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          {['All', 'present', 'late', 'absent', 'excused'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <span style={{ fontSize: 12, color: '#6c757d', alignSelf: 'center' }}>
          Showing {filteredRecords.length} of {allRecords.length} records
        </span>
      </div>

      <div className="content-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Course</th>
                <th>Check-in</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4" style={{ color: '#adb5bd' }}>No records found</td></tr>
              ) : (
                filteredRecords.map(record => {
                  const lecture = myLectures.find(l => l.id === record.lectureId);
                  return (
                    <tr key={record.id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{record.sessionDate}</td>
                      <td>
                        <div className="fw-semibold" style={{ fontSize: 13 }}>{record.studentName}</div>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>
                          {mockUsers.find(u => u.id === record.studentId)?.studentId}
                        </div>
                      </td>
                      <td>
                        <div className="fw-semibold" style={{ fontSize: 13 }}>{lecture?.courseCode}</div>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>{lecture?.title?.slice(0, 28)}</div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{record.checkInTime || '—'}</td>
                      <td>
                        {record.isOnline
                          ? <span className="badge-online">Online</span>
                          : <span style={{ background: '#f0f0f0', color: '#6c757d', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600 }}>Physical</span>}
                      </td>
                      <td><span className={`badge-${record.status}`}>{record.status.charAt(0).toUpperCase() + record.status.slice(1)}</span></td>
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

export default LecturerRecords;
