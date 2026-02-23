/**
 * Unified error handling system for OWASP BLT Extension
 * Provides consistent error logging, user notification, and error recovery
 * 
 * @module lib/error-handler
 */

/**
 * Error severity levels
 * @enum {string}
 */
export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Error categories
 * @enum {string}
 */
export const Error Category = {
  STORAGE: 'storage',
  NETWORK: 'network',
  API: 'api',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown'
};

/**
 * Application error class with additional context
 */
export class AppError extends Error {
  constructor(message, category = ErrorCategory.UNKNOWN, severity = ErrorSeverity.MEDIUM, context = {}) {
    super(message);
    this.name = 'AppError';
    this.category = category;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Error handler class
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
  }

  /**
   * Log an error with context
   * @param {Error} error - The error object
   * @param {string} context - Additional context
   * @param {object} metadata - Additional metadata
   */
  log(error, context = '', metadata = {}) {
    const errorEntry = {
      message: error.message,
      name: error.name,
      category: error.category || ErrorCategory.UNKNOWN,
      severity: error.severity || ErrorSeverity.MEDIUM,
      context,
      metadata,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    // Add to error log
    this.errorLog.push(errorEntry);

    // Trim log if too large
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Console logging based on severity
    const logMethod = this._getLogMethod(errorEntry.severity);
    console[logMethod](`[${errorEntry.category.toUpperCase()}] ${errorEntry.message}`, {
      context,
      metadata,
      error
    });

    // Store critical errors
    if (errorEntry.severity === ErrorSeverity.CRITICAL) {
      this._storeCriticalError(errorEntry);
    }
  }

  /**
   * Handle an error with automatic categorization and user notification
   * @param {Error} error - The error to handle
   * @param {string} userMessage - User-friendly message to display
   * @param {object} options - Handling options
   */
  async handle(error, userMessage = null, options = {}) {
    const {
      category = this._categorizeError(error),
      severity = ErrorSeverity.MEDIUM,
      context = '',
      metadata = {},
      showNotification = false,
      recoveryAction = null
    } = options;

    // Create AppError if it's a regular Error
    const appError = error instanceof AppError 
      ? error 
      : new AppError(error.message, category, severity, metadata);

    // Log the error
    this.log(appError, context, metadata);

    // Show user notification if requested
    if (showNotification || severity === ErrorSeverity.CRITICAL) {
      await this.notify(userMessage || this._getDefaultMessage(category), severity);
    }

    // Attempt recovery
    if (recoveryAction && typeof recoveryAction === 'function') {
      try {
        await recoveryAction();
      } catch (recoveryError) {
        console.error('[ErrorHandler] Recovery action failed:', recoveryError);
      }
    }

    return appError;
  }

  /**
   * Show user notification
   * @param {string} message - Message to display
   * @param {string} severity - Error severity
   */
  async notify(message, severity = ErrorSeverity.MEDIUM) {
    // Try Chrome notification
    if (chrome.notifications) {
      try {
        await chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('img/icon128.png'),
          title: 'OWASP BLT Extension',
          message: message,
          priority: severity === ErrorSeverity.CRITICAL ? 2 : 1
        });
        return;
      } catch (error) {
        console.warn('[ErrorHandler] Notification failed:', error);
      }
    }

