import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom';

function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-page">
      <h1>Welcome to the Admin Dashboard, {user ? user.email : 'Guest'}!</h1>
      <p>Your role: {user ? user.role : 'N/A'}</p>

      <div className="dashboard-navigation">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/agents" className="action-btn">
            <span className="btn-icon">👥</span>
            Manage Agents
          </Link>
          <Link to="/upload-list" className="action-btn">
            <span className="btn-icon">📤</span>
            Upload & Distribute Lists
          </Link>
        </div>
      </div>

      <section className="dashboard-summary">
        <h2>Quick Overview</h2>
        <p>This is where you'd put widgets or charts summarizing data.</p>
      </section>
    </div>
  );
}

export default DashboardPage;