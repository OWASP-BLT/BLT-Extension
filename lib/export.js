/**
 * Data export utilities for OWASP BLT Extension
 * Supports CSV and JSON export of job applications
 * 
 * @module lib/export
 */

/**
 * Export data to CSV format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Output filename
 * @param {object} options - Export options
 * @returns {Promise<void>}
 */
export async function exportToCSV(data, filename = 'export.csv', options = {}) {
  const {
    fields = null, // Array of field names to include (null = all fields)
    includeHeaders = true,
    delimiter = ',',
    dateFormat = 'YYYY-MM-DD'
  } = options;

  try {
    // Determine fields to export
    const exportFields = fields || (data.length > 0 ? Object.keys(data[0]) : []);

    // Build CSV content
    let csv = '';

    // Add headers
    if (includeHeaders) {
      csv += exportFields.map(field => escapeCSVValue(field)).join(delimiter) + '\n';
    }

    // Add data rows
    for (const row of data) {
      const values = exportFields.map(field => {
        const value = row[field];
        return escapeCSVValue(formatValue(value, dateFormat));
      });
      csv += values.join(delimiter) + '\n';
    }

    // Trigger download
    await downloadFile(csv, filename, 'text/csv');
  } catch (error) {
    console.error('[Export] CSV export failed:', error);
    throw new Error('Failed to export CSV');
  }
}

/**
 * Export data to JSON format
 * @param {Array|object} data - Data to export
 * @param {string} filename - Output filename
 * @param {object} options - Export options
 * @returns {Promise<void>}
 */
export async function exportToJSON(data, filename = 'export.json', options = {}) {
  const {
    pretty = true,
    metadata = {}
  } = options;

  try {
    // Create export package with metadata
    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version,
        ...metadata
      },
      data
    };

    // Convert to JSON string
    const json = pretty 
      ? JSON.stringify(exportData, null, 2)
      : JSON.stringify(exportData);

    // Trigger download
    await downloadFile(json, filename, 'application/json');
  } catch (error) {
    console.error('[Export] JSON export failed:', error);
    throw new Error('Failed to export JSON');
  }
}

/**
 * Export job applications with default settings
 * @param {Array} applications - Job applications to export
 * @param {string} format - Export format ('csv' or 'json')
 * @returns {Promise<void>}
 */
