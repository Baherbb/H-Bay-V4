import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiResponse } from '../types/auth';
interface FormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSocialLoginLoading, setIsSocialLoginLoading] = useState<boolean>(false);
  const { handleSocialLoginCallback } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const { login } = useAuth();

  const handleEmailLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data: ApiResponse = await response.json();
  
      if (data.data?.token && data.data?.user) {
        login(data.data.token, data.data.user, data.data.permissions || []);
        navigate('/home');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setIsSocialLoginLoading(true);
    sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
    window.location.href = `${API_BASE_URL}/api/auth/${provider}?redirect=${encodeURIComponent(window.location.origin + '/login?social-callback=true')}`;
  };
  useEffect(() => {
    const isCallback = new URLSearchParams(location.search).has('social-callback');
    if (isCallback) {
      setIsSocialLoginLoading(true);
      handleSocialLoginCallback()
        .catch(console.error)
        .finally(() => setIsSocialLoginLoading(false));
    }
  }, [location, handleSocialLoginCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 to-orange-700 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-auto space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-sm">Sign in to continue</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-4">
        <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            disabled={isSocialLoginLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-orange-500 hover:shadow-md transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSocialLoginLoading ? (
              <span>Loading...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  />
                </svg>
                <span className="text-gray-600 group-hover:text-gray-900">Continue with Google</span>
              </>
            )}
          </button>
          <button 
          onClick={() => handleSocialLogin('facebook')}
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-orange-500 hover:shadow-md transition-all duration-300 group"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            <span className="text-gray-600 group-hover:text-gray-900">Continue with Facebook</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
          </div>
        </div>
        {/* Form Section */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">Email Address</label>
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
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Link 
                to="/forgot-password" 
                className="text-sm text-orange-600 hover:text-orange-700"
                tabIndex={isLoading ? -1 : 0}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-orange-600 hover:text-orange-700 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;