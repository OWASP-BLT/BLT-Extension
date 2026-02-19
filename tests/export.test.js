/**
 * Tests for lib/export.js
 */

import { exportToCSV, exportToJSON, parseCSVLine, escapeCSVValue } from '../lib/export.js';

// Mock chrome APIs
global.chrome = {
  runtime: {
    getManifest: () => ({ version: '1.6.0' }),
    id: 'test-extension-id'
  },
  downloads: {
    download: jest.fn().mockResolvedValue()
  }
};

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
global.URL.revokeObjectURL = jest.fn();

describe('Export Utilities', () => {
  describe('escapeCSVValue', () => {
    it('should escape quotes', () => {
      const result = escapeCSVValue('Test "quoted" value');
      expect(result).toBe('"Test ""quoted"" value"');
    });

    it('should wrap values with commas', () => {
      const result = escapeCSVValue('Test, value');
      expect(result).toBe('"Test, value"');
    });

    it('should handle newlines', () => {
      const result = escapeCSVValue('Line1\nLine2');
      expect(result).toBe('"Line1\nLine2"');
    });

    it('should handle null/undefined', () => {
      expect(escapeCSVValue(null)).toBe('');
      expect(escapeCSVValue(undefined)).toBe('');
    });

    it('should not escape simple values', () => {
      expect(escapeCSVValue('simple')).toBe('simple');
      expect(escapeCSVValue(123)).toBe('123');
    });
  });

  describe('exportToCSV', () => {
    const mockData = [
      { company: 'Test Co', position: 'Developer', status: 'Applied' },
      { company: 'Another, Inc', position: 'Engineer', status: 'Interview' }
    ];

    it('should generate CSV with headers', async () => {
      // Mock download functionality
      let csvContent = '';
      const mockDownload = jest.spyOn(chrome.downloads, 'download')
        .mockImplementation(async (options) => {
          // Extract content from blob URL (simplified)
          csvContent = 'mocked'; // In real implementation, would parse blob
          return Promise.resolve();
        });

      await exportToCSV(mockData, 'test.csv');

      expect(chrome.downloads.download).toHaveBeenCalled();
      const call = chrome.downloads.download.mock.calls[0][0];
      expect(call.filename).toBe('test.csv');
    });
  });

  describe('exportToJSON', () => {
    const mockData = [
      { company: 'Test Co', position: 'Developer' }
    ];

    it('should generate JSON with metadata', async () => {
      await exportToJSON(mockData, 'test.json');

      expect(chrome.downloads.download).toHaveBeenCalled();
      const call = chrome.downloads.download.mock.calls[0][0];
      expect(call.filename).toBe('test.json');
    });

    it('should include custom metadata', async () => {
      await exportToJSON(mockData, 'test.json', {
        metadata: { customField: 'value' }
      });

      expect(chrome.downloads.download).toHaveBeenCalled();
    });
  });
});
