import React, { useState } from "react";
import Routes from "./Routes";
import { UserProvider, useUser } from "./context/UserContext";
import { ThemeProvider } from "./context/ThemeContext";
import UserSetup from "./components/UserSetup";
import AuthPage from "./pages/auth";
import { AccessibilityProvider } from "./context/AccessibilityContext";

function AppContent() {
  const { user, isLoading } = useUser();
  const [setupComplete, setSetupComplete] = useState(false);

  // Show loading while user data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center transition-all duration-300 ease-in-out">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated (has a token and user ID)
  const isAuthenticated = user && user.id && localStorage.getItem('token');
  
  // If not authenticated, show auth page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
        <AuthPage />
      </div>
    );
  }

  // Check if this is a new user (just signed up) by checking if they have default preferences
  const isNewUser = !user.preferences?.hasCompletedSetup || 
                   (user.preferences?.studyGoal === 5 && 
                    user.preferences?.notifications === true && 
                    user.preferences?.theme === 'light' &&
                    !user.preferences?.hasCompletedSetup);

  // If new user and hasn't completed setup, show UserSetup
  if (isNewUser && !setupComplete) {
    return (
      <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
        <UserSetup onComplete={() => setSetupComplete(true)} />
      </div>
    );
  }

  // Show main app for authenticated users
  return (
    <div className="min-h-screen bg-background transition-all duration-300 ease-in-out">
      <Routes />
    </div>
  );
}

function App() {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}

export default App;
