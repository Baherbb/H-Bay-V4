import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, Loader } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');
    const error = searchParams.get('error');

    if (error) {
      setError(`Authentication failed: ${error}`);
      setTimeout(() => navigate('/signin'), 3000);
      return;
    }

    if (token) {
      // Store the token securely
      localStorage.setItem('token', token);
      
      // Optional: Validate token before redirecting
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          throw new Error('Token expired');
        }
      } catch (err) {
        setError('Invalid authentication token');
        setTimeout(() => navigate('/signin'), 3000);
        return;
      }

      // Redirect to home
      navigate('/home');
    } else {
      setError('No authentication token received');
      setTimeout(() => navigate('/signin'), 3000);
    }
  }, [navigate, searchParams]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <Loader className="h-8 w-8 animate-spin text-orange-500 mb-4" />
      <p className="text-gray-600">Completing authentication...</p>
    </div>
  );
};

export default AuthCallback;