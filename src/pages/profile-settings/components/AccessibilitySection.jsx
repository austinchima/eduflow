import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useUser } from '../../../context/UserContext';

const AccessibilitySection = () => {
  const { user, actions } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    keyboardNavigation: true,
    colorBlindSupport: false
  });

  // Initialize accessibility settings when user data loads
  useEffect(() => {
    if (user?.accessibility) {
      setAccessibilitySettings({
        highContrast: user.accessibility.highContrast ?? false,
        largeText: user.accessibility.largeText ?? false,
        screenReader: user.accessibility.screenReader ?? false,
        reducedMotion: user.accessibility.reducedMotion ?? false,
        keyboardNavigation: user.accessibility.keyboardNavigation ?? true,
        colorBlindSupport: user.accessibility.colorBlindSupport ?? false
      });
    }
  }, [user]);

  const handleAccessibilityChange = (setting, value) => {
    setAccessibilitySettings(prev => ({ ...prev, [setting]: value }));
    setHasChanges(true);
    // Apply changes immediately for better UX
    applyAccessibilitySettings({ ...accessibilitySettings, [setting]: value });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await actions.updateAccessibility(accessibilitySettings);
      setHasChanges(false);
      console.log('Accessibility settings updated successfully');
    } catch (error) {
      console.error('Failed to update accessibility settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const applyAccessibilitySettings = (settings = accessibilitySettings) => {
    const html = document.documentElement;
    
    // Apply high contrast
    if (settings.highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }

    // Apply large text
    if (settings.largeText) {
      html.classList.add('large-text');
      html.style.fontSize = '18px';
    } else {
      html.classList.remove('large-text');
      html.style.fontSize = '16px';
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      html.classList.add('reduce-motion');
      html.style.setProperty('--transition-duration', '0.1s');
    } else {
      html.classList.remove('reduce-motion');
      html.style.removeProperty('--transition-duration');
    }

    // Apply color blind support
    if (settings.colorBlindSupport) {
      html.classList.add('colorblind-support');
    } else {
      html.classList.remove('colorblind-support');
    }

    // Apply keyboard navigation
    if (settings.keyboardNavigation) {
      html.classList.add('keyboard-navigation');
    } else {
      html.classList.remove('keyboard-navigation');
    }
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      highContrast: false,
      largeText: false,
      screenReader: false,
      reducedMotion: false,
      keyboardNavigation: true,
      colorBlindSupport: false
    };
    setAccessibilitySettings(defaultSettings);
    setHasChanges(true);
    applyAccessibilitySettings(defaultSettings);
  };

  // Apply settings on mount
  useEffect(() => {
    applyAccessibilitySettings();
  }, []);

  if (!user) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading accessibility settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg lg:text-xl font-semibold text-text-primary mb-1 lg:mb-2">Accessibility</h2>
          <p className="text-sm lg:text-base text-text-secondary">Customize the interface to meet your accessibility needs</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={resetToDefaults}
            size="sm"
            iconName="RotateCcw"
            className="w-full sm:w-auto"
            disabled={isSaving}
          >
            Reset
          </Button>
          {hasChanges && (
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              size="sm"
              iconName={isSaving ? "Loader" : "Save"}
              className="w-full sm:w-auto"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Visual Accessibility */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Eye" size={18} className="mr-2" />
            Visual Accessibility
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">High Contrast Mode</p>
                <p className="text-sm text-text-secondary">Increase contrast for better readability</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.highContrast}
                  onChange={(e) => handleAccessibilityChange('highContrast', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Large Text</p>
                <p className="text-sm text-text-secondary">Increase font size throughout the application</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.largeText}
                  onChange={(e) => handleAccessibilityChange('largeText', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Color Blind Support</p>
                <p className="text-sm text-text-secondary">Use color-blind friendly color schemes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.colorBlindSupport}
                  onChange={(e) => handleAccessibilityChange('colorBlindSupport', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Motion & Interaction */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Zap" size={18} className="mr-2" />
            Motion & Interaction
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Reduced Motion</p>
                <p className="text-sm text-text-secondary">Minimize animations and transitions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.reducedMotion}
                  onChange={(e) => handleAccessibilityChange('reducedMotion', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Keyboard Navigation</p>
                <p className="text-sm text-text-secondary">Enable enhanced keyboard navigation support</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.keyboardNavigation}
                  onChange={(e) => handleAccessibilityChange('keyboardNavigation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Screen Reader Support */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Volume2" size={18} className="mr-2" />
            Screen Reader Support
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-text-primary">Screen Reader Mode</p>
                <p className="text-sm text-text-secondary">Optimize interface for screen readers</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={accessibilitySettings.screenReader}
                  onChange={(e) => handleAccessibilityChange('screenReader', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="border border-border-light rounded-lg p-4">
          <h3 className="text-base lg:text-lg font-medium text-text-primary mb-4 flex items-center">
            <Icon name="Keyboard" size={18} className="mr-2" />
            Keyboard Shortcuts
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Navigate to Dashboard:</span>
                <kbd className="px-2 py-1 bg-secondary-100 rounded text-xs">Ctrl + 1</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Open Study Tools:</span>
                <kbd className="px-2 py-1 bg-secondary-100 rounded text-xs">Ctrl + 2</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Toggle High Contrast:</span>
                <kbd className="px-2 py-1 bg-secondary-100 rounded text-xs">Ctrl + H</kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Toggle Large Text:</span>
                <kbd className="px-2 py-1 bg-secondary-100 rounded text-xs">Ctrl + L</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySection;