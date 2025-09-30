import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { logExportActivity, getClientInfo } from './exportHistoryService';

// Export to Excel
export const exportToExcel = (data, filename = 'export', selectedFields = []) => {
  try {
    // Filter data based on selected fields
    const filteredData = selectedFields.length > 0 
      ? data.map(item => {
          const filtered = {};
          selectedFields.forEach(field => {
            if (item[field] !== undefined) {
              filtered[field] = item[field];
            }
          });
          return filtered;
        })
      : data;

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(filteredData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    // Generate Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return { success: true, message: 'Excel file exported successfully' };
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return { success: false, message: 'Error exporting to Excel' };
  }
};


// Export to HTML
export const exportToHTML = (data, filename = 'export', selectedFields = [], title = 'Data Export') => {
  try {
    const fields = selectedFields.length > 0 ? selectedFields : Object.keys(data[0] || {});
    
    // Create HTML table with proper styling
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #ffffff;
          }
          h1 { 
            color: #333; 
            font-size: 24px;
            margin-bottom: 10px;
          }
          .date {
            color: #666;
            font-size: 14px;
            margin-bottom: 20px;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin-top: 20px; 
            font-size: 12px;
          }
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            vertical-align: top;
          }
          th { 
            background-color: #f2f2f2; 
            font-weight: bold; 
            color: #333;
          }
          tr:nth-child(even) { 
            background-color: #f9f9f9; 
          }
          tr:nth-child(odd) {
            background-color: #ffffff;
          }
          tr:hover {
            background-color: #f5f5f5;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="date">Generated on: ${new Date().toLocaleDateString()}</div>
        <table>
          <thead>
            <tr>
              ${fields.map(field => {
                // Column headers - match HTML exactly
                const headerMap = {
                  'fullName': 'FullName',
                  'email': 'Email',
                  'phone': 'Phone',
                  'rollNumber': 'RollNumber',
                  'contactNumber': 'ContactNumber',
                  'department': 'Department',
                  'year': 'Year',
                  'section': 'Section',
                  'overallExperience': 'OverallExperience',
                  'ratings': 'Ratings',
                  'timestamp': 'Timestamp',
                  'domainInterest': 'DomainInterest',
                  'timeCommitment': 'TimeCommitment',
                  'status': 'Status',
                  'motivation': 'Motivation',
                  'previousExperience': 'PreviousExperience',
                  'submissionId': 'SubmissionId',
                  'branch': 'Branch',
                  'yearOfStudy': 'YearOfStudy',
                  'skills': 'Skills',
                  'linkedin': 'LinkedIn',
                  'github': 'GitHub',
                  'portfolio': 'Portfolio'
                };
                const headerText = headerMap[field] || field.charAt(0).toUpperCase() + field.slice(1);
                return `<th>${headerText}</th>`;
              }).join('')}
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                ${fields.map(field => {
                  const value = item[field];
                  let displayValue = '';
                  
                  if (field === 'ratings' && typeof value === 'object' && value !== null) {
                    // Format ratings object as readable text - match HTML format exactly
                    displayValue = Object.entries(value)
                      .filter(([key, val]) => typeof val === 'number' && val > 0)
                      .map(([key, val]) => `${key}: ${val}`)
                      .join(', ');
                  } else if (typeof value === 'object' && value !== null) {
                    // Format other objects as readable text
                    displayValue = JSON.stringify(value, null, 2).replace(/\n/g, ' ');
                  } else if (field === 'timestamp') {
                    // Format timestamp
                    displayValue = new Date(value).toLocaleString();
                  } else {
                    // For all text fields, ensure they're not truncated - show full content
                    displayValue = value?.toString() || '';
                  }
                  
                  return `<td>${displayValue}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create and save HTML file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    saveAs(blob, `${filename}.html`);
    
    return { success: true, message: 'HTML file exported successfully' };
  } catch (error) {
    console.error('Error exporting to HTML:', error);
    return { success: false, message: 'Error exporting to HTML' };
  }
};

// Export to CSV
export const exportToCSV = (data, filename = 'export', selectedFields = []) => {
  try {
    const fields = selectedFields.length > 0 ? selectedFields : Object.keys(data[0] || {});
    
    // Create CSV header
    const header = fields.map(field => `"${field.charAt(0).toUpperCase() + field.slice(1)}"`).join(',');
    
    // Create CSV rows
    const rows = data.map(item => 
      fields.map(field => {
        const value = item[field];
        if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        }
        return `"${(value?.toString() || '').replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    // Combine header and rows
    const csvContent = [header, ...rows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
    
    return { success: true, message: 'CSV file exported successfully' };
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return { success: false, message: 'Error exporting to CSV' };
  }
};

// Get available fields for selection
export const getAvailableFields = (data, type = 'feedback') => {
  if (!data || data.length === 0) return [];
  
  const baseFields = {
    feedback: [
      'fullName', 'email', 'phone', 'rollNumber', 'department', 'year', 'section',
      'overallExperience', 'ratings', 'timestamp', 'submissionId'
    ],
    applications: [
      'fullName', 'email', 'contactNumber', 'rollNumber', 'branch', 'section', 'yearOfStudy',
      'skills', 'motivation', 'domainInterest', 'timeCommitment', 'previousExperience',
      'linkedin', 'github', 'portfolio', 'timestamp', 'submissionId', 'status'
    ]
  };
  
  const fields = baseFields[type] || Object.keys(data[0] || {});
  
  return fields.map(field => ({
    value: field,
    label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
  }));
};

// Format data for export
export const formatDataForExport = (data, selectedFields = []) => {
  if (!data || data.length === 0) return [];
  
  return data.map(item => {
    const formatted = {};
    const fields = selectedFields.length > 0 ? selectedFields : Object.keys(item);
    
    fields.forEach(field => {
      const value = item[field];
      
      // Format different data types
      if (field === 'timestamp') {
        formatted[field] = new Date(value).toLocaleString();
      } else if (field === 'ratings' && typeof value === 'object') {
        formatted[field] = Object.entries(value)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');
      } else if (typeof value === 'object' && value !== null) {
        formatted[field] = JSON.stringify(value);
      } else {
        formatted[field] = value?.toString() || '';
      }
    });
    
    return formatted;
  });
};

// Enhanced export function with history logging
export const exportWithHistory = async (data, options = {}) => {
  const {
    format = 'excel',
    filename = 'export',
    selectedFields = [],
    exportType = 'feedback',
    title = 'Data Export',
    adminUser = null,
    filters = {}
  } = options;

  const clientInfo = getClientInfo();
  let result = { success: false, message: 'Export failed' };

  try {
    // Perform the export
    switch (format) {
      case 'excel':
        result = exportToExcel(data, filename, selectedFields);
        break;
      case 'html':
        result = exportToHTML(data, filename, selectedFields, title);
        break;
      case 'csv':
        result = exportToCSV(data, filename, selectedFields);
        break;
      default:
        result = { success: false, message: 'Invalid export format' };
    }

    // Log export activity if admin user is provided
    if (adminUser && result.success) {
      const exportData = {
        adminUserId: adminUser.uid,
        adminEmail: adminUser.email,
        adminRole: adminUser.role,
        exportType,
        exportFormat: format,
        filename,
        recordCount: data.length,
        selectedFields,
        filters,
        status: 'success',
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent
      };

      await logExportActivity(exportData);
    }

    return result;
  } catch (error) {
    console.error('Export with history error:', error);
    
    // Log failed export if admin user is provided
    if (adminUser) {
      const exportData = {
        adminUserId: adminUser.uid,
        adminEmail: adminUser.email,
        adminRole: adminUser.role,
        exportType,
        exportFormat: format,
        filename,
        recordCount: data.length,
        selectedFields,
        filters,
        status: 'failed',
        errorMessage: error.message,
        ipAddress: clientInfo.ipAddress,
        userAgent: clientInfo.userAgent
      };

      await logExportActivity(exportData);
    }

    return { success: false, message: error.message };
  }
};