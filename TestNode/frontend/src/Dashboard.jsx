import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data on component mount
    axios.get('http://localhost:8081/get-user-data', { withCredentials: true })
      .then(response => {
        setUserData(response.data);
      })
      .catch(err => {
        console.error(err);
        navigate('/login');
      });
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData.name}</h2>
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {/* Display user's recent activity */}
        <ul>
          {userData.recentActivity && userData.recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
      <div className="notifications">
        <h3>Notifications</h3>
        {/* Display notifications */}
        <ul>
          {userData.notifications && userData.notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
