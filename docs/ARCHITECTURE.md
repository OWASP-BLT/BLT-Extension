# Architecture - OWASP BLT Extension

## Overview

Manifest V3 Chrome extension with modular architecture for screenshots, job tracking, trademark scanning, and GitHub enhancements.

## Component Architecture

```
Extension Popup (popup.js) → Background Worker (background.js) → External APIs
                 ↓                       ↓
          Content Scripts        chrome.storage.local
       (domain-specific)         (persistent data)
```

## Core Components

### 1. Background Service Worker

**File**: `background.js`  
**Purpose**: Central message hub, API communication  
**Responsibilities**:
- Handle trademark API calls
- Process screenshot requests
- Coordinate between components

### 2. Content Scripts

Domain-specific scripts injected into web pages:
- `content.js` - Screenshot capture tool
- `linkedin-monitor.js` - Track LinkedIn applications
- `wellfound-monitor.js` - Track Wellfound applications
- `trademark-scanner.js` - Highlight trademarked words
- `github-pr-button.js` - Add PR navigation buttons

### 3. Extension UI

-Popup**: `popup.html/js` - Main extension menu
- **Dashboard**: `jobtracking.html/js` - Full job tracking interface
- **Screenshot UI**: `screenshot.html/css` - Capture interface

### 4. Storage Layer

Uses `chrome.storage.local` for persistent data:
- Job applications array
- User preferences (theme, page size)
- Screenshot settings

## Data Flow

### Job Application Tracking

```
LinkedIn page → Monitor clicks → Extract job data → Storage → Dashboard display
```

### Trademark Scanning

```
User clicks scan → Extract keywords → API request → Highlight results
```

### Screenshot Capture

```
User clicks screenshot → Capture tab → Download to device
```

## Security Architecture

- **Content Security Policy**: No inline scripts, no eval()
- **Minimal Permissions**: Only required permissions requested
- **Local Storage**: No external data transmission (except trademark API)
- **Input Validation**: All user input sanitized
- **HTTPS Only**: All external requests use HTTPS

## Design Decisions

### Manifest V3

- **Service Worker**: Replaces persistent background pages
- **Modern APIs**: Promise-based where supported
- **Better Security**: Stricter CSP and permission model

### Local-First Storage

- Privacy by design
- works offline
- No sync dependencies
- User owns their data

### Modular Content Scripts

- Match patterns limit scope
- Independent feature development
- Better performance (load only when needed)

## Future Architecture

### Planned Improvements

1. **Storage Wrapper**: Promise-based API abstraction
2. **Error Handling**: Unified error system
3. **Export System**: Modular import/export
4. **Analytics**: Optional, privacy-respecting telemetry

## Technical Stack

- **JavaScript**: ES6+ (async/await, modules)
- **Chrome APIs**: Manifest V3 APIs
- **Testing**: Jest framework
- **CI/CD**: GitHub Actions
- **Documentation**: Markdown

---

For implementation details, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)(continued_from_previous_message)
