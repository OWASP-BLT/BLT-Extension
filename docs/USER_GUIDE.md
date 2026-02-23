# OWASP BLT Extension - User Guide

Welcome to the OWASP BLT Extension! This comprehensive guide will help you get the most out of all the extension's features.

## Table of Contents

1. [What is BLT Extension?](#what-is-blt-extension)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Features](#features)
   - [Screenshot Capture](#screenshot-capture)
   - [Job Application Tracking](#job-application-tracking)
   - [Trademark Scanner](#trademark-scanner)
   - [GitHub PR Enhancements](#github-pr-enhancements)
5. [Tips & Tricks](#tips--tricks)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#frequently-asked-questions)
8. [Privacy & Security](#privacy--security)

## What is BLT Extension?

OWASP BLT Extension is a powerful Chrome extension that combines multiple productivity features:

- **📸 Screenshot Tool**: Capture and annotate web pages
- **💼 Job Tracker**: Monitor and manage job applications across LinkedIn and Wellfound
- **™️ Trademark Scanner**: Identify trademarked words on any webpage
- **🔧 GitHub Tools**: Enhanced PR navigation with floating action buttons

**Who is it for?**
- Bug bounty hunters and security researchers
- Job seekers tracking applications
- Content creators avoiding trademark issues
- Developers working with GitHub PRs

## Installation

### Quick Install (Recommended)

Run this one-line command in your terminal:

```bash
bash <(curl -sL https://raw.githubusercontent.com/OWASP-BLT/BLT-Extension/main/install.sh)
```

This script will:
- Download the latest version
- Detect your operating system
- Find Chrome/Chromium browsers
- Guide you through installation

**Supported Browsers:**
- Google Chrome
- Microsoft Edge
- Brave Browser
- Chromium
- Opera (Chromium-based)

### Manual Installation

1. **Download**
   - Go to [Releases](https://github.com/OWASP-BLT/BLT-Extension/releases)
   - Download the latest `BLT-Extension-v*.zip`
   - Extract to a folder

2. **Install in Chrome**
   - Open Chrome
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the extracted folder

3. **Verify Installation**
   - You should see the BLT Extension icon in your toolbar
   - Click it to open the popup menu

### Updating

When a new version is released:

**Auto-update (Chrome Web Store):**
- Updates automatically

**Manual installations:**
1. Download new version
2. Remove old extension
3. Install new version
4. Your data is preserved (stored in browser)

## Getting Started

### First Launch

1. **Click the extension icon** in your Chrome toolbar
2. You'll see three main options:
   - Take Screenshot
   - Job Tracking Dashboard
   - Run Trademark Scanner

3. **No setup required!** All features work immediately

### Interface Overview

#### Popup Menu
- **Screenshot Button**: Opens screenshot tool
- **Job Tracking Button**: Opens job dashboard
- **Trademark Scanner**: Scans current page for trademarks

#### Permissions

The extension will request permissions for:
- **Screenshots**: Access to current tab
- **Storage**: Save job applications locally
- **LinkedIn/Wellfound**: Monitor job applications
- **GitHub**: Enhance PR pages

See [PRIVACY.md](../PRIVACY.md) for detailed privacy information.

## Features

### Screenshot Capture

#### Taking a Screenshot

1. **Click** the BLT Extension icon
2. **Select** "Take Screenshot"
3. Screenshot is automatically captured and downloaded

#### Screenshot Types

**Current viewport:**
- Captures visible portion of the page
- Fastest method
- Best for quick captures

**Planned features (future versions):**
- Full page screenshots
- Selection tool
- Annotation tools

#### Use Cases

- **Bug Reports**: Capture error messages
- **Documentation**: Screenshot examples
- **Portfolio**: Save your work
- **Bug Bounty**: Evidence for vulnerability reports

#### Tips

- ✅ Close unnecessary tabs before capturing (better performance)
- ✅ Zoom page to 100% for best quality
- ✅ Screenshots are saved to your Downloads folder
- ✅ Filename: `screenshot.png` (can be renamed after download)

### Job Application Tracking

Track your job search across multiple platforms automatically.

#### Automatic Tracking

**LinkedIn:**
1. Browse jobs on LinkedIn
2. Click "Apply" on any job
3. Extension automatically captures:
   - Company name
   - Position title
   - Job URL
   - Application date

**Wellfound (formerly AngelList):**
- Same automatic tracking as LinkedIn
- Works on Wellfound job pages

**Supported:** Currently LinkedIn and Wellfound  
**Planned:** Indeed, Glassdoor, company career pages

#### Manual Entry

Add jobs you applied to elsewhere:

1. Open **Job Tracking Dashboard**
2. Click **"+ Add New Application"**
3. Fill in details:
   - Company name (required)
   - Position (required)
   - Job URL (optional but recommended)
   - Platform (LinkedIn, Wellfound, or Other)
   - Status (Applied, Interview, Offer, Rejected)
   - Applied Date (auto-filled with today)
4. Click **"Add Application"**

#### Job Dashboard Features

##### Viewing Applications

**Table View:**
- All applications in a sortable table
- Columns: Company, Position, Date, Platform, Status, Actions

**Status Badges:**
- 🔵 Applied (blue)
- 🟡 Interview (yellow)
- 🟢 Offer (green)
- 🔴 Rejected (red)

##### Updating Status

1. Find the application in the table
2. Click **"Update"** button
3. Change status in the modal
4. Click **"Add Application"** (updates existing entry)

##### Deleting Applications

1. Click **"Delete"** button next to application
2. Confirm deletion
3. Application is permanently removed

##### Pagination

- **Page size**: Choose 10, 25, 50, or 100 items per page
- **Navigation**: Previous/Next buttons at bottom
- **Page indicator**: Shows current page and total pages

##### Search and Filter (Planned Feature)

Coming soon:
- Search by company or position
- Filter by status
- Filter by date range
- Sort by any column

##### Export Data

**CSV Export:**
1. Click **"Export CSV"** button (top right)
2. Opens in Excel, Google Sheets, etc.
3. All applications included

**JSON Export:**
1. Click **"Export JSON"** button
2. Structured data for developers
3. Can be re-imported (future feature)

##### Backup and Restore

**Automatic backup** (local):
- Data stored in browser's local storage
- Persists across browser restarts
- Not synced across devices (by design for privacy)

**Manual backup:**
1. Export to CSV or JSON
2. Save file securely
3. Re-import if needed (future feature)

##### Statistics (Future Feature)

Coming soon:
- Total applications
- Response rate
- Average time to response
- Success rate by platform
- Timeline visualization

#### Job Tracking Tips

- ✅ Add jobs immediately after applying
- ✅ Update status regularly
- ✅ Export data weekly as backup
- ✅ Use job URL to link back to posting
- ✅ Track rejection dates to identify patterns
- ⚠️ Data stored locally only (won't sync across devices)

### Trademark Scanner

Identify trademarked words on any webpage to avoid legal issues.

#### How It Works

1. **Click** BLT Extension icon
2. **Click** "Run Trademark Scanner"
3. Extension:
   - Extracts keywords from the page
   - Checks against OWASP BLT trademark database
   - Highlights trademarked words
4. **Trademarked words** are highlighted in yellow

#### What Gets Scanned

- **All visible text** on the current page
- **Capitalized words** (e.g., "Google", "Microsoft")
- **Words with 3+ characters**
- **Limited to 200 keywords** per scan (performance)

#### Trademark Highlights

- **Yellow highlight**: Word is trademarked
- **Hover effect**: Lighter yellow on hover
- **Clickable**: Click to see trademark info (future feature)

#### Use Cases

- **Content Writing**: Avoid trademark infringement in blog posts
- **Product Names**: Check if a name is already trademarked
- **Documentation**: Proper use of trademarked terms
- **Legal Review**: Quick scan before publishing

#### Limitations

- Only checks OWASP BLT trademarkdatabase
- May not include all trademarks worldwide
- Always consult a legal professional for trademark advice

#### Tips

- ✅ Scan before publishing content
- ✅ Watch for `™`, `®` symbols in highlights
- ✅ Consider alternative wording for highlighted terms
- ⚠️ Scanner is a tool, not legal advice

### GitHub PR Enhancements

Enhanced navigation for GitHub Pull Request pages.

#### Floating Action Buttons

When visiting any GitHub PR page (`github.com/*/pull/*`):

**Scroll to Update Button:**
- Floating button in bottom-right corner
- Green button with down arrow icon
- Click to scroll to "Update branch" button
- Saves scrolling on large PRs

**Scroll to Top:**
- Blue button above the update button
- Up arrow icon
- Click to quickly return to PR top
- Useful after reviewing changes

#### Features

- **Fixed position**: Always visible while scrolling
- **Smooth scrolling**: Animated scroll to target
- **Hover effects**: Visual feedback on hover
- **GitHub-styled**: Matches GitHub's design language

#### Use Cases

- **Code Review**: Navigate long PRs quickly
- **Branch Updates**: Quickly access update button
- **Workflow Improvement**: Save time on repetitive scrolling

## Tips & Tricks

### General Tips

1. **Pin the extension** to your toolbar
   - Click the puzzle piece icon in Chrome toolbar
   - Pin OWASP BLT Extension
   - Icon always visible for quick access

2. **Keyboard Shortcuts** (future feature)
   - Will support custom shortcuts
   - Currently: Click extension icon

3. **Performance**
   - Extension is lightweight
   - Minimal impact on browsing speed
   - Content scripts only load on relevant domains

### Job Tracking Tips

1. **Consistent Data Entry**
   - Use standardized company names
   - Include full job titles
   - Always add job URL (helps track duplicates)

2. **Status Management**
   - Update status as soon as you know
   - Use "Interview" for any interview stage
   - Move to "Rejected" when confirmed (not just no response)

3. **Organization**
   - Export monthly for records
   - Review rejected applications for patterns
   - Keep notes in a separate document (linked by URL)

4. **Backup Strategy**
   - Weekly CSV export
   - Store in cloud (Google Drive, Dropbox)
   - Keep JSON backup for data recovery

### Trademark Scanning Tips

1. **Best Results**
   - Scan finished content, not drafts
   - Combine with manual review
   - Check highlights in context

2. **Performance**
   - Close large pages after scanning
   - May slow on pages with 1000+ trademarks
   - Refresh page to remove highlights

### GitHub PR Tips

1. **Efficiency**
   - Use floating buttons on long PRs (500+ lines)
   - Scroll to top after each file review
   - Combine with GitHub keyboard shortcuts

2. **Integration**
   - Works with GitHub dark mode
   - Compatible with GitHub extensions
   - Doesn't interfere with GitHub UI

## Troubleshooting

### Extension Not Working

**Problem:** Extension icon not showing  
**Solution:**
- Check `chrome://extensions/`
- Ensure extension is enabled
- Reload extension
- Restart browser

**Problem:** Extension icon grayed out  
**Solution:**
- Some pages don't allow extensions (chrome://pages)
- Navigate to a regular webpage
- Check permissions in `chrome://extensions/`

### Screenshot Issues

**Problem:** Screenshot not capturing  
**Solution:**
- Ensure you're on a webpage (not chrome:// page)
- Check permissions (activeTab required)
- Try a different page
- Reload extension

**Problem:** Screenshot is blank  
**Solution:**
- Page may use canvas rendering (some graphics)
- Try standard webpage first
- Check Chrome version (Manifest V3 required)

### Job Tracking Issues

**Problem:** Applications not appearing in dashboard  
**Solution:**
- Check if data is saved (browser console)
- Try adding manually first
- Clear cache and reload extension
- Export/import data if available

**Problem:** LinkedIn tracking not working  
**Solution:**
- Ensure you're on LinkedIn job page
- Must click "Apply" button
- Check content script permissions
- LinkedIn layout may have changed (report issue)

**Problem:** Can't export data  
**Solution:**
- Browser may block downloads
- Check download permissions
- Try different format (CSV vs JSON)
- Allow downloads in browser settings

### Trademark Scanner Issues

**Problem:** Scan not highlighting anything  
**Solution:**
- May be no trademarks on page
- Check console for errors
- API may be down (temporary)
- Try different page

**Problem:** Too many highlights  
**Solution:**
- Page may have many trademarked terms
- This is intentional (shows all trademarks)
- Review highlights manually
- Refresh page to clear highlights

### GitHub PR Issues

**Problem:** Floating buttons not showing  
**Solution:**
- Ensure you're on a PR page (`/pull/*`)
- Check content script permissions
- GitHub layout may have changed
- Page may not have fully loaded

**Problem:** Buttons not scrolling  
**Solution:**
- Clear browser cache
- Reload page
- Try different PR
- May be CSS conflict with other extensions

### Data Issues

**Problem:** Lost all job applications  
**Solution:**
- Data is stored locally (persists until cleared)
- Check if you cleared browser data
- Restore from CSV/JSON backup
- Data doesn't sync across devices

**Problem:** Duplicate entries  
**Solution:**
- Manual deletion (click Delete button)
- Future feature: automatic duplicate detection
- Use consistent naming to avoid duplicates

### Permission Issues

**Problem:** Extension requesting too many permissions  
**Solution:**
- See [PRIVACY.md](../PRIVACY.md) for explanation
- All permissions are necessary for features
- Can disable specific features if concerned
- Extension doesn't abuse permissions (open source)

### Browser Compatibility

**Problem:** Extension not working in Edge/Brave  
**Solution:**
- Should work (Chromium-based)
- Try loading unpacked
- Check manifest version support
- Some features may vary by browser

## Frequently Asked Questions

### General

**Q: Is BLT Extension free?**  
A: Yes, completely free and open source.

**Q: Do I need a BLT account?**  
A: No, the extension works standalone.

**Q: Is my data safe?**  
A: Yes, all data stored locally on your device. See [PRIVACY.md](../PRIVACY.md).

**Q: Does it work on Firefox?**  
A: Currently Chrome/Chromium only. Firefox support planned.

### Job Tracking

**Q: Can I import existing job applications?**  
A: Not yet. Manual entry or automatic tracking only. Import feature planned.

**Q: Does it sync across devices?**  
A: No, data is local only (for privacy). Export/import for manual sync.

**Q: How many applications can I track?**  
A: No limit (storage-based). Tested with 1000+ applications.

**Q: Can I share my job data?**  
A: Export to CSV/JSON and share the file.

### Trademark Scanner

**Q: Is the trademark database comprehensive?**  
A: Uses OWASP BLT database. May not include all trademarks worldwide.

**Q: Can I add trademarks to the database?**  
A: Contact OWASP BLT project to contribute.

**Q: Is trademark scanning legal advice?**  
A: No, it's a tool. Consult a lawyer for legal advice.

### Privacy & Security

**Q: What data is collected?**  
A: Only job applications (stored locally). See [PRIVACY.md](../PRIVACY.md).

**Q: Is data encrypted?**  
A: Local browser storage (standard Chrome encryption).

**Q: Do you sell my data?**  
A: Never. We don't even collect it (local storage only).

**Q: Can I delete my data?**  
A: Yes, anytime. Uninstalling the extension deletes all data.

## Privacy & Security

### Data Storage

- **Local only**: All job data stored in browser
- **No cloud**: Data never leaves your device
- **No tracking**: No analytics or telemetry
- **Open source**: Audit the code anytime

### Permissions

- **Minimal**: Only necessary permissions requested
- **Explained**: See [PRIVACY.md](../PRIVACY.md) for details
- **No abuse**: Code is auditable and reviewed

### Security

- **OWASP project**: Security-focused development
- **Regular updates**: Security patches
- **Vulnerability reporting**: See [SECURITY.md](../SECURITY.md)
- **Community reviewed**: Open source benefits

## Getting Help

### Documentation

- **User Guide**: This document
- **Developer Guide**: [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)
- **Contributing**: [../CONTRIBUTING.md](../CONTRIBUTING.md)
- **Security**: [../SECURITY.md](../SECURITY.md)
- **Privacy**: [../PRIVACY.md](../PRIVACY.md)

### Support Channels

1. **GitHub Issues**: Report bugs or request features
   - https://github.com/OWASP-BLT/BLT-Extension/issues

2. **GitHub Discussions**: Ask questions
   - https://github.com/OWASP-BLT/BLT-Extension/discussions

3. **OWASP Slack**: Real-time chat
   - Join #blt channel on OWASP Slack

4. **OWASP Project Page**: General info
   - https://owasp.org/www-project-bug-logging-tool/

### Reporting Bugs

Include:
- Extension version
- Browser and version
- Operating system
- Steps to reproduce
- Screenshots (if helpful)
- Console errors (if any)

### Requesting Features

Include:
- Clear description
- Use case
- Expected behavior
- Why it's useful

## Contributing

We welcome contributions!

- **Code**: Submit pull requests
- **Documentation**: Improve guides
- **Translations**: Add languages
- **Bug reports**: Help us improve
- **Testing**: Try new features

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## Changelog

See [Release Notes](https://github.com/OWASP-BLT/BLT-Extension/releases) for version history.

## License

MIT License - see [LICENSE](../LICENSE)

## About OWASP

The Open Web Application Security Project (OWASP) is a nonprofit foundation that works to improve the security of software. Learn more at [owasp.org](https://owasp.org).

---

**Thank you for using OWASP BLT Extension!** 🎉

For more information, visit the [project page](https://owasp.org/www-project-bug-logging-tool/).
