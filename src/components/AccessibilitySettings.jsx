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
          checked={settings.largeText}
          onChange={() => handleToggle("largeText")}
        />
        Large Text
      </label>
      <label>
        <input
          type="checkbox"
          checked={settings.reducedMotion}
          onChange={() => handleToggle("reducedMotion")}
        />
        Reduced Motion
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