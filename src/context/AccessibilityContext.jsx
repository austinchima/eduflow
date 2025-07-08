import React, { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState({
    largeText: false,
    reducedMotion: false,
    screenReader: false,
  });

  // Apply CSS classes to <body> based on settings
  useEffect(() => {
    const body = document.body;
    body.classList.toggle("large-text", settings.largeText);
    body.classList.toggle("reduced-motion", settings.reducedMotion);
    body.classList.toggle("screen-reader-mode", settings.screenReader);
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, setSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
} 