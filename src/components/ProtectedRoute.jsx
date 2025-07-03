import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../services/dataService';

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      setLoading(true);
      if (!user) {
        // Not authenticated, redirect to auth page
        navigate('/auth');
      } else {
        try {
          // User is authenticated, check profile completeness
          const complete = await dataService.checkProfileComplete(user.id);
          setIsProfileComplete(complete);
          if (!complete) {
            // Profile is not complete, redirect to setup page
            navigate('/setup');
          }
        } catch (error) {
          console.error('Error checking profile completeness:', error);
          // Handle error (e.g., redirect to an error page or auth)
          navigate('/auth'); // Redirect to auth on error
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuthAndProfile();
  }, [user, navigate]); // Re-run effect if user or navigate changes

  if (loading) {
    // Render a loading indicator while checking
    return <div>Loading...</div>; // Replace with your preferred loading component
  }

  // If authenticated and profile is complete, render children
  if (user && isProfileComplete) {
    return <>{children}</>;
  }

  // Otherwise, return null (redirection is handled in useEffect)
  return null;
};

export default ProtectedRoute;