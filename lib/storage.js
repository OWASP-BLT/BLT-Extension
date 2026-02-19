/**
 * Modern Promise-based storage wrapper for chrome.storage.local
 * Provides a clean API to replace callback-based storage operations
 * 
 * @module lib/storage
 */

/**
 * Storage wrapper class
 */
class StorageWrapper {
  /**
   * Get a value from storage
   * @param {string|string[]|object} keys - Key(s) to retrieve
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {Promise<*>} The stored value or default
   */
  async get(keys, defaultValue = null) {
    try {
      const result = await chrome.storage.local.get(keys);
      
      // Handle single key
      if (typeof keys === 'string') {
        return result[keys] !== undefined ? result[keys] : defaultValue;
      }
      
      // Handle multiple keys or object
      return result;
    } catch (error) {
      console.error('[Storage] Get error:', error);
      return defaultValue;
    }
  }

  /**
   * Set a value in storage
   * @param {string|object} key - Key to set or object of key-value pairs
   * @param {*} value - Value to set (if key is string)
   * @returns {Promise<void>}
   */
  async set(key, value) {
    try {
      const data = typeof key === 'string' ? { [key]: value } : key;
      await chrome.storage.local.set(data);
    } catch (error) {
      console.error('[Storage] Set error:', error);
      throw error;
    }
  }

  /**
   * Remove a key from storage
   * @param {string|string[]} keys - Key(s) to remove
   * @returns {Promise<void>}
   */
  async remove(keys) {
    try {
      await chrome.storage.local.remove(keys);
    } catch (error) {
      console.error('[Storage] Remove error:', error);
      throw error;
    }
  }

  /**
   * Clear all storage
   * @returns {Promise<void>}
   */
  async clear() {
    try {
      await chrome.storage.local.clear();
    } catch (error) {
      console.error('[Storage] Clear error:', error);
      throw error;
    }
  }

  /**
   * Get all keys and values from storage
   * @returns {Promise<object>} All stored data
   */
  async getAll() {
    try {
      return await chrome.storage.local.get(null);
    } catch (error) {
      console.error('[Storage] GetAll error:', error);
      return {};
    }
  }

  /**
   * Check if a key exists in storage
   * @param {string} key - Key to check
   * @returns {Promise<boolean>} True if key exists
   */
  async has(key) {
    try {
      const result = await chrome.storage.local.get(key);
      return result[key] !== undefined;
    } catch (error) {
      console.error('[Storage] Has error:', error);
      return false;
    }
  }

  /**
   * Update a value using a transformer function
   * Atomic read-modify-write operation
   * @param {string} key - Key to update
   * @param {Function} transformer - Function that transforms the value
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {Promise<*>} The new value
   */
  async update(key, transformer, defaultValue = null) {
    try {
      const currentValue = await this.get(key, defaultValue);
      const newValue = await transformer(currentValue);
      await this.set(key, newValue);
      return newValue;
    } catch (error) {
      console.error('[Storage] Update error:', error);
      throw error;
    }
  }

  /**
   * Get storage usage information
   * @returns {Promise<object>} Storage usage info
   */
  async getUsage() {
    try {
      const bytesInUse = await chrome.storage.local.getBytesInUse(null);
      const quota = chrome.storage.local.QUOTA_BYTES || 10485760; // 10MB default
      
      return {
        bytesInUse,
        quota,
        percentUsed: (bytesInUse / quota * 100).toFixed(2),
        available: quota - bytesInUse
      };
    } catch (error) {
      console.error('[Storage] GetUsage error:', error);
      return {
        bytesInUse: 0,
        quota: 0,
        percentUsed: 0,
        available: 0
      };
    }
  }

  /**
   * Add an item to an array in storage
   * @param {string} key - Key of the array
   * @param {*} item - Item to add
   * @returns {Promise<Array>} Updated array
   */
  async pushToArray(key, item) {
    return await this.update(key, (array = []) => {
      array.push(item);
      return array;
    }, []);
  }

  /**
   * Remove an item from an array in storage
   * @param {string} key - Key of the array
   * @param {Function} predicate - Function to identify item to remove
   *  @returns {Promise<Array>} Updated array
   */
  async removeFromArray(key, predicate) {
    return await this.update(key, (array = []) => {
      return array.filter(item => !predicate(item));
    }, []);
  }

  /**
   * Update an item in an array in storage
   * @param {string} key - Key of the array
   * @param {Function} predicate - Function to identify item to update
   * @param {Function} updater - Function to update the item
   * @returns {Promise<Array>} Updated array
   */
  async updateInArray(key, predicate, updater) {
    return await this.update(key, (array = []) => {
      return array.map(item => predicate(item) ? updater(item) : item);
    }, []);
  }
}

// Export singleton instance
export const storage = new StorageWrapper();

// Export class for testing
export { StorageWrapper };

/**
 * Example usage:
 * 
 * import { storage } from './lib/storage.js';
 * 
 * // Get value
 * const theme = await storage.get('theme', 'light');
 * 
 * // Set value
 * await storage.set('theme', 'dark');
 * 
 * // Update array
 * await storage.pushToArray('jobApplications', newApp);
 * 
 * // Remove from array
 * await storage.removeFromArray('jobApplications', app => app.id === '123');
 * 
 * // Complex update
 * await storage.update('jobApplications', (apps = []) => {
 *   apps[0].status = 'Interview';
 *   return apps;
 * });
 */
