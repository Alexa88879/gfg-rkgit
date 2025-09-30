import { collection, addDoc, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Export History Service
 * Manages export history tracking in Firestore
 */

// Export history document structure
export const EXPORT_HISTORY_SCHEMA = {
  // Document ID: auto-generated
  id: 'string', // Document ID
  exportId: 'string', // Unique export identifier
  adminUserId: 'string', // ID of admin who performed export
  adminEmail: 'string', // Email of admin who performed export
  adminRole: 'string', // Role of admin (super_admin, admin, moderator)
  exportType: 'string', // Type of data exported (feedback, applications, users)
  exportFormat: 'string', // Format of export (excel, html, csv, pdf)
  filename: 'string', // Name of exported file
  recordCount: 'number', // Number of records exported
  selectedFields: 'array', // Fields that were selected for export
  filters: 'object', // Any filters applied during export
  exportSize: 'number', // Size of exported file in bytes (if available)
  status: 'string', // Export status (success, failed, cancelled)
  errorMessage: 'string', // Error message if export failed
  ipAddress: 'string', // IP address of admin (for security tracking)
  userAgent: 'string', // User agent string
  timestamp: 'timestamp', // When export was performed
  createdAt: 'timestamp', // Document creation time
  updatedAt: 'timestamp' // Document last update time
};

/**
 * Log an export activity to the database
 * @param {Object} exportData - Export details
 * @param {string} exportData.adminUserId - Admin user ID
 * @param {string} exportData.adminEmail - Admin email
 * @param {string} exportData.adminRole - Admin role
 * @param {string} exportData.exportType - Type of data exported
 * @param {string} exportData.exportFormat - Export format
 * @param {string} exportData.filename - Export filename
 * @param {number} exportData.recordCount - Number of records
 * @param {Array} exportData.selectedFields - Selected fields
 * @param {Object} exportData.filters - Applied filters
 * @param {string} exportData.status - Export status
 * @param {string} exportData.errorMessage - Error message if failed
 * @returns {Promise<Object>} - Created export history document
 */
export const logExportActivity = async (exportData) => {
  try {
    const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const historyData = {
      exportId,
      adminUserId: exportData.adminUserId,
      adminEmail: exportData.adminEmail,
      adminRole: exportData.adminRole,
      exportType: exportData.exportType,
      exportFormat: exportData.exportFormat,
      filename: exportData.filename,
      recordCount: exportData.recordCount || 0,
      selectedFields: exportData.selectedFields || [],
      filters: exportData.filters || {},
      exportSize: exportData.exportSize || 0,
      status: exportData.status || 'success',
      errorMessage: exportData.errorMessage || null,
      ipAddress: exportData.ipAddress || 'unknown',
      userAgent: exportData.userAgent || 'unknown',
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'export-history'), historyData);
    
    //console.log('Export activity logged:', docRef.id);
    return { success: true, id: docRef.id, exportId };
  } catch (error) {
    console.error('Error logging export activity:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get export history for a specific admin user
 * @param {string} adminUserId - Admin user ID
 * @param {number} limitCount - Number of records to fetch (default: 50)
 * @returns {Promise<Array>} - Array of export history records
 */
export const getExportHistoryByUser = async (adminUserId, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'export-history'),
      where('adminUserId', '==', adminUserId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Error fetching export history:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get all export history (super admin only)
 * @param {number} limitCount - Number of records to fetch (default: 100)
 * @returns {Promise<Array>} - Array of all export history records
 */
export const getAllExportHistory = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, 'export-history'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Error fetching all export history:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get export history by date range (super admin only)
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} limitCount - Number of records to fetch (default: 100)
 * @returns {Promise<Array>} - Array of export history records
 */
export const getExportHistoryByDateRange = async (startDate, endDate, limitCount = 100) => {
  try {
    const q = query(
      collection(db, 'export-history'),
      where('timestamp', '>=', startDate),
      where('timestamp', '<=', endDate),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const history = [];

    querySnapshot.forEach((doc) => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, data: history };
  } catch (error) {
    console.error('Error fetching export history by date range:', error);
    return { success: false, error: error.message, data: [] };
  }
};

/**
 * Get export statistics (super admin only)
 * @returns {Promise<Object>} - Export statistics
 */
export const getExportStatistics = async () => {
  try {
    const q = query(
      collection(db, 'export-history'),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const stats = {
      totalExports: 0,
      successfulExports: 0,
      failedExports: 0,
      exportsByFormat: {},
      exportsByType: {},
      exportsByUser: {},
      totalRecordsExported: 0,
      lastExportDate: null
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stats.totalExports++;
      
      if (data.status === 'success') {
        stats.successfulExports++;
      } else {
        stats.failedExports++;
      }

      // Count by format
      stats.exportsByFormat[data.exportFormat] = (stats.exportsByFormat[data.exportFormat] || 0) + 1;
      
      // Count by type
      stats.exportsByType[data.exportType] = (stats.exportsByType[data.exportType] || 0) + 1;
      
      // Count by user
      stats.exportsByUser[data.adminEmail] = (stats.exportsByUser[data.adminEmail] || 0) + 1;
      
      // Total records
      stats.totalRecordsExported += data.recordCount || 0;
      
      // Last export date
      if (!stats.lastExportDate || data.timestamp > stats.lastExportDate) {
        stats.lastExportDate = data.timestamp;
      }
    });

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error fetching export statistics:', error);
    return { success: false, error: error.message, data: null };
  }
};

/**
 * Get client information for security tracking
 * @returns {Object} - Client information
 */
export const getClientInfo = () => {
  return {
    ipAddress: 'unknown', // Will be populated by server-side logic if available
    userAgent: navigator.userAgent || 'unknown',
    timestamp: new Date()
  };
};

/**
 * Format export history for display
 * @param {Array} history - Export history array
 * @returns {Array} - Formatted history
 */
export const formatExportHistory = (history) => {
  return history.map(item => ({
    ...item,
    timestamp: item.timestamp?.toDate ? item.timestamp.toDate() : new Date(item.timestamp),
    createdAt: item.createdAt?.toDate ? item.createdAt.toDate() : new Date(item.createdAt),
    updatedAt: item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date(item.updatedAt),
    formattedTimestamp: item.timestamp?.toDate ? 
      item.timestamp.toDate().toLocaleString() : 
      new Date(item.timestamp).toLocaleString(),
    formattedSize: item.exportSize ? formatFileSize(item.exportSize) : 'Unknown',
    statusColor: getStatusColor(item.status)
  }));
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get status color for UI display
 * @param {string} status - Export status
 * @returns {string} - CSS color class
 */
const getStatusColor = (status) => {
  switch (status) {
    case 'success':
      return 'text-success';
    case 'failed':
      return 'text-error';
    case 'cancelled':
      return 'text-warning';
    default:
      return 'text-muted-foreground';
  }
};
