import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const studentNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-fill', section: 'MAIN' },
  { id: 'schedule', label: 'My Schedule', icon: 'bi-calendar-week-fill', section: 'ACADEMICS' },
  { id: 'attendance', label: 'My Attendance', icon: 'bi-clipboard-check-fill', section: 'ACADEMICS' },
  { id: 'online', label: 'Online Classes', icon: 'bi-camera-video-fill', section: 'ACADEMICS' },
  { id: 'login-info', label: 'Login History', icon: 'bi-shield-lock-fill', section: 'ACCOUNT' },
  { id: 'profile', label: 'Profile', icon: 'bi-person-circle', section: 'ACCOUNT' },
];

const lecturerNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-fill', section: 'MAIN' },
  { id: 'sessions', label: 'Manage Sessions', icon: 'bi-play-circle-fill', section: 'TEACHING' },
  { id: 'records', label: 'Attendance Records', icon: 'bi-table', section: 'TEACHING' },
  { id: 'students', label: 'Student Overview', icon: 'bi-people-fill', section: 'TEACHING' },
  { id: 'schedule', label: 'My Schedule', icon: 'bi-calendar-week-fill', section: 'TEACHING' },
  { id: 'profile', label: 'Profile', icon: 'bi-person-circle', section: 'ACCOUNT' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isStudent = user?.role === 'student';
  const navItems = isStudent ? studentNav : lecturerNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  const sections = [...new Set(navItems.map(n => n.section))];

  return (
    <nav className={`sidebar sidebar-${user?.role}`}>
      <div className="sidebar-brand">
        <div className={`brand-icon brand-icon-${user?.role}`}>
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <div>
          <div className="brand-name">EduTrack</div>
          <div className="brand-tagline">{isStudent ? 'Student Portal' : 'Faculty Portal'}</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className={`user-avatar user-avatar-${user?.role}`}>{initials}</div>
        <div>
          <div className="user-name">{user?.name}</div>
          <div className="user-id">{isStudent ? user?.studentId : user?.lecturerId}</div>
        </div>
      </div>

      <div className="sidebar-nav">
        {sections.map(section => (
          <div key={section}>
            <div className="nav-section-label">{section}</div>
            {navItems.filter(n => n.section === section).map(item => (
              <button
                key={item.id}
                className={`sidebar-link ${activeTab === item.id ? `active ${user?.role}-active` : ''}`}
                onClick={() => onTabChange(item.id)}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
