import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Initialize theme immediately to prevent flashing
    const savedTheme = localStorage.getItem('eduflow-theme') || 'light';
    // Set theme on document immediately
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
  });

  // Load theme from localStorage on mount (backup)
  useEffect(() => {
    const savedTheme = localStorage.getItem('eduflow-theme') || 'light';
    if (savedTheme !== theme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('eduflow-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  const setThemeMode = useCallback((mode) => {
    setTheme(mode);
    localStorage.setItem('eduflow-theme', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, []);

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export { useTheme, ThemeProvider }; 