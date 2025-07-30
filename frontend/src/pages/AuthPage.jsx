import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Navigate, Link } from 'react-router-dom';

function AuthPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="auth-page">
      <h1>Admin Login</h1>
      <LoginForm />
      <div className="auth-footer">
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;