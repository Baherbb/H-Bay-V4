import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ApiResponse } from "../types/auth";
import { Permission, RolePermissions } from "../types/permissions";
import notificationService from "../services/notification.service";

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: Permission[];
  login: (token: string, userData: User, userPermissions: Permission[]) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (requiredPermissions: Permission | Permission[]) => boolean;
  handleSocialLoginCallback: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  permissions: [],
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  hasPermission: () => false,
  handleSocialLoginCallback: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedPermissions = localStorage.getItem("permissions");

    if (storedToken && storedUser && storedPermissions) {
      const parsedUser = JSON.parse(storedUser) as User;
      const parsedPermissions = JSON.parse(storedPermissions) as string[];
    
      if (parsedUser.id && parsedUser.email && parsedUser.user_type) {
        setToken(storedToken);
        setUser(parsedUser);
        setPermissions(parsedPermissions.map(p => p as Permission));
        scheduleTokenRefresh();
      } else {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const scheduleTokenRefresh = () => {
    const refreshInterval = (24 * 60 - 5) * 60 * 1000;
    setInterval(refreshAccessToken, refreshInterval);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Token refresh failed");

      const data: ApiResponse = await response.json();
      if (data.status === "success" && data.data?.token) {
        setToken(data.data.token);
        // Convert string[] to Permission[]
        if (data.data.permissions) {
          setPermissions(data.data.permissions.map(p => p as Permission));
          localStorage.setItem("permissions", JSON.stringify(data.data.permissions));
        }
        localStorage.setItem("token", data.data.token);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  const hasPermission = (requiredPermissions: Permission | Permission[]): boolean => {
    if (!user || !permissions || permissions.length === 0) {
        console.log('No user or no permissions');
        return false;
    }

    // For super_admin, always return true
    if (user.user_type === 'super_admin') {
        return true;
    }

    if (Array.isArray(requiredPermissions)) {
        return requiredPermissions.every(permission => 
            permissions.includes(permission)
        );
    }

    return permissions.includes(requiredPermissions);
};


const login = (newToken: string, userData: User, userPermissions: Permission[] = []) => {
  if (!userData.id || !userData.email || !userData.user_type) {
      console.error("Invalid user data");
      return;
  }

    
  const rolePermissions = RolePermissions[userData.user_type];

  setToken(newToken);
  setUser(userData);
  setPermissions(rolePermissions);
  
  localStorage.setItem("token", newToken);
  localStorage.setItem("user", JSON.stringify(userData));
  localStorage.setItem("permissions", JSON.stringify(rolePermissions));
  
  scheduleTokenRefresh();
};

const handleSocialLoginCallback = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/social/callback`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Social login validation failed');
    }

    const data: ApiResponse = await response.json();
    
    if (data.status === 'success' && data.data?.token && data.data?.user) {
      login(data.data.token, data.data.user, data.data.permissions || []);
      navigate('/home');
    }
  } catch (error) {
    console.error('Error during social login callback:', error);
    navigate('/login');
  }
};


const logout = async () => {
  try {
    // Send logout request to the backend
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include", // Include cookies for the request
    });

    if (!response.ok) {
      throw new Error("Logout failed on the server.");
    }

    setToken(null);
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    navigate("/home");
  } catch (error) {
    console.error("Error during logout:", error);
    setToken(null);
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    navigate("/home");
  }
};


  if (isLoading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        permissions,
        login,
        logout,
        isAuthenticated: !!token && !!user,
        hasPermission,
        handleSocialLoginCallback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
