import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Permission } from '../types/permissions';

interface PermissionRouteProps {
  children: React.ReactNode;
  requiredPermissions: Permission[];
}

const PermissionRoute: React.FC<PermissionRouteProps> = ({
  children,
  requiredPermissions
}) => {
  const { hasPermission, user } = useAuth();

  if (!user || !hasPermission(requiredPermissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PermissionRoute;
