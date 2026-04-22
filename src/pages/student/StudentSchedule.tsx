import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockLectures } from '../../data/mockData';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const StudentSchedule: React.FC = () => {
  const { user } = useAuth();
  const myLectures = mockLectures.filter(l => l.enrolledStudents.includes(user?.id || ''));
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const filtered = selectedDay === 'All' ? myLectures : myLectures.filter(l => l.day === selectedDay);

  return (
    <div>
      <div className="welcome-banner welcome-banner-student mb-4">
        <h4 className="fw-bold mb-1" style={{ color: 'white' }}>
          <i className="bi bi-calendar-week me-2"></i>My Lecture Schedule
        </h4>
        <p className="mb-0" style={{ opacity: 0.75, fontSize: 13 }}>
          {user?.course} · Semester 1, 2024 · {myLectures.length} courses enrolled
        </p>
      </div>

      {/* Day filter */}
      <div className="d-flex gap-2 flex-wrap mb-3">
        {['All', ...days].map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`btn btn-sm ${selectedDay === d ? 'btn-student-primary' : 'btn-outline-custom'}`}
            style={{ borderRadius: 8 }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Schedule grid per day */}
      {(selectedDay === 'All' ? days : [selectedDay]).map(day => {
        const dayLectures = filtered.filter(l => l.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
        if (dayLectures.length === 0 && selectedDay !== 'All') return null;
        return (
          <div key={day} className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h6 className="fw-bold mb-0" style={{ color: '#1a2332', fontSize: 14 }}>{day}</h6>
              {dayLectures.length === 0 && <span style={{ fontSize: 12, color: '#adb5bd' }}>— No classes</span>}
            </div>
            {dayLectures.map(l => (
              <div key={l.id} className="schedule-item">
                <div className="schedule-time schedule-time-student">
                  <div>{l.startTime}</div>
                  <div style={{ opacity: 0.5, fontSize: 11, textAlign: 'center' }}>|</div>
                  <div>{l.endTime}</div>
                </div>
                <div className="schedule-info">
                  <div className="schedule-course">{l.title}</div>
                  <div className="schedule-meta d-flex flex-wrap gap-2 align-items-center mt-1">
                    <span><i className="bi bi-tag me-1"></i>{l.courseCode}</span>
                    <span><i className={`bi ${l.isOnline ? 'bi-camera-video' : 'bi-geo-alt'} me-1`}></i>{l.venue}</span>
                    <span><i className="bi bi-person me-1"></i>{l.lecturerName}</span>
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
                      <i className="bi bi-camera-video-fill"></i> Join Online
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

export default StudentSchedule;