    // Fallback to console
    console.error(`[USER NOTIFICATION] ${message}`);
  }

  /**
   * Show error message in DOM (for content scripts/popups)
   * @param {string} message - Error message
   * @param {string} severity - Error severity
   * @param {number} duration - Display duration in ms (0 = permanent)
   */
  showError(message, severity = ErrorSeverity.MEDIUM, duration = 5000) {
    const toast = document.createElement('div');
    toast.className = `error-toast error-${severity}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${this._getSeverityColor(severity)};
      color: white;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 400px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    if (duration > 0) {
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  /**
   * Get error log
   * @param {object} filters - Filter options
   * @returns {Array} Filtered error log
   */
  getLog(filters = {}) {
    let log = [...this.errorLog];

    if (filters.category) {
      log = log.filter(e => e.category === filters.category);
    }

    if (filters.severity) {
      log = log.filter(e => e.severity === filters.severity);
    }

    if (filters.since) {
      const since = new Date(filters.since);
      log = log.filter(e => new Date(e.timestamp) >= since);
    }

    return log;
  }

  /**
   * Clear error log
   */
  clearLog() {
    this.errorLog = [];
  }

  /**
   * Export error log
   * @returns {string} JSON string of error log
   */
  exportLog() {
    return JSON.stringify(this.errorLog, null, 2);
  }

  // Private methods

  _getLogMethod(severity) {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      default:
        return 'log';
    }
  }

  _categorizeError(error) {
    const message = error.message.toLowerCase();

    if (message.includes('storage') || message.includes('quota')) {
      return ErrorCategory.STORAGE;
    }
    if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
      return ErrorCategory.NETWORK;
    }
    if (message.includes('api') || message.includes('http')) {
      return ErrorCategory.API;
    }
    if (message.includes('invalid') || message.includes('validation')) {
      return ErrorCategory.VALIDATION;
    }
    if (message.includes('permission') || message.includes('denied')) {
      return ErrorCategory.PERMISSION;
    }

    return ErrorCategory.UNKNOWN;
  }

  _getDefaultMessage(category) {
    const messages = {
      [ErrorCategory.STORAGE]: 'Failed to save data. Please try again.',
      [ErrorCategory.NETWORK]: 'Network error. Please check your connection.',
      [ErrorCategory.API]: 'Service unavailable. Please try again later.',
      [ErrorCategory.VALIDATION]: 'Invalid data. Please check your input.',
      [ErrorCategory.PERMISSION]: 'Permission denied. Please check extension permissions.',
      [ErrorCategory.UNKNOWN]: 'An error occurred. Please try again.'
    };

    return messages[category] || messages[ErrorCategory.UNKNOWN];
  }

  _getSeverityColor(severity) {
    const colors = {
      [ErrorSeverity.LOW]: '#3b82f6',      // Blue
      [ErrorSeverity.MEDIUM]: '#f59e0b',   // Orange
      [ErrorSeverity.HIGH]: '#ef4444',     // Red
      [ErrorSeverity.CRITICAL]: '#dc2626'  // Dark red
    };

    return colors[severity] || colors[ErrorSeverity.MEDIUM];
  }

  async _storeCriticalError(errorEntry) {
    try {
      const stored = await chrome.storage.local.get('criticalErrors') || { criticalErrors: [] };
      const criticalErrors = stored.criticalErrors || [];
      
      criticalErrors.push(errorEntry);
      
      // Keep only last 10 critical errors
      if (criticalErrors.length > 10) {
        criticalErrors.shift();
      }

      await chrome.storage.local.set({ criticalErrors });
    } catch (error) {
      console.error('[ErrorHandler] Failed to store critical error:', error);
    }
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Convenience functions
export const handleError = (error, userMessage, options) => errorHandler.handle(error, userMessage, options);
export const showError = (message, severity, duration) => errorHandler.showError(message, severity, duration);
export const logError = (error, context, metadata) => errorHandler.log(error, context, metadata);

/**
 * Example usage:
 * 
 * import { handleError, showError, AppError, ErrorCategory, ErrorSeverity } from './lib/error-handler.js';
 * 
 * // Handle error with automatic categorization
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   await handleError(error, 'Failed to save application', {
 *     showNotification: true,
 *     context: 'Job tracking save',
 *     metadata: { jobId: '123' }
 *   });
 * }
 * 
 * // Show user error message (in content script/popup)
 * showError('Invalid input', ErrorSeverity.MEDIUM);
 * 
 * // Throw custom error
 * throw new AppError('Invalid job application', ErrorCategory.VALIDATION, ErrorSeverity.HIGH);
 * 
 * // With recovery action
 * await handleError(error, 'Failed to load data', {
 *   severity: ErrorSeverity.HIGH,
 *   recoveryAction: async () => {
 *     await retryLoad();
 *   }
 * });
 */
