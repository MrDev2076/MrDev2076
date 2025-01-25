import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './Home';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard'; 
import Dashboard from './Dashboard';
import Test from './Test';


// Role-based Route Protection Component
const ProtectedRoute = ({ children, roleRequired }) => {
  const role = localStorage.getItem('role'); // Fetch the user's role from localStorage
  return role === roleRequired ? children : <Navigate to="/" />;
};

function AppContent() {
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Render Navbar on all routes except login, register, and forgot-password */}
      {!['/login', '/register', '/forgot-password'].includes(location.pathname) && <Navbar />}
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Test" element={<Test />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
