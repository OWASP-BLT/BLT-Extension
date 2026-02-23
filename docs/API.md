# API Reference - OWASP BLT Extension

API documentation for extension components and external integrations.

## Chrome Extension APIs

### Storage API

**chrome.storage.local** - Persistent local storage

```javascript
// Set data
await chrome.storage.local.set({ key: value });

// Get data
const result = await chrome.storage.local.get('key');
const value = result.key;

// Get multiple keys
const data = await chrome.storage.local.get(['key1', 'key2']);

// Remove data
await chrome.storage.local.remove('key');

// Clear all
await chrome.storage.local.clear();
```

### Runtime API

**chrome.runtime** - Extension communication

```javascript
// Send message to background
chrome.runtime.sendMessage({ action: 'takeScreenshot' });

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'takeScreenshot') {
    // Handle screenshot request
  }
  return true; // Required for async response
});

// Get extension URL
const url = chrome.runtime.getURL('jobtracking.html');
```

### Tabs API

**chrome.tabs** - Tab management

```javascript
// Send message to content script
chrome.tabs.sendMessage(tabId, { action: 'RUN_TRADEMARK_SCAN' });

// Query tabs
const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

// Create new tab
await chrome.tabs.create({ url: 'https://example.com' });

// Capture visible tab (screenshot)
chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
  // Process screenshot
});
```

## Extension Internal APIs

### Storage Wrapper (lib/storage.js)

Modern Promise-based storage abstraction:

```javascript
import { storage } from './lib/storage.js';

// Get value
const apps = await storage.get('jobApplications');

// Set value
await storage.set('jobApplications', apps);

// Get with default
const theme = await storage.get('theme', 'light');

// Update (get + modify + set)
await storage.update('jobApplications', (apps) => {
  apps.push(newApp);
  return apps;
});

// Remove
await storage.remove('key');

// Clear all
await storage.clear();
```

### Error Handler (lib/error-handler.js)

Unified error handling:

```javascript
import { handleError,showError } from './lib/error-handler.js';

try {
  await riskyOperation();
} catch (error) {
  handleError(error, 'Operation failed');
  showError('Please try again later');
}
```

### Export Utilities (lib/export.js)

Data export functionality:

```javascript
import { exportToCSV, exportToJSON } from './lib/export.js';

// Export to CSV
await exportToCSV(applications, 'job-applications.csv');

// Export to JSON
await exportToJSON(applications, 'job-applications.json');

// Export with custom fields
await exportToCSV(applications, 'export.csv', {
  fields: ['company', 'position', 'status'],
  includeHeaders: true
});
```

## External APIs

### OWASP BLT Trademark API

**Endpoint**: `https://owaspblt.org/api/trademarks/search`

**Request:**
```javascript
const url = `https://owaspblt.org/api/trademarks/search?query=${encodeURIComponent(keyword)}`;
const response = await fetch(url);
const data = await response.json();
```

**Response Format:**
```javascript
{
  available: false,  // true if not trademarked
  trademarks: [
    {
      name: "ExampleTM",
      owner: "Company Name",
      country: "US",
      status: "Active"
    }
  ]
}
```

## Data Models

### Job Application

```typescript
interface JobApplication {
  company: string;           // Required
  position: string;          // Required
  jobUrl?: string;           // Optional
  platform: 'LinkedIn' | 'Wellfound' | 'Manual';
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  appliedDate: string;       // ISO format: YYYY-MM-DD
}
```

### Storage Schema

```typescript
interface ExtensionStorage {
  jobApplications: JobApplication[];
  theme: 'light' | 'dark';
  pageSize: number;
  lightshot_announces: object;
}
```

## Message Formats

### Popup → Background

```javascript
// Screenshot request
{ action: 'takeScreenshot' }

// Job tracking
{ action: 'openJobTracking' }
```

### Background → Content Script

```javascript
// Trademark scan
{ action: 'RUN_TRADEMARK_SCAN' }

// Custom command
{ type: 'CUSTOM_ACTION', data: {...} }
```

### Content Script → Background

```javascript
// Trademark check
{
  type: 'CHECK_TRADEMARK',
  keyword: 'ExampleWord'
}

// Response
{
  ok: true,
  data: { available: false, trademarks: [...] }
}
```

## Event Listeners

### Service Worker Events

```javascript
// Extension installed
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First install
  } else if (details.reason === 'update') {
    // Extension updated
  }
});

// Message received
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Handle message
  return true; // Async response
});
```

### Content Script Events

```javascript
// DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize content script
});

// Mutation observer (for dynamic content)
const observer = new MutationObserver((mutations) => {
  // Handle DOM changes
});
observer.observe(document.body, { childList: true, subtree: true });
```

## Best Practices

1. **Always use async/await** with Chrome APIs (where supported)
2. **Validate all data** before storage
3. **Handle errors gracefully** with try-catch
4. **Use sendResponse properly** (return true for async)
5. **Sanitize user input** before display
6. **Check response.ok** before processing fetch results

## Migration Guide

### From Callbacks to Promises

**Old (callback-based):**
```javascript
chrome.storage.local.get('key', function(result) {
  const value = result.key;
  // Use value
});
```

**New (Promise-based):**
```javascript
const result = await chrome.storage.local.get('key');
const value = result.key;
// Use value
```

### Use Storage Wrapper

**Instead of:**
```javascript
chrome.storage.local.get('jobApplications', function(result) {
  const apps = result.jobApplications || [];
  apps.push(newApp);
  chrome.storage.local.set({ 'jobApplications': apps });
});
```

**Use:**
```javascript
await storage.update('jobApplications', (apps = []) => {
  apps.push(newApp);
  return apps;
});
```

---

For implementation examples, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