export async function exportJobApplications(applications, format = 'csv') {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `job-applications-${timestamp}.${format}`;

  if (format === 'csv') {
    await exportToCSV(applications, filename, {
      fields: ['company', 'position', 'platform', 'status', 'appliedDate', 'jobUrl'],
      includeHeaders: true
    });
  } else if (format === 'json') {
    await exportToJSON(applications, filename, {
      metadata: {
        totalApplications: applications.length,
        exportType: 'job-applications'
      }
    });
  } else {
    throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * Import data from JSON file
 * @param {File} file - File object from file input
 * @returns {Promise<object>} Imported data
 */
export async function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        
        // Validate imported data
        if (!json.data) {
          throw new Error('Invalid import file format');
        }

        resolve(json);
      } catch (error) {
        reject(new Error('Failed to parse JSON file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Import data from CSV file
 * @param {File} file - File object from file input
 * @param {object} options - Import options
 * @returns {Promise<Array>} Imported data as array of objects
 */
export async function importFromCSV(file, options = {}) {
  const {
    delimiter = ',',
    hasHeaders = true,
    fieldNames = null
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target.result;
        const lines = csv.split('\n').filter(line => line.trim());

        if (lines.length === 0) {
          reject(new Error('Empty CSV file'));
          return;
        }

        let headers = fieldNames;
        let dataStartIndex = 0;

        // Parse headers if present
        if (hasHeaders) {
          headers = parseCSVLine(lines[0], delimiter);
          dataStartIndex = 1;
        }

        if (!headers) {
          reject(new Error('No field names provided and no headers in CSV'));
          return;
        }

        // Parse data rows
        const data = [];
        for (let i = dataStartIndex; i < lines.length; i++) {
          const values = parseCSVLine(lines[i], delimiter);
          if (values.length === 0) continue;

          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          data.push(row);
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Create backup of all extension data
 * @returns {Promise<string>} JSON string of backup data
 */
export async function createBackup() {
  try {
    const allData = await chrome.storage.local.get(null);
    
    const backup = {
      metadata: {
        backupDate: new Date().toISOString(),
        version: chrome.runtime.getManifest().version,
        extensionId: chrome.runtime.id
      },
      data: allData
    };

    return JSON.stringify(backup, null, 2);
  } catch (error) {
    console.error('[Export] Backup creation failed:', error);
    throw new Error('Failed to create backup');
  }
}

/**
 * Restore data from backup
 * @param {string|object} backupData - Backup data (JSON string or object)
 * @param {object} options - Restore options
 * @returns {Promise<void>}
 */
export async function restoreBackup(backupData, options = {}) {
  const {
    clearExisting = false,
    keys = null // Specific keys to restore (null = all)
  } = options;

  try {
    // Parse backup if string
    const backup = typeof backupData === 'string' 
      ? JSON.parse(backupData)
      : backupData;

    if (!backup.data) {
      throw new Error('Invalid backup format');
    }

    // Clear existing data if requested
    if (clearExisting) {
      await chrome.storage.local.clear();
    }

    // Restore data
    const dataToRestore = keys 
      ? Object.fromEntries(keys.map(key => [key, backup.data[key]]).filter(([_, v]) => v !== undefined))
      : backup.data;

    await chrome.storage.local.set(dataToRestore);
  } catch (error) {
    console.error('[Export] Backup restore failed:', error);
    throw new Error('Failed to restore backup');
  }
}

/**
 * Download backup file
 * @returns {Promise<void>}
 */
export async function downloadBackup() {
  const backup = await createBackup();
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const filename = `blt-extension-backup-${timestamp}.json`;
  
  await downloadFile(backup, filename, 'application/json');
}

// Helper Functions

/**
 * Escape CSV value (handle commas, quotes, newlines)
 * @param {*} value - Value to escape
 * @returns {string} Escaped value
 */
function escapeCSVValue(value) {
  if (value == null) return '';
  
  const stringValue = String(value);
  
  // If value contains delimiter, quotes, or newlines, wrap in quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Escape existing quotes by doubling them
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  
  return stringValue;
}

/**
 * Format value for export
 * @param {*} value - Value to format
 * @param {string} dateFormat - Date format string
 * @returns {string} Formatted value
 */
function formatValue(value, dateFormat) {
  if (value == null) return '';
  
  // Handle dates
  if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    const date = value instanceof Date ? value : new Date(value);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
  
  // Handle objects/arrays
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Parse CSV line respecting quotes
 * @param {string} line - CSV line
 * @param {string} delimiter - Field delimiter
 * @returns {Array<string>} Array of field values
 */
function parseCSVLine(line, delimiter = ',') {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Trigger file download
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {string} mimeType - MIME type
 * @returns {Promise<void>}
 */
async function downloadFile(content, filename, mimeType) {
  try {
    // Create blob
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    // Trigger download
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });

    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('[Export] Download failed:', error);
    
    // Fallback: Create download link
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Example usage:
 * 
 * import { exportToCSV, exportToJSON, exportJobApplications, downloadBackup } from './lib/export.js';
 * 
 * // Export to CSV
 * await exportToCSV(applications, 'my-apps.csv', {
 *   fields: ['company', 'position', 'status'],
 *   includeHeaders: true
 * });
 * 
 * // Export to JSON
 * await exportToJSON(applications, 'my-apps.json');
 * 
 * // Quick job export
 * await exportJobApplications(applications, 'csv');
 * 
 * // Download full backup
 * await downloadBackup();
 * 
 * // Import from file
 * const fileInput = document.getElementById('importFile');
 * const file = fileInput.files[0];
 * const data = await importFromJSON(file);
 */
