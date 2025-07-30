import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !user.role) {
      console.warn('User missing role information');
      return <Navigate to="/dashboard" replace />;
    }

    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      console.warn(`User role '${user.role}' not authorized for this route`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
}

export default PrivateRoute;