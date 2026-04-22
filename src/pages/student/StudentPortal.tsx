import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StudentDashboard from './StudentDashboard';
import StudentSchedule from './StudentSchedule';
import StudentAttendance from './StudentAttendance';
import { StudentOnlineClasses, StudentLoginInfo, StudentProfile } from './StudentExtra';
import { useAuth } from '../../context/AuthContext';

const pageTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  schedule: 'Lecture Schedule',
  attendance: 'My Attendance',
  online: 'Online Classes',
  'login-info': 'Login History',
  profile: 'My Profile',
};

const StudentPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loginSession } = useAuth();

  const loginTime = loginSession?.loginTime
    ? new Date(loginSession.loginTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <StudentDashboard />;
      case 'schedule': return <StudentSchedule />;
      case 'attendance': return <StudentAttendance />;
      case 'online': return <StudentOnlineClasses />;
      case 'login-info': return <StudentLoginInfo />;
      case 'profile': return <StudentProfile />;
      default: return <StudentDashboard />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="main-content">
        <div className="topbar">
          <div className="topbar-title">{pageTitles[activeTab]}</div>
          <div className="topbar-right">
            {loginTime && (
              <div style={{ fontSize: 12, color: '#6c757d', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28a745', display: 'inline-block' }}></span>
                Logged in at {loginTime}
              </div>
            )}
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--student-gradient)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'white', cursor: 'pointer'
            }}>
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          </div>
        </div>
        <div className="page-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
