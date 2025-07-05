import React, { createContext, useContext, useEffect, useState } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState({
    highContrast: false,
    largeText: false,
    colorBlind: false,
    reducedMotion: false,
    keyboardNav: false,
    screenReader: false,
  });

  // Apply CSS classes to <body> based on settings
  useEffect(() => {
    const body = document.body;
    body.classList.toggle("high-contrast", settings.highContrast);
    body.classList.toggle("large-text", settings.largeText);
    body.classList.toggle("color-blind", settings.colorBlind);
    body.classList.toggle("reduced-motion", settings.reducedMotion);
    body.classList.toggle("keyboard-nav", settings.keyboardNav);
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