import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('ProtectedRoute: Checking authentication', { isLoading, user: !!user, userId: user?.id });
      // Wait for the user context to finish loading
      if (isLoading) {
        console.log('ProtectedRoute: Still loading, waiting...');
        return;
      }

      setLoading(true);
      
      // Check if user is authenticated (has both user data and token)
      const token = localStorage.getItem('token');
      console.log('ProtectedRoute: Auth check', { hasUser: !!user, hasUserId: !!(user && user.id), hasToken: !!token });
      if (!user || !user.id || !token) {
        // Not authenticated, redirect to auth page
        console.log('ProtectedRoute: Not authenticated, redirecting to /auth');
        navigate('/auth');
      } else {
        // User is authenticated, allow access
        console.log('ProtectedRoute: Authenticated, allowing access');
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, isLoading, navigate]);

  // Show loading while user context is loading or we're checking auth
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, render children
  if (user && user.id && localStorage.getItem('token')) {
    return <>{children}</>;
  }

  // Otherwise, return null (redirection is handled in useEffect)
  return null;
};

export default ProtectedRoute;