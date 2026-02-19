/**
 * Tests for lib/storage.js
 */

import { storage, StorageWrapper } from '../lib/storage.js';

describe('StorageWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock chrome.storage.local
    chrome.storage.local.get.mockResolvedValue({});
    chrome.storage.local.set.mockResolvedValue();
    chrome.storage.local.remove.mockResolvedValue();
    chrome.storage.local.clear.mockResolvedValue();
  });

  describe('get', () => {
    it('should retrieve value from storage', async () => {
      chrome.storage.local.get.mockResolvedValue({ testKey: 'testValue' });

      const result = await storage.get('testKey');

      expect(result).toBe('testValue');
      expect(chrome.storage.local.get).toHaveBeenCalledWith('testKey');
    });

    it('should return default value if key doesnt exist', async () => {
      chrome.storage.local.get.mockResolvedValue({});

      const result = await storage.get('missingKey', 'default');

      expect(result).toBe('default');
    });

    it('should handle multiple keys', async () => {
      chrome.storage.local.get.mockResolvedValue({ key1: 'val1', key2: 'val2' });

      const result = await storage.get(['key1', 'key2']);

      expect(result).toEqual({ key1: 'val1', key2: 'val2' });
    });
  });

  describe('set', () => {
    it('should set single key-value pair', async () => {
      await storage.set('testKey', 'testValue');

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: 'testValue' });
    });

    it('should set multiple key-value pairs', async () => {
      await storage.set({ key1: 'val1', key2: 'val2' });

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ key1: 'val1', key2: 'val2' });
    });
  });

  describe('remove', () => {
    it('should remove single key', async () => {
      await storage.remove('testKey');

      expect(chrome.storage.local.remove).toHaveBeenCalledWith('testKey');
    });

    it('should remove multiple keys', async () => {
      await storage.remove(['key1', 'key2']);

      expect(chrome.storage.local.remove).toHaveBeenCalledWith(['key1', 'key2']);
    });
  });

  describe('clear', () => {
    it('should clear all storage', async () => {
      await storage.clear();

      expect(chrome.storage.local.clear).toHaveBeenCalled();
    });
  });

  describe('has', () => {
    it('should return true if key exists', async () => {
      chrome.storage.local.get.mockResolvedValue({ testKey: 'value' });

      const result = await storage.has('testKey');

      expect(result).toBe(true);
    });

    it('should return false if key doesnt exist', async () => {
      chrome.storage.local.get.mockResolvedValue({});

      const result = await storage.has('missingKey');

      expect(result).toBe(false);
    });
  });

  describe('update', () => {
    it('should update value using transformer', async () => {
      chrome.storage.local.get.mockResolvedValue({ counter: 5 });

      const result = await storage.update('counter', (val) => val + 1);

      expect(result).toBe(6);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({ counter: 6 });
    });

    it('should use default value if key doesnt exist', async () => {
      chrome.storage.local.get.mockResolvedValue({});

      const result = await storage.update('newKey', (val) => val + 1, 0);

      expect(result).toBe(1);
    });
  });

  describe('pushToArray', () => {
    it('should add item to existing array', async () => {
      chrome.storage.local.get.mockResolvedValue({ apps: [1, 2, 3] });

      await storage.pushToArray('apps', 4);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ apps: [1, 2, 3, 4] });
    });

    it('should create array if key doesnt exist', async () => {
      chrome.storage.local.get.mockResolvedValue({});

      await storage.pushToArray('newApps', 'first');

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ newApps: ['first'] });
    });
  });

  describe('removeFromArray', () => {
    it('should remove matching items', async () => {
      chrome.storage.local.get.mockResolvedValue({ apps: [1, 2, 3, 4] });

      await storage.removeFromArray('apps', (item) => item > 2);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ apps: [1, 2] });
    });
  });

  describe('updateInArray', () => {
    it('should update matching items', async () => {
      chrome.storage.local.get.mockResolvedValue({ 
        apps: [
          { id: 1, status: 'Applied' },
          { id: 2, status: 'Applied' }
        ]
      });

      await storage.updateInArray(
        'apps',
        (item) => item.id === 1,
        (item) => ({ ...item, status: 'Interview' })
      );

      const expectedApps = [
        { id: 1, status: 'Interview' },
        { id: 2, status: 'Applied' }
      ];

      expect(chrome.storage.local.set).toHaveBeenCalledWith({ apps: expectedApps });
    });
  });
});
