/**
 * Date utility functions for handling various date formats
 * including Firestore Timestamps, regular dates, and date strings
 */

/**
 * Format a date value to a readable string
 * Handles Firestore Timestamps, regular Date objects, and date strings
 * @param {any} dateValue - The date value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string or 'N/A'/'Invalid Date'
 */
export const formatDate = (dateValue, options = {}) => {
  if (!dateValue) return 'N/A';
  
  try {
    let date;
    
    // Handle Firestore Timestamp objects (with toDate method)
    if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
      date = dateValue.toDate();
    }
    // Handle Firestore Timestamp with seconds/nanoseconds
    else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      date = new Date(dateValue.seconds * 1000);
    }
    // Handle regular date strings or Date objects
    else {
      date = new Date(dateValue);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    
    // Default formatting options
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };
    
    return date.toLocaleDateString('en-US', defaultOptions);
  } catch (error) {
    console.error('Date formatting error:', error, 'Date value:', dateValue);
    return 'Invalid Date';
  }
};

/**
 * Format date for display in tables (shorter format)
 * @param {any} dateValue - The date value to format
 * @returns {string} Formatted date string
 */
export const formatDateShort = (dateValue) => {
  return formatDate(dateValue, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date with time for detailed views
 * @param {any} dateValue - The date value to format
 * @returns {string} Formatted date string with time
 */
export const formatDateTime = (dateValue) => {
  return formatDate(dateValue, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Check if a date value is a Firestore Timestamp
 * @param {any} dateValue - The value to check
 * @returns {boolean} True if it's a Firestore Timestamp
 */
export const isFirestoreTimestamp = (dateValue) => {
  return dateValue && 
         typeof dateValue === 'object' && 
         (dateValue.toDate || dateValue.seconds);
};

/**
 * Convert any date value to a JavaScript Date object
 * @param {any} dateValue - The date value to convert
 * @returns {Date|null} JavaScript Date object or null if invalid
 */
export const toDate = (dateValue) => {
  if (!dateValue) return null;
  
  try {
    // Handle Firestore Timestamp objects
    if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
      return dateValue.toDate();
    }
    // Handle Firestore Timestamp with seconds/nanoseconds
    else if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
      return new Date(dateValue.seconds * 1000);
    }
    // Handle regular date strings or Date objects
    else {
      const date = new Date(dateValue);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (error) {
    console.error('Date conversion error:', error, 'Date value:', dateValue);
    return null;
  }
};
