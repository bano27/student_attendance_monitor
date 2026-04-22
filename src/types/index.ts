export type UserRole = 'student' | 'lecturer';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  studentId?: string;
  lecturerId?: string;
  department?: string;
  course?: string;
  year?: number;
  avatar?: string;
}

export interface LoginSession {
  userId: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress?: string;
  device?: string;
}

export interface Lecture {
  id: string;
  title: string;
  courseCode: string;
  lecturerId: string;
  lecturerName: string;
  day: string;
  startTime: string;
  endTime: string;
  venue: string;
  isOnline: boolean;
  meetingLink?: string;
  semester: string;
  enrolledStudents: string[];
}

export interface AttendanceRecord {
  id: string;
  lectureId: string;
  studentId: string;
  studentName: string;
  date: string;
  checkInTime: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  isOnline: boolean;
  sessionId?: string;
}

export interface AttendanceSession {
  id: string;
  lectureId: string;
  date: string;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  attendanceCode?: string;
  records: AttendanceRecord[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loginSession: LoginSession | null;
}
