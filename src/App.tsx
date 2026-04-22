import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import LoginPage from './pages/LoginPage';
import StudentPortal from './pages/student/StudentPortal';
import LecturerPortal from './pages/lecturer/LecturerPortal';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/main.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AttendanceProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/student/*"
              element={
                <ProtectedRoute role="student">
                  <StudentPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lecturer/*"
              element={
                <ProtectedRoute role="lecturer">
                  <LecturerPortal />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AttendanceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
