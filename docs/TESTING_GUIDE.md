# Testing Guide - OWASP BLT Extension

Comprehensive guide to testing the OWASP BLT Extension.

## Overview

We use **Jest** for unit and integration testing with mocked Chrome APIs.

## Running Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode (auto-rerun)
npm test -- --watch

# Specific file
npm test -- tests/popup.test.js

# Specific test case
npm test -- -t "should save application"

# Verbose output
npm test -- --verbose
```

## Test Structure

### File Organization

```
tests/
├── setup.js                 # Jest configuration & mocks
├── *.test.js                # Unit tests (one per module)
└── integration/             # Integration tests (future)
```

### Test File Template

```javascript
/**
 * Tests for [module name]
 */
describe('[Module Name]', () => {
  beforeEach(() => {
    // Setup before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('[Feature Group]', () => {
    it('should [expected behavior]', () => {
      // Arrange: Set up test data
      const input = 'test';

      // Act: Execute function
      const result = functionUnderTest(input);

      // Assert: Verify result
      expect(result).toBe('expected');
    });
  });
});
```

## Writing Unit Tests

### Testing Pure Functions

```javascript
// lib/utils.js
export function sanitizeInput(input) {
  return String(input).trim().replace(/[<>]/g, '');
}

// tests/utils.test.js
import { sanitizeInput } from '../lib/utils.js';

describe('sanitizeInput', () => {
  it('should remove HTML tags', () => {
    expect(sanitizeInput('<script>alert()</script>')).toBe('scriptalert()/script');
  });

  it('should trim whitespace', () => {
    expect(sanitizeInput('  test  ')).toBe('test');
  });

  it('should handle non-string input', () => {
    expect(sanitizeInput(123)).toBe('123');
  });
});
```

### Testing Async Functions

```javascript
// lib/storage.js
export async function getApplications() {
  const result = await chrome.storage.local.get('jobApplications');
  return result.jobApplications || [];
}

