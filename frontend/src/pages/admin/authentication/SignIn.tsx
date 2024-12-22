import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { ApiResponse } from "../../../types/auth";
import { Permission, RolePermissions } from "../../../types/permissions";

interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { login, hasPermission } = useAuth();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Login failed");
        }

        const data: ApiResponse = await response.json();

        if (data.data?.token && data.data?.user) {
          const { user, permissions = [] } = data.data;
          
          // Login with permissions
          await login(data.data.token, user, permissions as Permission[]);
  
          // Navigate based on role
          switch(user.user_type) {
              case 'super_admin':
              case 'admin':
                  navigate('/adminAuth/dashboard');
                  break;
              case 'employee':
                  navigate('/adminAuth/products'); // Or whatever default page for employees
                  break;
              default:
                  navigate('/unauthorized');
          }
      }
        
    } catch (err) {
        console.error('Login error:', err);
        setError(
            err instanceof Error ? err.message : "An error occurred during login"
        );
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-auto space-y-6">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="text-gray-600 text-sm">Access your dashboard</p>
        </div>
        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
