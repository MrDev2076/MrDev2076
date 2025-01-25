import React from 'react';
import { Link } from 'react-router-dom';
import '/src/Register.css';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

  // If no user is authenticated, do not render the Navbar
  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyApp</Link>
      </div>
      <ul className="navbar-menu">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        {user?.role === 'Admin' && (
          <li className="navbar-item">
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
        <li className="navbar-item">
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
