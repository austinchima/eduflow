import React from "react";
import { useAccessibility } from "../context/AccessibilityContext";

export default function AccessibilitySettings() {
  const { settings, setSettings } = useAccessibility();

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div>
      <h2>Visual Accessibility</h2>
      <label>
        <input
          type="checkbox"
          checked={settings.highContrast}
          onChange={() => handleToggle("highContrast")}
        />
        High Contrast Mode
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.largeText}
          onChange={() => handleToggle("largeText")}
        />
        Large Text
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.colorBlind}
          onChange={() => handleToggle("colorBlind")}
        />
        Color Blind Support
      </label>

      <h2>Motion & Interaction</h2>
      <label>
        <input
          type="checkbox"
          checked={settings.reducedMotion}
          onChange={() => handleToggle("reducedMotion")}
        />
        Reduced Motion
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.keyboardNav}
          onChange={() => handleToggle("keyboardNav")}
        />
        Keyboard Navigation
      </label>

      <h2>Screen Reader Support</h2>
      <label>
        <input
          type="checkbox"
          checked={settings.screenReader}
          onChange={() => handleToggle("screenReader")}
        />
        Screen Reader Mode
      </label>
    </div>
  );
} 