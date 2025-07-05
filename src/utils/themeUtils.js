/**
 * Theme utilities for dynamic color application
 */

/**
 * Check if the current theme is dark mode
 * @returns {boolean} True if dark mode is active
 */
export const isDarkMode = () => {
  return document.documentElement.getAttribute('data-theme') === 'dark' || 
         document.documentElement.classList.contains('dark') ||
         document.querySelector('[data-theme="dark"]') !== null;
};

/**
 * Get theme-aware text color for colored backgrounds
 * @param {string} baseColor - The base color class (e.g., 'text-primary', 'text-accent')
 * @param {string} darkColor - The color to use in dark mode (default: 'white')
 * @returns {string} The appropriate color class
 */
export const getThemeAwareTextColor = (baseColor, darkColor = 'white') => {
  return `${baseColor} [data-theme='dark']:text-${darkColor}`;
};

/**
 * Get theme-aware text color for muted text on colored backgrounds
 * @param {string} baseColor - The base color class (e.g., 'text-text-muted')
 * @param {string} darkColor - The color to use in dark mode (default: 'gray-300')
 * @returns {string} The appropriate color class
 */
export const getThemeAwareMutedColor = (baseColor, darkColor = 'gray-300') => {
  return `${baseColor} [data-theme='dark']:text-${darkColor}`;
};

/**
 * Apply theme-aware styling to an element
 * @param {HTMLElement} element - The element to style
 * @param {string} baseColor - The base color class
 * @param {string} darkColor - The color to use in dark mode
 */
export const applyThemeAwareColor = (element, baseColor, darkColor = 'white') => {
  if (!element) return;
  
  const isDark = isDarkMode();
  const colorClass = isDark ? `text-${darkColor}` : baseColor;
  
  // Remove existing color classes
  element.classList.remove('text-white', 'text-gray-300', 'text-primary', 'text-accent', 'text-success', 'text-warning', 'text-text-muted');
  
  // Add the appropriate color class
  element.classList.add(colorClass);
};

/**
 * Create a theme-aware color class string for colored backgrounds
 * @param {string} colorType - The type of color ('primary', 'accent', 'success', 'warning')
 * @returns {string} The complete class string
 */
export const createThemeAwareColorClass = (colorType) => {
  const colorMap = {
    primary: 'text-primary [data-theme="dark"]:text-white',
    accent: 'text-accent [data-theme="dark"]:text-white',
    success: 'text-success [data-theme="dark"]:text-white',
    warning: 'text-warning [data-theme="dark"]:text-white',
    error: 'text-error [data-theme="dark"]:text-white',
    muted: 'text-text-muted [data-theme="dark"]:text-gray-300'
  };
  
  return colorMap[colorType] || colorMap.primary;
};

/**
 * Observer for theme changes
 * @param {Function} callback - Function to call when theme changes
 * @returns {MutationObserver} The observer instance
 */
export const createThemeObserver = (callback) => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        callback();
      }
    });
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
  
  return observer;
};

/**
 * Utility to get CSS custom property value
 * @param {string} propertyName - The CSS custom property name
 * @returns {string} The computed value
 */
export const getCSSVariable = (propertyName) => {
  return getComputedStyle(document.documentElement).getPropertyValue(propertyName);
};

/**
 * Set CSS custom property value
 * @param {string} propertyName - The CSS custom property name
 * @param {string} value - The value to set
 */
export const setCSSVariable = (propertyName, value) => {
  document.documentElement.style.setProperty(propertyName, value);
}; 