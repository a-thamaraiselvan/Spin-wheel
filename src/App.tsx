import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegistrationPage from './components/RegistrationPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import SpinWheel from './components/SpinWheel';
import HallMode from './components/HallMode';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Routes>
          <Route path="/" element={<RegistrationPage />} />
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? 
                <Navigate to="/admin/dashboard" replace /> : 
                <AdminLogin onLogin={setIsAuthenticated} />
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              isAuthenticated ? 
                <AdminDashboard /> : 
                <Navigate to="/admin" replace />
            } 
          />
          <Route 
            path="/admin/spin/:staffId" 
            element={
              isAuthenticated ? 
                <SpinWheel /> : 
                <Navigate to="/admin" replace />
            } 
          />
          <Route 
            path="/admin/hall-mode" 
            element={
              isAuthenticated ? 
                <HallMode /> : 
                <Navigate to="/admin" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;