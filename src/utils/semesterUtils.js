/**
 * Utility functions for managing semester lists
 * Automatically generates current and upcoming semesters
 */

/**
 * Get the current academic year
 * @returns {number} Current academic year
 */
export const getCurrentAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // January is 0
  
  // Academic year typically starts in Fall (September)
  // If we're in January-August, use the previous year as the academic year start
  if (month >= 1 && month <= 8) {
    return year - 1;
  }
  return year;
};

/**
 * Get the current semester based on date
 * @returns {string} Current semester (e.g., 'Fall 2024')
 */
export const getCurrentSemester = () => {
  const now = new Date();
  const month = now.getMonth() + 1; // January is 0
  const year = getCurrentAcademicYear();
  
  if (month >= 1 && month <= 4) {
    return `Winter ${year + 1}`;
  } else if (month >= 5 && month <= 8) {
    return `Summer ${year + 1}`;
  } else {
    return `Fall ${year + 1}`;
  }
};

/**
 * Generate a list of semesters for the past 3 years and next 2 years
 * @returns {string[]} Array of semester strings
 */
export const generateSemesterList = () => {
  const currentYear = getCurrentAcademicYear();
  const semesters = [];
  
  // Generate semesters for the past 3 years and next 2 years
  for (let year = currentYear - 2; year <= currentYear + 2; year++) {
    semesters.push(`Fall ${year + 1}`);
    semesters.push(`Summer ${year + 1}`);
    semesters.push(`Winter ${year + 1}`);
  }
  
  // Remove duplicates and sort in reverse chronological order
  return [...new Set(semesters)].sort((a, b) => {
    const yearA = parseInt(a.split(' ')[1]);
    const yearB = parseInt(b.split(' ')[1]);
    const seasonA = a.split(' ')[0];
    const seasonB = b.split(' ')[0];
    
    if (yearA !== yearB) {
      return yearB - yearA;
    }
    
    // Order: Fall, Summer, Winter
    const seasonOrder = { 'Fall': 3, 'Summer': 2, 'Winter': 1 };
    return seasonOrder[seasonB] - seasonOrder[seasonA];
  });
};

/**
 * Generate a list of semesters for course filters (includes "All Semesters")
 * @returns {string[]} Array of semester strings with "All Semesters" option
 */
export const generateFilterSemesterList = () => {
  return ['All Semesters', ...generateSemesterList()];
};

/**
 * Check if a semester is in the future
 * @param {string} semester - Semester string (e.g., 'Fall 2024')
 * @returns {boolean} True if semester is in the future
 */
export const isFutureSemester = (semester) => {
  const currentSemester = getCurrentSemester();
  const semesterList = generateSemesterList();
  
  const currentIndex = semesterList.indexOf(currentSemester);
  const targetIndex = semesterList.indexOf(semester);
  
  return targetIndex < currentIndex;
};

/**
 * Get the next semester
 * @returns {string} Next semester
 */
export const getNextSemester = () => {
  const currentSemester = getCurrentSemester();
  const semesterList = generateSemesterList();
  const currentIndex = semesterList.indexOf(currentSemester);
  
  if (currentIndex > 0) {
    return semesterList[currentIndex - 1];
  }
  
  // If we can't find the current semester, return the first one in the list
  return semesterList[0];
};

/**
 * Get semester display name with current indicator
 * @param {string} semester - Semester string
 * @returns {string} Display name with current indicator if applicable
 */
export const getSemesterDisplayName = (semester) => {
  const currentSemester = getCurrentSemester();
  
  if (semester === currentSemester) {
    return `${semester} (Current)`;
  }
  
  if (isFutureSemester(semester)) {
    return `${semester} (Upcoming)`;
  }
  
  return semester;
};

/**
 * Get semester color class based on status
 * @param {string} semester - Semester string
 * @returns {string} Tailwind CSS color class
 */
export const getSemesterColorClass = (semester) => {
  const currentSemester = getCurrentSemester();
  
  if (semester === currentSemester) {
    return 'text-primary font-semibold';
  }
  
  if (isFutureSemester(semester)) {
    return 'text-accent';
  }
  
  return 'text-text-secondary';
};

export default {
  getCurrentAcademicYear,
  getCurrentSemester,
  generateSemesterList,
  generateFilterSemesterList,
  isFutureSemester,
  getNextSemester,
  getSemesterDisplayName,
  getSemesterColorClass
}; 