# Developer Guide - OWASP BLT Extension

Complete guide for developers contributing to OWASP BLT Extension.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Development Workflow](#development-workflow)
5. [Testing](#testing)
6. [Building & Releasing](#building--releasing)
7. [Best Practices](#best-practices)

## Development Setup

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Git**
- **Chrome/Chromium** browser
- **Code editor** (VS Code recommended)

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/BLT-Extension.git
cd BLT-Extension

# Add upstream remote
git remote add upstream https://github.com/OWASP-BLT/BLT-Extension.git

# Install dependencies
npm install

# Verify setup
npm test
```

### Load Extension in Chrome

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `BLT-Extension` directory
5. Note the extension ID

### Debugging

**Background Service Worker:**
```
chrome://extensions/ → Click "service worker" link under extension
```

**Content Scripts:**
```
Right-click page → Inspect → Console → Filter by extension ID
```

**Popup:**
```
Right-click extension icon → Inspect popup
```

## Project Structure

```
BLT-Extension/
├── manifest.json           # Extension manifest (Manifest V3)
├── background.js          # Service worker (background script)
├── popup.html/popup.js     # Extension popup UI
├── content.js             # Main content script (screenshot tool)
├── event.js               # Event handling utilities
├── jobtracking.html/js     # Job tracking dashboard
│
├── Content Scripts (Domain-specific)
├── linkedin-monitor.js     # LinkedIn job tracking
├── wellfound-monitor.js   # Wellfound job tracking
├── trademark-scanner.js   # Trademark highlighting
├── github-pr-button.js    # GitHub PR enhancements
│
├── Library Code
├── lib/                   # Shared utilities (add new ones here)
│   ├── storage.js        # Storage wrapper (new)
│   ├── error-handler.js  # Error handling (new)
│   └── export.js         # Data export utilities (new)
│
├── UI & Styling
├── screenshot.html/css     # Screenshot UI
├── toolbar*.css           # Toolbar styling
├── img/                   # Icons and images
│
├── Localization
├── _locales/
│   └── en/messages.json   # English messages (add more languages)
│
├── Tests
├── tests/
│   ├── *.test.js         # Unit tests (Jest)
│   └── setup.js          # Test configuration
│
├── CI/CD
├── .github/workflows/     # GitHub Actions workflows
│   ├── test.yaml         # Run tests on PR
│   ├── release.yaml      # Create releases
│   └── pages.yaml        # Deploy landing page
│
├── Documentation
├── docs/                  # This folder
├── README.md             # Project overview
├── CONTRIBUTING.md       # Contribution guidelines
├── SECURITY.md           # Security policy
├── CODE_OF_CONDUCT.md    # Community guidelines
└── PRIVACY.md            # Privacy policy
```

### Key Files Explained

**manifest.json**
- Extension configuration
- Permissions, content scripts, background worker
- **Manifest V3** (latest standard)

**background.js**
- Service worker (replaces persistent background page)
- Handles API calls (trademark checking)
- Screenshot capture logic
- Central message hub

**popup.html/popup.js**
- Extension popup UI (click icon)
- Three main buttons: Screenshot, Job Tracking, Trademark Scanner
- Minimal JavaScript (sends messages to background/content scripts)

**jobtracking.html/js**
- Full-page job tracking dashboard
- CRUD operations for job applications
- Uses `chrome.storage.local` directly
- Pagination, sorting, filtering

**Content Scripts**
- **linkedin-monitor.js**: Monitors "Apply" button clicks
- **wellfound-monitor.js**: Same for Wellfound
- **trademark-scanner.js**: Scans and highlights trademarks
- **github-pr-button.js**: Adds floating navigation buttons
- **content.js**: Screenshot tool (toolbar and capture logic)

## Architecture

### Communication Flow

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Popup     │─────→│  Background.js   │─────→│  External API   │
│  (popup.js) │      │ (Service Worker) │      │ (owaspblt.org)  │
└─────────────┘      └──────────────────┘      └─────────────────┘
       │                     │
       │                     │
       ↓                     ↓
┌─────────────┐      ┌──────────────────┐
│  Content    │      │  chrome.storage  │
│  Scripts    │      │     .local       │
└─────────────┘      └──────────────────┘
```

### Message Passing

**Popup → Background:**
```javascript
// popup.js
chrome.runtime.sendMessage({ action: 'takeScreenshot' });
```

**Background → Content Script:**
```javascript
// background.js
chrome.tabs.sendMessage(tabId, { action: 'RUN_TRADEMARK_SCAN' });
```

**Content Script → Background:**
```javascript
// trademark-scanner.js
chrome.runtime.sendMessage(
  { type: 'CHECK_TRADEMARK', keyword: 'Example' },
  (response) => { /* handle response */ }
);
```

### Storage Architecture

**Current (Callback-based):**
```javascript
// ❌ Old pattern (still used in codebase)
chrome.storage.local.get('jobApplications', function(result) {
  const apps = result.jobApplications || [];
  // ... process apps
  chrome.storage.local.set({ 'jobApplications': apps });
});
```

**Modern (Promise-based) - NEW:**
```javascript
// ✅ New pattern (lib/storage.js wrapper)
import { storage } from './lib/storage.js';

const apps = await storage.get('jobApplications') || [];
// ... process apps
await storage.set('jobApplications', apps);
```

### Data Models

**Job Application:**
```javascript
{
  company: string,         // Required
  position: string,        // Required
  jobUrl: string,          // Optional
  platform: 'LinkedIn' | 'Wellfound' | 'Manual',
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected',
  appliedDate: string      // ISO date format (YYYY-MM-DD)
}
```

**Storage Keys:**
```javascript
{
  'jobApplications': Array<JobApplication>,
  'theme': 'light' | 'dark',              // User preference
  'pageSize': number,                     // Table pagination
  'lightshot_announces': Object           // Screenshot settings
}
```

## Development Workflow

### Creating a Feature

1. **Create a branch**
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make changes**
   - Edit files
   - Test in browser
   - Write tests

3. **Test locally**
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Commit**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push and PR**
   ```bash
   git push origin feature/my-new-feature
   # Open PR on GitHub
   ```

### Hot Reload Development

**Manual reload:**
1. Make code changes
2. Go to `chrome://extensions/`
3. Click reload icon on BLT Extension
4. Refresh any tabs using the extension

**Extension Reloader** (optional tool):
- Install "Extensions Reloader" extension
- Auto-reload on file changes

### Adding a New Content Script

1. **Create the script:**
   ```javascript
   // mynewfeature.js
   console.log('New feature content script loaded');

   // Your feature logic here
   ```

2. **Register in manifest.json:**
   ```json
   {
     "content_scripts": [
       {
         "matches": ["*://example.com/*"],
         "js": ["mynewfeature.js"],
         "run_at": "document_idle"
       }
     ]
   }
   ```

3. **Test on target domain**

4. **Add tests:**
   ```javascript
   // tests/mynewfeature.test.js
   describe('MyNewFeature', () => {
     it('should do something', () => {
       // test logic
     });
   });
   ```

### Adding a New Permission

1. **Add to manifest.json:**
   ```json
   {
     "permissions": ["newPermission"],
     "host_permissions": ["https://newdomain.com/*"]
   }
   ```

2. **Document in PRIVACY.md:**
   - Explain why it's needed
   - What it accesses
   - How it's used

3. **Update README** if user-facing

### Adding a Library Function

1. **Create lib/mymodule.js:**
   ```javascript
   /**
    * My utility function
    * @param {string} input - Input parameter
    * @returns {string} Output result
    */
   export function myUtility(input) {
     // implementation
   }
   ```

2. **Import where needed:**
   ```javascript
   import { myUtility } from './lib/mymodule.js';
   ```

3. **Add tests:**
   ```javascript
   // tests/mymodule.test.js
   import { myUtility } from '../lib/mymodule.js';

   describe('myUtility', () => {
     it('should return transformed input', () => {
       expect(myUtility('test')).toBe('expected');
     });
   });
   ```

## Testing

### Running Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode (re-run on changes)
npm test -- --watch

# Specific test file
npm test -- tests/popup.test.js

# Specific test case
npm test -- -t "should handle error cases"
```

### Writing Tests

**Test file structure:**
```javascript
/**
 * Tests for feature name
 */
describe('Feature', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('Subfeature', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

**Mocking Chrome APIs:**
```javascript
// Chrome APIs are mocked in tests/setup.js
describe('Storage', () => {
  it('should save data', (done) => {
    chrome.storage.local.set({ key: 'value' }, () => {
      expect(chrome.storage.local.set).toHaveBeenCalled();
      done();
    });
  });
});
```

### Manual Testing Checklist

Before submitting a PR:

- [ ] Load extension in Chrome (fresh install)
- [ ] Test popup opens and closes
- [ ] Test screenshot capture
- [ ] Test job tracking (add, update, delete)
- [ ] Test LinkedIn monitoring (if applicable)
- [ ] Test trademark scanner
- [ ] Test GitHub PR buttons (if applicable)
- [ ] Check console for errors
- [ ] Test on different websites
- [ ] Verify data persists after browser restart
- [ ] Test export functionality
- [ ] Check UI responsiveness
- [ ] Test in incognito mode (some features may differ)

### Integration Testing

**Job Tracking Integration:**
```javascript
describe('Job Tracking Integration', () => {
  it('should add, update, and delete application', async () => {
    // Add
    const app = { company: 'Test Co', position: 'Dev', /* ... */ };
    await storage.set('jobApplications', [app]);

    // Update
    app.status = 'Interview';
    await storage.set('jobApplications', [app]);

    // Verify
    const apps = await storage.get('jobApplications');
    expect(apps[0].status).toBe('Interview');

    // Delete
    await storage.set('jobApplications', []);
    const empty = await storage.get('jobApplications');
    expect(empty).toEqual([]);
  });
});
```

## Building & Releasing

### Version Bump

1. **Update manifest.json version:**
   ```json
   {
     "version": "1.6"
   }
   ```

2. **Update package.json version:**
   ```json
   {
     "version": "1.6.0"
   }
   ```

3. **Commit version bump:**
   ```bash
   git commit -am "chore: bump version to 1.6.0"
   ```

### Creating a Release

1. **Tag the release:**
   ```bash
   git tag v1.6
   git push origin v1.6
   ```

2. **GitHub Action automatically:**
   - Packages extension into ZIP
   - Creates GitHub release
   - Attached ZIP file

3. **Verify release:**
   - Check [Releases page](https://github.com/OWASP-BLT/BLT-Extension/releases)
   - Download and test ZIP
   - Update release notes if needed

### Manual Build (if needed)

```bash
# Create distribution directory
mkdir dist

# Copy necessary files
cp -r *.js *.html *.css manifest.json img/ libs/ _locales/ lib/ dist/

# Create ZIP
cd dist
zip -r ../BLT-Extension-v1.6.zip *
cd ..
```

### Publishing to Chrome Web Store

1. **Prepare for submission:**
   - Test thoroughly
   - Update screenshots
   - Write release notes

2. **Chrome Web Store Developer Dashboard:**
   - Upload ZIP
   - Update store listing
   - Submit for review

3. **Review process:**
   - 1-3 days typically
   - May request changes
   - Respond to reviewer feedback

## Best Practices

### Code Style

**JavaScript:**
- Use modern ES6+ syntax
- Prefer `const` over `let`, never `var`
- Use async/await over callbacks
- Descriptive variable names
- JSDoc comments for functions

**Example:**
```javascript
/**
 * Saves a job application to storage
 * @param {Object} application - The job application data
 * @param {string} application.company - Company name
 * @returns {Promise<void>}
 */
async function saveJobApplication(application) {
  const apps = await storage.get('jobApplications') || [];
  apps.push(application);
  await storage.set('jobApplications', apps);
}
```

### Security

```javascript
// ✅ Good: Sanitize input
function sanitize(input) {
  return String(input).trim().replace(/[<>]/g, '');
}

// ✅ Good: Validate URLs
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// ❌ Bad: Direct innerHTML
element.innerHTML = userInput; // XSS vulnerability!

// ✅ Good: Use textContent
element.textContent = userInput;
```

### Performance

```javascript
// ✅ Good: Debounce expensive operations
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ✅ Good: Limit array operations
const keywords = extractKeywords().slice(0, 200); // Max 200

// ✅ Good: Use efficient selectors
const button = document.getElementById('myButton'); // Fast
// Instead of: document.querySelector('#myButton')
```

### Error Handling

```javascript
// ✅ Good: Try-catch for async operations
async function fetchData() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    // Show user-friendly message
    showError('Failed to load data. Please try again.');
  }
}

// ✅ Good: Validate before processing
function processApplication(app) {
  if (!app || !app.company || !app.position) {
    throw new Error('Invalid application data');
  }
  // Process...
}
```

### Documentation

```javascript
// ✅ Good: Document complex logic
/**
 * Extracts potential trademark keywords from page text.
 * Filters for capitalized words with 3+ characters.
 * Limits to MAX_TRADEMARK_KEYWORDS for performance.
 * 
 * @returns {string[]} Array of unique keywords
 */
function extractKeywords() {
  const text = document.body.innerText || "";
  const words = text.match(/\b[A-Z][a-zA-Z0-9]+\b/g) || [];
  const unique = [...new Set(words)].filter(w => w.length > 2);
  return unique.slice(0, MAX_TRADEMARK_KEYWORDS);
}
```

### Git Workflow

```bash
# Update from upstream regularly
git fetch upstream
git rebase upstream/main

# Create descriptive commits
git commit -m "feat(job-tracking): add CSV export functionality"

# Push to your fork
git push origin feature/csv-export
```

## Common Tasks

### Adding a New Feature to Job Tracking

1. Update jobtracking.html (UI)
2. Update jobtracking.js (logic)
3. Update job application data model if needed
4. Write tests
5. Update USER_GUIDE.md
6. Create PR

### Adding a New Monitoring Platform

1. Create new content script (e.g., `indeed-monitor.js`)
2. Register in manifest.json
3. Implement monitoring logic
4. Test on target platform
5. Add tests
6. Update documentation

### Fixing a Bug

1. Reproduce the bug
2. Write a failing test
3. Fix the bug
4. Verify test passes
5. Manual testing
6. Create PR with "fix:" prefix

## Resources

### Chrome Extension APIs

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [chrome.storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [chrome.tabs API](https://developer.chrome.com/docs/extensions/reference/tabs/)
- [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)

### OWASP Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP BLT Project](https://owasp.org/www-project-bug-logging-tool/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

### Tools

- [Jest](https://jestjs.io/) - Testing framework
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging
- [VS Code](https://code.visualstudio.com/) - Recommended editor

## Getting Help

- **GitHub Discussions** - Ask questions
- **Issues** - Report bugs
- **OWASP Slack** - Real-time help (#blt channel)
- **Code Review** - Request reviews on PRs

##Questions?

See [CONTRIBUTING.md](../CONTRIBUTING.md) or open a [Discussion](https://github.com/OWASP-BLT/BLT-Extension/discussions).

---

Happy coding! 🚀
