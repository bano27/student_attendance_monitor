import React, { createContext, useContext, useState } from 'react';
import { AttendanceSession, AttendanceRecord } from '../types';
import { mockAttendanceSessions } from '../data/mockData';

interface AttendanceContextType {
  sessions: AttendanceSession[];
  createSession: (lectureId: string) => AttendanceSession;
  closeSession: (sessionId: string) => void;
  markAttendance: (sessionId: string, studentId: string, studentName: string, isOnline: boolean) => void;
  updateAttendanceStatus: (sessionId: string, recordId: string, status: AttendanceRecord['status']) => void;
  getSessionsByLecture: (lectureId: string) => AttendanceSession[];
  getStudentAttendance: (studentId: string, lectureId?: string) => AttendanceRecord[];
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>(mockAttendanceSessions);

  const createSession = (lectureId: string): AttendanceSession => {
    const code = lectureId.split('-')[1]?.toUpperCase() + '-' + Date.now().toString().slice(-4);
    const newSession: AttendanceSession = {
      id: 'sess-' + Date.now(),
      lectureId,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isActive: true,
      attendanceCode: code,
      records: [],
    };
    setSessions(prev => [...prev, newSession]);
    return newSession;
  };

  const closeSession = (sessionId: string) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, isActive: false, endTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }
          : s
      )
    );
  };

  const markAttendance = (sessionId: string, studentId: string, studentName: string, isOnline: boolean) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;
    const alreadyMarked = session.records.find(r => r.studentId === studentId);
    if (alreadyMarked) return;

    const now = new Date();
    const [startH, startM] = session.startTime.split(':').map(Number);
    const isLate = now.getHours() * 60 + now.getMinutes() > startH * 60 + startM + 15;

    const record: AttendanceRecord = {
      id: 'ar-' + Date.now(),
      lectureId: session.lectureId,
      studentId,
      studentName,
      date: session.date,
      checkInTime: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      status: isLate ? 'late' : 'present',
      isOnline,
    };

    setSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, records: [...s.records, record] } : s)
    );
  };

  const updateAttendanceStatus = (sessionId: string, recordId: string, status: AttendanceRecord['status']) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === sessionId
          ? { ...s, records: s.records.map(r => r.id === recordId ? { ...r, status } : r) }
          : s
      )
    );
  };

  const getSessionsByLecture = (lectureId: string) =>
    sessions.filter(s => s.lectureId === lectureId).sort((a, b) => b.date.localeCompare(a.date));

  const getStudentAttendance = (studentId: string, lectureId?: string) => {
    const allRecords = sessions.flatMap(s => s.records);
    return lectureId
      ? allRecords.filter(r => r.studentId === studentId && r.lectureId === lectureId)
      : allRecords.filter(r => r.studentId === studentId);
  };

  return (
    <AttendanceContext.Provider value={{
      sessions,
      createSession,
      closeSession,
      markAttendance,
      updateAttendanceStatus,
      getSessionsByLecture,
      getStudentAttendance,
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error('useAttendance must be used within AttendanceProvider');
  return ctx;
};
