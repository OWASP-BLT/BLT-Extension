# Contributing to OWASP BLT Extension

Thank you for your interest in contributing to the OWASP BLT Extension! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Security](#security)
- [Community](#community)

## Code of Conduct

This project adheres to the [OWASP Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git**
- **Chrome/Chromium-based browser** (Chrome, Edge, Brave, etc.)
- Basic understanding of JavaScript, Chrome Extension APIs, and Web Development

### Understanding the Project

Before contributing, familiarize yourself with:

1. **README.md** - Project overview and installation
2. **docs/USER_GUIDE.md** - User-facing features
3. **docs/DEVELOPER_GUIDE.md** - Technical architecture and development setup
4. **docs/ARCHITECTURE.md** - System design and component interaction
5. **SECURITY.md** - Security policies and best practices

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/BLT-Extension.git
cd BLT-Extension

# Add upstream remote
git remote add upstream https://github.com/OWASP-BLT/BLT-Extension.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `BLT-Extension` directory

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm test -- --watch
```

## How to Contribute

### Finding Issues to Work On

- Check the [Issues](https://github.com/OWASP-BLT/BLT-Extension/issues) page
- Look for issues labeled:
  - `good first issue` - Great for newcomers
  - `help wanted` - Community input needed
  - `bug` - Bug fixes
  - `enhancement` - New features
  - `documentation` - Documentation improvements

### Types of Contributions

We welcome contributions in many forms:

#### 🐛 Bug Reports

When filing a bug report, include:

- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** (if applicable)
- **Environment details**: Browser version, OS, extension version
- **Console errors** (if any)

**Template:**
```markdown
**Description:**
Brief description of the bug

**Steps to Reproduce:**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Browser: Chrome 120.0.6099.129
- OS: Windows 11
- Extension Version: 1.5

**Console Errors:**
```
[Paste any console errors here]
```

**Screenshots:**
[Attach screenshots if applicable]
```

#### ✨ Feature Requests

When proposing a new feature:

- **Search existing issues** to avoid duplicates
- **Describe the problem** the feature would solve
- **Provide use cases** and examples
- **Consider security implications** (this is an OWASP project)
- **Discuss implementation approach** if you have ideas

#### 📝 Documentation

Documentation improvements are always welcome:

- Fixing typos or unclear instructions
- Adding examples or tutorials
- Translating documentation
- Improving API documentation
- Writing guides for new features

#### 💻 Code Contributions

Follow these steps for code contributions:

1. **Create an issue** (if one doesn't exist)
2. **Discuss your approach** with maintainers
3. **Fork and create a branch**
4. **Implement your changes**
5. **Write tests**
6. **Update documentation**
7. **Submit a pull request**

## Coding Standards

### JavaScript Style Guide

We follow modern JavaScript best practices:

```javascript
// ✅ Good: Use const/let, not var
const apiUrl = 'https://owaspblt.org/api';
let userData = null;

// ✅ Good: Use async/await over callbacks
async function fetchData() {
  try {
    const data = await chrome.storage.local.get('key');
    return data;
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}

// ❌ Bad: Using callbacks when async/await is available
chrome.storage.local.get('key', function(data) {
  // callback hell...
});

// ✅ Good: Proper error handling
try {
  const result = await riskyOperation();
  handleSuccess(result);
} catch (error) {
  handleError(error);
}

// ✅ Good: Descriptive variable and function names
function saveJobApplication(applicationData) {
  // Implementation
}

// ❌ Bad: Unclear names
function save(data) {
  // What are we saving?
}

// ✅ Good: JSDoc comments for functions
/**
 * Saves a job application to local storage
 * @param {Object} application - The job application data
 * @param {string} application.company - Company name
 * @param {string} application.position - Job position
 * @returns {Promise<void>}
 */
async function saveJobApplication(application) {
  // Implementation
}
```

### Chrome Extension Best Practices

Follow [Chrome Extension Best Practices](https://developer.chrome.com/docs/extensions/mv3/):

1. **Use Manifest V3** (current standard)
2. **Request minimal permissions** - Only request what you need
3. **Handle errors gracefully** - Never let exceptions crash the extension
4. **Use service workers** - Background scripts should be service workers
5. **Validate user input** - Sanitize and validate all user data
6. **Respect privacy** - Follow OWASP principles

### Security Standards

As an OWASP project, security is paramount:

```javascript
// ✅ Good: Sanitize user input
function sanitizeInput(input) {
  return input.replace(/[<>]/g, '');
}

// ✅ Good: Use Content Security Policy
// See manifest.json for CSP configuration

// ✅ Good: Validate URLs before navigation
function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// ❌ Bad: Direct innerHTML without sanitization
element.innerHTML = userInput; // XSS vulnerability!

// ✅ Good: Use textContent or sanitize first
element.textContent = userInput;
```

### File Organization

```
BLT-Extension/
├── manifest.json           # Extension manifest
├── background.js          # Service worker
├── popup.html/js          # Extension popup
├── content.js             # Content scripts
├── lib/                   # Shared utilities
│   ├── storage.js        # Storage wrapper
│   ├── error-handler.js  # Error handling
│   └── export.js         # Export utilities
├── tests/                 # Test files
│   ├── *.test.js         # Unit tests
│   └── setup.js          # Test configuration
├── docs/                  # Documentation
├── img/                   # Images and icons
└── _locales/             # Internationalization
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes
- **perf**: Performance improvements
- **security**: Security-related changes

### Examples

```bash
# Feature
feat(job-tracking): add CSV export functionality

Implements CSV export for job applications with support for
filtering by status and date range.

Closes #123

# Bug fix
fix(linkedin-monitor): prevent duplicate application entries

Fixed issue where clicking apply button multiple times would
create duplicate entries in job tracking.

Fixes #456

# Documentation
docs(contributing): add security guidelines section

Added comprehensive security guidelines for contributors
covering input validation, XSS prevention, and OWASP principles.

# Security fix
security(screenshot): sanitize filename before download

Prevents directory traversal attacks by sanitizing user-provided
filename input.

Reported-by: @security-researcher
CVE: (if applicable)
```

### Commit Best Practices

- **One logical change per commit**
- **Write clear, descriptive messages**
- **Reference issues** in commit messages
- **Keep commits atomic** and focused
- **Test before committing**

## Pull Request Process

### Before Submitting

1. **Update your fork** with latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests** and ensure they pass:
   ```bash
   npm test
   npm run test:coverage
   ```

3. **Update documentation** if needed

4. **Check for linting errors** (if linter is configured)

### PR Title and Description

**Title Format:** Same as commit messages
```
feat(job-tracking): add export to CSV functionality
```

**Description Template:**
```markdown
## Description
Brief overview of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Security fix

## Related Issues
Closes #123
Related to #456

## Changes Made
- Added CSV export button to job tracking dashboard
- Implemented `exportToCSV()` function in lib/export.js
- Added tests for export functionality
- Updated user guide with export instructions

## Testing Performed
- [ ] Tested manually in Chrome
- [ ] All existing tests pass
- [ ] Added new tests for changes
- [ ] Tested in multiple browsers (if applicable)

## Screenshots (if applicable)
[Attach screenshots showing the changes]

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings or errors
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Security Considerations
- [ ] I have considered security implications of my changes
- [ ] Input is properly validated and sanitized
- [ ] No sensitive data is exposed or logged
- [ ] Changes follow OWASP security principles
```

### Review Process

1. **Automated checks** will run (tests, linting)
2. **Maintainer review** - Be responsive to feedback
3. **Address review comments** - Make requested changes
4. **Final approval** - Once approved, maintainers will merge

### After PR is Merged

1. **Delete your branch** (if no longer needed)
2. **Update your fork**:
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/popup.test.js

# Run with coverage
npm run test:coverage

# Watch mode
npm test -- --watch
```

### Writing Tests

We use Jest for testing. Example test structure:

```javascript
/**
 * Tests for new feature
 */
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Functionality Group', () => {
    it('should do something specific', () => {
      // Arrange
      const input = 'test data';
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe('expected output');
    });

    it('should handle error cases', () => {
      expect(() => {
        functionUnderTest(null);
      }).toThrow('Expected error message');
    });
  });
});
```

### Test Coverage

- Aim for **>80% code coverage**
- Test **happy paths** and **error cases**
- Mock Chrome APIs using the setup in `tests/setup.js`
- Write **integration tests** for complex features

## Security

### Reporting Security Vulnerabilities

**DO NOT** open a public issue for security vulnerabilities.

Instead, please report security issues to:
- **Email:** security@owasp.org
- **GitHub Security Advisory:** Use the "Report a vulnerability" button

See [SECURITY.md](SECURITY.md) for detailed security policies.

### Security Review Checklist

Before submitting code, ensure:

- [ ] **Input validation** - All user input is validated
- [ ] **Output encoding** - Proper encoding prevents XSS
- [ ] **Authentication** - Any auth mechanisms are properly implemented
- [ ] **Authorization** - Permissions are correctly enforced
- [ ] **Data protection** - Sensitive data is not logged or exposed
- [ ] **Dependencies** - No known vulnerable dependencies
- [ ] **Error handling** - Errors don't leak sensitive information
- [ ] **Rate limiting** - API calls are rate-limited if applicable

## Community

### Getting Help

- **GitHub Discussions:** Ask questions and discuss ideas
- **Issues:** Report bugs or request features
- **OWASP Slack:** Join the #blt channel on OWASP Slack
- **Email:** Contact maintainers directly for sensitive matters

### Recognition

Contributors will be recognized in:
- **README.md** - Contributors section
- **Release notes** - Mentioned in relevant releases
- **GitHub contributors page** - Automatic recognition

### Project Maintainers

Current maintainers:
- See [MAINTAINERS.md](MAINTAINERS.md) or GitHub repository team

### OWASP Participation

This project is part of the OWASP Foundation. Learn more:
- **OWASP BLT Project:** https://owasp.org/www-project-bug-logging-tool/
- **OWASP Website:** https://owasp.org
- **Get involved:** Join OWASP and contribute to projects

## Additional Resources

- [Chrome Extension Development](https://developer.chrome.com/docs/extensions/mv3/)
- [OWASP Developer Guide](https://owasp.org/www-project-developer-guide/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## License

By contributing to OWASP BLT Extension, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to OWASP BLT Extension! Your efforts help improve security tools for the entire community. 🎉