// tests/storage.test.js
describe('getApplications', () => {
  it('should retrieve applications from storage', async () => {
    const mockApps = [{ company: 'Test Co', position: 'Dev' }];
    chrome.storage.local.get.mockResolvedValue({ jobApplications: mockApps });

    const result = await getApplications();

    expect(result).toEqual(mockApps);
    expect(chrome.storage.local.get).toHaveBeenCalledWith('jobApplications');
  });

  it('should return empty array if no applications', async () => {
    chrome.storage.local.get.mockResolvedValue({});

    const result = await getApplications();

    expect(result).toEqual([]);
  });
});
```

### Testing Chrome API Calls

```javascript
describe('Background Message Handler', () => {
  it('should handle screenshot request', () => {
    const mockCallback = jest.fn();

    chrome.tabs.captureVisibleTab(null, { format: 'png' }, mockCallback);

    expect(chrome.tabs.captureVisibleTab).toHaveBeenCalled();
    expect(chrome.tabs.captureVisibleTab).toHaveBeenCalledWith(
      null,
      { format: 'png' },
      expect.any(Function)
    );
  });
});
```

### Testing DOM Manipulation

```javascript
describe('Job Table Rendering', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <table id="applicationsTable">
        <tbody id="applicationsBody"></tbody>
      </table>
    `;
  });

  it('should render job applications', () => {
    const apps = [
      { company: 'Test Co', position: 'Developer', status: 'Applied' }
    ];

    renderApplications(apps);

    const tbody = document.getElementById('applicationsBody');
    expect(tbody.children.length).toBe(1);
    expect(tbody.textContent).toContain('Test Co');
    expect(tbody.textContent).toContain('Developer');
  });
});
```

## Mocking

### Chrome API Mocks

Chrome APIs are auto-mocked in `tests/setup.js`:

```javascript
// Available mocks
chrome.runtime.sendMessage
chrome.runtime.getURL
chrome.runtime.onMessage.addListener
chrome.storage.local.get
chrome.storage.local.set
chrome.storage.local.remove
chrome.storage.local.clear
chrome.tabs.create
chrome.tabs.query
chrome.tabs.sendMessage
chrome.tabs.captureVisibleTab
```

### Custom Mocks

```javascript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'mock data' })
  })
);

// Reset mock
afterEach(() => {
  fetch.mockClear();
});
```

### Mock Functions

```javascript
describe('with mock dependencies', () => {
  const mockLogger = jest.fn();

  it('should call logger', () => {
    functionUnderTest(mockLogger);
    expect(mockLogger).toHaveBeenCalledWith('expected message');
  });
});
```

## Testing Patterns

### Testing Error Handling

```javascript
it('should handle API errors gracefully', async () => {
  fetch.mockRejectedValue(new Error('Network error'));

  await expect(fetchData()).rejects.toThrow('Network error');
});

it('should throw on invalid input', () => {
  expect(() => processApplication(null)).toThrow('Invalid application');
});
```

### Testing Edge Cases

```javascript
describe('Edge cases', () => {
  it('should handle empty array', () => {
    expect(processApplications([])).toEqual([]);
  });

  it('should handle null input', () => {
    expect(processApplications(null)).toEqual([]);
  });

  it('should handle undefined', () => {
    expect(processApplications(undefined)).toEqual([]);
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(10000);
    expect(sanitize(longString)).toBe(longString);
  });
});
```

### Testing Async Callbacks

```javascript
it('should handle async callback', (done) => {
  chrome.storage.local.get('key', (result) => {
    expect(result.key).toBe('value');
    done();
  });

  // Trigger callback
  const callback = chrome.storage.local.get.mock.calls[0][1];
  callback({ key: 'value' });
});
```

## Coverage

### Running Coverage

```bash
npm run test:coverage
```

### Coverage Report

```
File              | % Stmts | % Branch | % Funcs | % Lines |
------------------|---------|----------|---------|---------|
popup.js          |   85.71 |    66.67 |     100 |   85.71 |
jobtracking.js    |   92.31 |    83.33 |   88.89 |   92.31 |
background.js     |   75.00 |    50.00 |   66.67 |   75.00 |
------------------|---------|----------|---------|---------|
All files         |   84.34 |    66.67 |   85.19 |   84.34 |
```

### Goal

- **Statements**: > 80%
- **Branches**: > 70%
- **Functions**: > 80%
- **Lines**: > 80%

## Integration Testing

### Testing Feature Workflows

```javascript
describe('Job Tracking Workflow', () => {
  it('should complete add-update-delete cycle', async () => {
    // Add application
    const app = {
      company: 'Test Co',
      position: 'Developer',
      status: 'Applied',
      appliedDate: '2026-02-19'
    };
    await storage.set('jobApplications', [app]);

    // Verify added
    let apps = await storage.get('jobApplications');
    expect(apps).toHaveLength(1);
    expect(apps[0].company).toBe('Test Co');

    // Update status
    apps[0].status = 'Interview';
    await storage.set('jobApplications', apps);

    // Verify updated
    apps = await storage.get('jobApplications');
    expect(apps[0].status).toBe('Interview');

    // Delete
    await storage.set('jobApplications', []);

    // Verify deleted
    apps = await storage.get('jobApplications');
    expect(apps).toHaveLength(0);
  });
});
```

## Manual Testing

### Pre-Release Checklist

- [ ] Load extension in Chrome
- [ ] Test popup opens
- [ ] Test screenshot capture on multiple sites
- [ ] Test job tracking (add, update, delete)
- [ ] Test LinkedIn automatic tracking
- [ ] Test Wellfound automatic tracking
- [ ] Test trademark scanner on various sites
- [ ] Test GitHub PR buttons
- [ ] Test data export (CSV/JSON)
- [ ] Check console for errors
- [ ] Test in incognito mode
- [ ] Test with multiple Chrome profiles
- [ ] Verify data persists after browser restart

### Browser Testing

Test on:
- Chrome (latest)
- Microsoft Edge (latest)
- Brave Browser (latest)
- Chromium (latest)

### Platform Testing

Test on:
- Windows 10/11
- macOS
- Linux (Ubuntu/Fedora)

## Debugging Tests

### Run Single Test

```bash
npmnpm test -- -t "specific test name"
```

### Debug in VS Code

`.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Console Logging

```javascript
it('should debug', () => {
  console.log('Debug info:', someVariable);
  expect(someVariable).toBe(expected);
});
```

## Best Practices

1. **Test behavior, not implementation**
2. **One assertion per test** (when possible)
3. **Use descriptive test names**
4. **Keep tests independent**
5. **Mock external dependencies**
6. **Test edge cases and errors**
7. **Maintain high coverage** (>80%)
8. **Run tests before committing**

## Common Issues

### Mock not working

**Problem**: Mock function not being called  
**Solution**: Ensure mock is set up before function call

### Async test timeout

**Problem**: Test times out  
**Solution**: Increase timeout or use `done()` callback

### Cannot find module

**Problem**: Import fails in test  
**Solution**: Check module path and Jest configuration

---

For more examples, see existing test files in `tests/` directory.
