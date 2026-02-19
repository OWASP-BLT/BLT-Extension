# Privacy Policy

**Effective Date:** February 19, 2026  
**Last Updated:** February 19, 2026

## Overview

OWASP BLT Extension ("we", "our", "the extension") is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, how we protect it, and your rights regarding your information.

**TL;DR (Too Long; Didn't Read):**
- We store job application data **locally on your device only**
- We **don't send your data to external servers** (except trademark checks to OWASP BLT API)
- We **don't track you** or sell your data
- You have **full control** over your data (export, delete anytime)
- We use **minimal permissions** necessary for functionality

## Information We Collect

### Data Stored Locally

The extension stores the following data in your browser's local storage (`chrome.storage.local`):

#### 1. Job Application Data
When you use the job tracking feature:
- Company name
- Job position
- Job URL
- Application platform (LinkedIn, Wellfound, manual entry)
- Application status (Applied, Interview, Offer, Rejected)
- Application date

**Storage location:** Local browser storage only  
**Duration:** Until you manually delete it  
**Shared with:** No one - stays on your device

#### 2. User Preferences
- Theme preference (light/dark mode)
- Page size for job listing
- Sort preferences

**Storage location:** Local browser storage only  
**Duration:** Until you clear browser data or uninstall extension  
**Shared with:** No one

#### 3. Screenshot Data
When you take a screenshot:
- Screenshot image (temporarily)

**Storage location:** Browser memory, then downloaded to your device  
**Duration:** Temporary - immediately downloaded and removed from memory  
**Shared with:** No one - you control where it's saved

### Data Transmitted to External Services

#### OWASP BLT API (Trademark Scanning Only)

When you use the trademark scanning feature:
- **What's sent:** Keywords from the webpage you're scanning
- **Where it goes:** `https://owaspblt.org/api/trademarks/search`
- **Why:** To check if words are trademarked
- **What's returned:** Trademark status and information
- **What's logged:** The OWASP BLT API may log requests for abuse prevention (see their privacy policy)

**We do NOT send:**
- Your browsing history
- Your identity or account information
- Your job application data
- Your location
- Any personal information

#### No Other External Services

We **do not**:
- Use analytics or telemetry
- Connect to advertising networks
- Use social media tracking pixels
- Send data to third-party services (except trademark API as noted)
- Use cookies (except browser storage API)

## How We Use Your Information

### Local Data Usage

Your locally stored data is used to:

1. **Job Tracking**: Display your job applications, track status, and provide organizational features
2. **Screenshot Feature**: Temporarily process screenshots before download
3. **Trademark Scanning**: Highlight trademarked words on web pages you're viewing
4. **User Experience**: Remember your preferences (theme, display settings)

### We Do NOT Use Your Data For

- ❌ Selling to third parties
- ❌ Advertising or marketing
- ❌ User profiling or tracking
- ❌ Cross-site tracking
- ❌ Behavioral analysis
- ❌ Any purpose not explicitly described here

## Data Security

### How We Protect Your Data

1. **Local Storage Only**
   - Data never leaves your device (except trademark API requests)
   - No cloud sync or backups (by design)
   - Your data is protected by your browser's security

2. **Minimal Permissions**
   - We request only necessary permissions
   - No access to browsing history, passwords, or cookies (beyond necessary operations)

3. **Secure Communication**
   - All external API calls use HTTPS
   - No mixed content or insecure connections

4. **Code Security**
   - Open source - you can audit our code
   - Regular security reviews
   - Content Security Policy (CSP) enabled
   - No use of `eval()` or unsafe functions

### Limitations

**Important:** Data stored locally is protected by your browser's security, but:
- If someone has physical access to your device, they may access your data
- Local storage is **not encrypted** by Chrome (standard browser behavior)
- If malware is on your device, it may access browser storage
- Browser extensions with broad permissions could potentially access storage

**Recommendations:**
- Use a strong device password/PIN
- Keep your device and browser updated
- Use antivirus software
- Don't install untrusted extensions
- Log out of shared computers

## Your Rights and Choices

### Control Over Your Data

You have complete control:

#### 1. Export Your Data

You can export all job application data:
- Go to Job Tracking Dashboard
- Click "Export" button
- Choose CSV or JSON format
- Data is downloaded to your device

#### 2. Delete Your Data

**Delete individual entries:**
- Open Job Tracking Dashboard
- Click "Delete" next to any application

**Delete all data:**
```javascript
// In browser console (chrome://extensions/)
chrome.storage.local.clear();
```

Or uninstall the extension:
- Go to `chrome://extensions/`
- Click "Remove" on OWASP BLT Extension
- All data is automatically deleted

#### 3. Disable Features

You can choose not to use features:
- Don't use job tracking = no job data stored
- Don't use screenshot = no screenshots processed
- Don't use trademark scanner = no keywords sent to API

### No Account Required

The extension doesn't require:
- Account creation
- Login credentials
- Email address
- Personal information

It works entirely locally.

## Permissions Explained

The extension requests these Chrome permissions:

### Required Permissions

| Permission | Why We Need It | What It Accesses |
|------------|----------------|------------------|
| `activeTab` | To capture screenshots of current tab | Only the active tab when you click extension |
| `storage` | To save job applications and preferences | Local storage in your browser |
| `tabs` | To open job tracking dashboard | Create and manage extension tabs |
| `scripting` | To inject content scripts | Add features to LinkedIn, Wellfound, GitHub pages |
| `downloads` | To download screenshots | Browser download functionality |
| `alarms` | For scheduled features (future use) | Browser alarm API |
| `notifications` | To notify about job updates | Browser notification API |

### Host Permissions

| Permission | Why We Need It |
|------------|----------------|
| `<all_urls>` | To inject content scripts for screenshots, trademark scanning |
| `https://owaspblt.org/*` | To check trademarks against OWASP BLT API |
| `*://*.linkedin.com/*` | To monitor job applications on LinkedIn |
| `*://*.wellfound.com/*` | To monitor job applications on Wellfound |
| `*://github.com/*` | To add floating buttons on GitHub PR pages |

**Note:** `<all_urls>` is required for screenshot functionality (to work on any webpage). We only access pages when you explicitly use a feature.

## Third-Party Services

### OWASP BLT API

When using trademark scanning:
- **Service:** OWASP BLT Trademark API
- **Endpoint:** https://owaspblt.org/api/trademarks/search
- **Purpose:** Check if keywords are trademarked
- **Data sent:** Keywords from webpage
- **Their privacy policy:** https://owasp.org (see OWASP privacy policy)

### No Other Third Parties

We do **not** use:
- Google Analytics
- Facebook Pixel
- Advertising networks
- Crash reporting services (may add in future with opt-in)
- Error tracking services

## Children's Privacy

This extension is not directed to children under 13. We do not knowingly collect information from children. If you believe a child has provided data through our extension, please contact us.

## International Users

This extension is developed and maintained by OWASP, an international organization. The extension works globally and doesn't transfer data internationally (data stays on your device).

**For EU Users (GDPR):**
- **Right to access:** Export your data anytime
- **Right to deletion:** Delete data or uninstall extension
- **Right to portability:** Export in JSON/CSV format
- **Right to information:** This privacy policy

**For California Users (CCPA):**
- We don't sell your personal information
- We don't share your personal information
- You can delete your data anytime

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. When we do:

1. **Notification:** We'll update the "Last Updated" date at the top
2. **Major Changes:** For significant changes, we'll notify users via:
   - Extension update notes
   - GitHub repository announcement
   - In-extension notification

3. **Your Choice:** If you disagree with changes, you can stop using the extension

**Continued use** after changes means you accept the new Privacy Policy.

## Data Retention

- **Job application data:** Kept until you delete it or uninstall extension
- **User preferences:** Kept until you clear browser data or uninstall
- **Screenshots:** Never stored persistently (immediate download)
- **Trademark API requests:** Not stored by us (check OWASP BLT API policy)

## Compliance

This extension complies with:

- **GDPR** (General Data Protection Regulation) - EU
- **CCPA** (California Consumer Privacy Act) - California, USA
- **Chrome Web Store Policies** - Google Chrome
- **OWASP Privacy Standards** - OWASP Foundation

## Open Source Transparency

This extension is **open source**:
- **Source code:** https://github.com/OWASP-BLT/BLT-Extension
- **You can audit:** See exactly what the code does
- **Contributions welcome:** Help improve privacy features
- **No hidden behavior:** Everything is in the code

## Contact Us

### Questions About Privacy?

- **GitHub Issues:** (for non-sensitive questions)
- **Email:** security@owasp.org
- **OWASP Foundation:** https://owasp.org
- **Project page:** https://owasp.org/www-project-bug-logging-tool/

### Report Privacy Concerns

If you believe your privacy has been compromised:
1. Email: security@owasp.org
2. Include: Details of the concern and steps to reproduce
3. We'll investigate and respond within 48 hours

## Summary

**What we collect:**
- Job application data (locally only)
- User preferences (locally only)
- Keywords for trademark checking (sent to OWASP API)

**What we DON'T do:**
- Track you
- Sell your data
- Share with third parties (except trademark API)
- Store data on servers
- Use cookies or tracking pixels

**Your control:**
- Export data anytime
- Delete data anytime
- Uninstall completely removes all data

**Security:**
- Local storage only
- HTTPS for all external requests
- Open source (audit anytime)
- Minimal permissions
- Regular security reviews

## Acknowledgments

This privacy policy was created with transparency and user rights in mind, following:
- OWASP privacy guidelines
- GDPR requirements
- Chrome Web Store policies
- Industry best practices

Thank you for trusting OWASP BLT Extension! 🔒

---

**Version:** 1.0  
**Effective Date:** February 19, 2026  
**Contact:** security@owasp.org  
**Project:** https://github.com/OWASP-BLT/BLT-Extension
