import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../types/permissions';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    requiredPermissions?: Permission[];
  }
  
  const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = [],
    requiredPermissions = []
  }) => {
    const { isAuthenticated, user, hasPermission } = useAuth();
    const location = useLocation();
  
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.user_type)) {
      return <Navigate to="/unauthorized" replace />;
    }

    if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

