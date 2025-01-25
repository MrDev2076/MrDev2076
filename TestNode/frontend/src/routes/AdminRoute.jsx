// frontend/src/routes/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'Admin') {
    return <Navigate to="/AdminDashboard" />;
  }

  return children;
};

export default AdminRoute;
