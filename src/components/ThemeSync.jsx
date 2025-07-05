import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { dataService } from '../services/dataService';

const ThemeSync = () => {
  const { theme, setThemeMode } = useTheme();
  const { user, actions } = useUser();
  const lastSyncedTheme = useRef(theme);

  // Sync with user's backend theme preference when user loads (only once)
  useEffect(() => {
    if (user?.preferences?.theme && user.preferences.theme !== theme) {
      setThemeMode(user.preferences.theme);
      lastSyncedTheme.current = user.preferences.theme;
    }
  }, [user?.preferences?.theme]); // Only depend on user theme, not current theme

  // Update backend when theme changes and user is authenticated (debounced)
  useEffect(() => {
    if (user?.id && theme !== lastSyncedTheme.current) {
      const updateBackendTheme = async () => {
        try {
          await dataService.updateUserProfile(user.id, { theme });
          actions.updateTheme(theme);
          lastSyncedTheme.current = theme;
        } catch (error) {
          console.error('Failed to save theme preference to backend:', error);
        }
      };
      
      // Debounce the update to prevent rapid calls
      const timeoutId = setTimeout(updateBackendTheme, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [theme, user?.id]);

  return null; // This component doesn't render anything
};

export default ThemeSync; 