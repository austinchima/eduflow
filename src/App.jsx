import React, { useState } from "react";
import Routes from "./Routes";
import { UserProvider, useUser } from "./context/UserContext";
import UserSetup from "./components/UserSetup";

function AppContent() {
  const { user, isLoading } = useUser();
  const [setupComplete, setSetupComplete] = useState(false);

  // Show loading while user data is being loaded
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  // Show setup for new users
  if (!setupComplete && (!user.name || user.name === 'New Student')) {
    return <UserSetup onComplete={() => setSetupComplete(true)} />;
  }

  // Show main app
  return <Routes />;
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
