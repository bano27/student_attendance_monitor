import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import LecturerDashboard from './LecturerDashboard';
import LecturerSessions from './LecturerSessions';
import LecturerRecords from './LecturerRecords';
import LecturerStudents from './LecturerStudents';
import { LecturerSchedule, LecturerProfile } from './LecturerExtra';
import { useAuth } from '../../context/AuthContext';

const pageTitles: Record<string, string> = {
  dashboard: 'Faculty Dashboard',
  sessions: 'Manage Sessions',
  records: 'Attendance Records',
  students: 'Student Overview',
  schedule: 'Teaching Schedule',
  profile: 'Faculty Profile',
};

const LecturerPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, loginSession } = useAuth();

  const loginTime = loginSession?.loginTime
    ? new Date(loginSession.loginTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard': return <LecturerDashboard />;
      case 'sessions': return <LecturerSessions />;
      case 'records': return <LecturerRecords />;
      case 'students': return <LecturerStudents />;
      case 'schedule': return <LecturerSchedule />;
      case 'profile': return <LecturerProfile />;
      default: return <LecturerDashboard />;
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
              background: 'var(--lecturer-gradient)',
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

export default LecturerPortal;
