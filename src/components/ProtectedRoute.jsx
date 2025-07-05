import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (!user || !user.id) {
        // Not authenticated, redirect to auth page
        navigate('/auth');
      } else {
        // User is authenticated, allow access
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, navigate]);

  if (loading) {
    // Render a loading indicator while checking
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
  if (user && user.id) {
    return <>{children}</>;
  }

  // Otherwise, return null (redirection is handled in useEffect)
  return null;
};

export default ProtectedRoute;