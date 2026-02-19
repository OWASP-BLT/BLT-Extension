# Security Policy# Security Policy















































































































































































































































































































































































































































































































































Thank you for helping keep OWASP BLT Extension secure! 🔒**Contact:** security@owasp.org**Version:** 1.0**Last Updated:** February 19, 2026---- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)- [Chrome Extension Security Best Practices](https://developer.chrome.com/docs/extensions/mv3/security/)- [OWASP Chrome Extension Security Guide](https://owasp.org)## Additional Resources- [Your name could be here! - Report security issues responsibly]We thank the following security researchers for responsibly disclosing vulnerabilities:## Acknowledgments- **OWASP Foundation:** [https://owasp.org](https://owasp.org)- **Project maintainers:** [See MAINTAINERS.md]- **General security inquiries:** security@owasp.org## Security Contacts- Data usage and privacy requirements- Chrome Extension Platform policies- Chrome Web Store Developer Program PoliciesWe comply with:### Chrome Web Store Policies- OWASP Secure Coding Practices- OWASP Testing Guide- OWASP ASVS (Application Security Verification Standard)- OWASP Top 10As an OWASP project, we adhere to:### OWASP Standards## Compliance   - Documentation updates   - Process improvements   - Lessons learned5. **Post-Incident**   - OWASP notification   - User notification   - Public advisory4. **Communication**   - Verify effectiveness   - Deploy patch   - Develop and test fix3. **Remediation**   - Evidence collection   - Scope determination   - Root cause analysis2. **Investigation**   - Notify affected users (if applicable)   - Assess the impact   - Contain the breach1. **Immediate Actions**If a security incident occurs:### In Case of Security Breach## Incident Response- **Jest tests**: Include security test cases- **Code scanning**: Static analysis (if configured)- **GitHub Dependabot**: Automated dependency updates- **npm audit**: Dependency vulnerability scanningWe use automated tools:### Automated Security Checks- [ ] Review third-party API interactions- [ ] Test with malicious inputs- [ ] Review console logs for sensitive data- [ ] Test error handling- [ ] Validate all user inputs- [ ] Check CSP configuration- [ ] Review permissions in manifest.json- [ ] Test in multiple browsers- [ ] Manual security review of changes- [ ] Run `npm audit` and resolve all issuesBefore each release, we complete:### Pre-Release Security Checklist## Security Testing   - Automated Dependabot alerts enabled   - Immediate response to critical CVEs   - Monthly security update reviews3. **Regular Updates**   - Document version changes   - Test updates before merging   - Use exact versions in package.json2. **Version Pinning**   - Review all new dependencies   - Prefer native APIs when possible   - Avoid unnecessary dependencies1. **Minimal Dependencies**### Dependency Policy```npm audit <package-name># Review specific packagenpm audit fix# Fix vulnerabilitiesnpm audit# Check for vulnerabilities```bashWe regularly audit dependencies for known vulnerabilities:### Auditing Dependencies## Dependency Management   - Clear privacy policy (see PRIVACY.md)   - Users can delete all data   - Users can export their data3. **User Control**   - No third-party tracking scripts   - No analytics or telemetry by default2. **No Tracking**   - No data sent to external servers (except BLT API for trademark checks)   - All data stored locally using `chrome.storage.local`1. **Local Storage Only**### Data Privacy- Webcam/microphone- Geolocation- Cookie access (except necessary for functionality)- Bookmark access- History access**We do NOT request:**- **notifications**: Notify users of events- **alarms**: Schedule periodic checks- **downloads**: Download screenshots- **scripting**: Inject content scripts for monitoring- **tabs**: Manage tabs for job tracking- **storage**: Store job applications locally- **activeTab**: Only access current tab when user clicks extensionWe request minimal permissions:### Permission Model- Use of `eval()` and related functions- Loading external scripts- Execution of inline scriptsThis prevents:```}  }    "extension_pages": "script-src 'self'; object-src 'self'"  "content_security_policy": {{```jsonOur extension implements a strict CSP:### Content Security Policy## Security Features    - Implement error tracking    - Monitor for unusual patterns    - Log security-relevant events (without sensitive data)10. **Insufficient Logging & Monitoring**   - Review dependency changes   - Keep dependencies updated   - Run `npm audit` regularly9. **Using Components with Known Vulnerabilities**   - Use safe serialization methods   - Don't deserialize untrusted data   - Validate JSON before parsing8. **Insecure Deserialization**   - Implement CSP   - Use textContent or sanitization libraries   - Never use `eval()` or `innerHTML` with user content7. **Cross-Site Scripting (XSS)**   - Keep dependencies updated   - Disable dangerous features   - Use Content Security Policy (CSP)6. **Security Misconfiguration**   - Implement principle of least privilege   - Don't trust client-side checks   - Verify permissions before operations5. **Broken Access Control**   - Not applicable (we don't process XML)4. **XML External Entities (XXE)**   - Minimize data collection   - Encrypt data in transit (HTTPS)   - Don't log sensitive information3. **Sensitive Data Exposure**   - Use secure session management   - Don't store credentials   - Never implement custom authentication (use OAuth/existing systems)2. **Broken Authentication**   - Validate data types and formats   - Use parameterized queries/API calls   - Sanitize all user input1. **Injection Flaws**We follow OWASP principles adapted for browser extensions:### OWASP Top 10 for Chrome Extensions```}  "permissions": ["<all_urls>", "tabs", "history", "cookies"]{// ❌ Bad: Requesting excessive permissions}  "host_permissions": ["https://owaspblt.org/*"]  "permissions": ["activeTab", "storage"],{// ✅ Good: Request only necessary permissions```json#### 6. Permission Minimization```}  }    throw error;    console.error('Trademark check failed:', error);  } catch (error) {    return data;        }      throw new Error('Invalid response format');    if (!isValidTrademarkResponse(data)) {    // Validate data structure        const data = await response.json();        }      throw new Error(`HTTP ${response.status}`);    if (!response.ok) {    // Validate response        const response = await fetch(url);  try {    const url = `https://owaspblt.org/api/trademarks/search?query=${encodeURIComponent(keyword)}`;async function checkTrademark(keyword) {// ✅ Good: Use HTTPS and validate responses```javascript#### 5. API Communication```});  preferences: userPreferences  jobApplications: sanitizedApplications,await chrome.storage.local.set({// ✅ Good: Store only necessary, non-sensitive data// - Credit card information// - Authentication tokens// - API keys// - Passwords// DON'T store in chrome.storage.local (not encrypted):// BLT Extension doesn't handle passwords or tokens, but if it did:// ✅ Good: Never store sensitive data in local storage```javascript#### 4. Secure Storage```}  window.open(url); // Could be javascript: or data: URLfunction openJobUrl(url) {// ❌ Bad: No validation}  }    return false;  } catch {    return ['http:', 'https:'].includes(parsed.protocol);    // Only allow http and https    const parsed = new URL(url);  try {function isValidJobUrl(url) {// ✅ Good: Validate URLs before use```javascript#### 3. URL Validation```element.innerHTML = userInput; // XSS vulnerability!// ❌ Bad: Direct innerHTML assignmentelement.innerHTML = DOMPurify.sanitize(userInput);// OR sanitize properlyelement.textContent = userInput;// ✅ Good: Use textContent or sanitize before innerHTML```javascript#### 2. Output Encoding```}  storage.save(data); // Vulnerable to injection attacksfunction saveJobApplication(data) {// ❌ Bad: No validation}  return storage.save(sanitized);    };    url: validateUrl(data.url)    position: sanitizeText(data.position),    company: sanitizeText(data.company),  const sanitized = {  // Sanitize input    }    throw new Error('Invalid company name');  if (!data.company || typeof data.company !== 'string') {  // Validate required fieldsfunction saveJobApplication(data) {// ✅ Good: Validate and sanitize all user input```javascript#### 1. Input ValidationAll contributors must follow these security guidelines:### Secure Coding Guidelines## Security Best Practices for Contributors- **Response time:** 2-4 weeks- Minor configuration issues- Information disclosure (minimal impact)**Low (CVSS 0.1-3.9)**- **Response time:** 1-2 weeks- Denial of service- XSS or CSRF vulnerabilities- Limited data exposure**Medium (CVSS 4.0-6.9)**- **Response time:** 1-7 days- Privilege escalation- Authentication bypass- Significant data exposure**High (CVSS 7.0-8.9)**- **Response time:** Immediate (hours to days)- Large-scale data breach- Complete system compromise- Remote code execution**Critical (CVSS 9.0-10.0)**We use the CVSS (Common Vulnerability Scoring System) to assess severity:### Severity Classification   - Credit given to reporter (unless you prefer to remain anonymous)   - Public advisory published   - Security patch released5. **Release and Credit**   - May be shorter for critical issues with active exploitation   - Typically 90 days from report to public disclosure   - We work with you to establish a disclosure timeline4. **Coordinated Disclosure**   - You may be asked for additional information   - Critical issues receive immediate attention   - Timeline depends on severity and complexity3. **Fix Development (1-4 weeks)**   - Impact assessment   - Reproduction of the issue   - Detailed technical analysis2. **Investigation (3-7 days)**   - Initial assessment of severity and impact   - We will confirm receipt of your report1. **Acknowledgment (24-48 hours)**### What Happens Next?7. **Your contact information** for follow-up questions6. **Suggested remediation** (if you have ideas)5. **Potential impact** and attack scenarios4. **Proof of concept** (code, screenshots, video)3. **Steps to reproduce** the issue2. **Affected component(s)** and version(s)1. **Clear description** of the vulnerabilityTo help us understand and address the issue quickly, please include:### What to Include in Your Report- **OWASP Mailing List:** security@owasp.org (for all OWASP projects)- **OWASP Slack:** Direct message to project maintainers on OWASP Slack (#blt channel)#### 3. OWASP Channels```Contact: [Your email]Name: [Your name/handle]Researcher Information:[If you have recommendations]Suggested Fix:[Code, screenshots, or video demonstration]Proof of Concept:[What can an attacker do with this vulnerability?]Impact:3. [Result]2. [Step 2]1. [Step 1]Steps to Reproduce:[Detailed description of the vulnerability]Description:Affected Versions: [e.g., 1.5.0 and below]Severity: [Critical/High/Medium/Low]Vulnerability Type: [e.g., XSS, Data Exposure, Permission Bypass]Subject: [SECURITY] BLT Extension Vulnerability Report```**Email Template:**- **Project specific:** [maintainer emails - see MAINTAINERS.md]- **Primary:** security@owasp.orgSend vulnerability reports to:#### 2. Email Reporting- Coordinated disclosure timeline- CVE assignment if applicable- Structured format- Private communication with maintainers**Benefits:**4. Submit the advisory   - Suggested fix (if you have one)   - Potential impact   - Steps to reproduce   - Description of the vulnerability3. Fill out the advisory form with:2. Click **"Report a vulnerability"**1. Go to the [Security tab](https://github.com/OWASP-BLT/BLT-Extension/security) of the repository#### 1. GitHub Security Advisory (Preferred)We provide multiple channels for reporting security vulnerabilities:### How to ReportPublic disclosure of security vulnerabilities before a fix is available can put users at risk. Please follow our responsible disclosure process.**IMPORTANT:** If you discover a security vulnerability, **DO NOT** open a public GitHub issue.### Security First Approach## Reporting a Vulnerability**Recommendation:** Always use the latest stable version to ensure you have the most recent security patches.| < 1.3   | :x:                | No longer supported            || 1.3.x   | :x:                | End of life                    || 1.4.x   | :white_check_mark: | Previous stable (6 months)     || 1.5.x   | :white_check_mark: | Current stable release         || ------- | ------------------ | ------------------------------ || Version | Supported          | Notes                          |We actively support and provide security updates for the following versions:## Supported VersionsThe OWASP BLT Extension is a security-focused project under the OWASP Foundation. We take the security of our code, our users' data, and the broader community seriously. This document outlines our security policies, vulnerability reporting procedures, and secure development practices.## Overview
## Overview

The OWASP BLT Extension is a security-focused project under the OWASP Foundation. We take security seriously and appreciate the community's help in identifying and resolving security vulnerabilities.

This document outlines our security policies, how to report vulnerabilities, and what to expect from the security process.

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          | Status      |
| ------- | ------------------ | ----------- |
| 1.5.x   | :white_check_mark: | Current     |
| 1.4.x   | :white_check_mark: | Maintenance |
| < 1.4   | :x:                | Unsupported |

**Recommendation:** Always use the latest version from the [Releases](https://github.com/OWASP-BLT/BLT-Extension/releases) page or the Chrome Web Store.

## Reporting a Vulnerability

### Private Disclosure

**IMPORTANT:** Please **DO NOT** file a public issue for security vulnerabilities.

We request that you privately disclose security issues to allow time for a fix before public disclosure.

### How to Report

Choose one of the following methods:

#### 1. GitHub Security Advisory (Preferred)

1. Go to the [Security tab](https://github.com/OWASP-BLT/BLT-Extension/security)
2. Click **"Report a vulnerability"**
3. Fill out the advisory form with details
4. Submit privately to maintainers

#### 2. Email

Send an email to:
- **Primary:** security@owasp.org
- **CC:** Project maintainers (see MAINTAINERS.md)

**Email Template:**
```
Subject: [SECURITY] Brief description of vulnerability

**Summary:**
Brief description of the vulnerability

**Affected Components:**
- File/module affected
- Version(s) affected

**Vulnerability Type:**
(e.g., XSS, CSRF, Injection, etc.)

**Severity Assessment:**
(Low/Medium/High/Critical)

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Proof of Concept:**
[Code or screenshots demonstrating the issue]

**Potential Impact:**
What an attacker could do with this vulnerability

**Suggested Fix:**
(If you have suggestions)

**Your Details:**
- Name: [Your name for credit]
- Contact: [Your email]
- Want public credit: Yes/No
```

### What to Include in Reports

A good security report should include:

1. **Description** - Clear summary of the vulnerability
2. **Impact** - What can an attacker do?
3. **Affected versions** - Which versions are vulnerable?
4. **Reproduction steps** - Detailed steps to reproduce
5. **Proof of Concept** - Code, screenshots, or video demonstrating the issue
6. **Suggested fix** - Optional but appreciated
7. **Your contact info** - For follow-up and credit

### What to Expect

When you report a vulnerability:

1. **Acknowledgment** - Within 48 hours
   - Confirmation we received your report
   - Initial severity assessment
   - Expected timeline for response

2. **Investigation** - 1-7 days
   - Reproduce and verify the issue
   - Assess severity and impact
   - Develop a fix
   - Regular updates via email

3. **Resolution** - Varies by severity
   - **Critical:** Patch within 7 days
   - **High:** Patch within 14 days
   - **Medium:** Patch within 30 days
   - **Low:** Patch in next regular release

4. **Public Disclosure** - After fix is released
   - Security advisory published
   - CVE assigned (if applicable)
   - Credit given to reporter (if desired)
   - Release notes updated

## Severity Assessment

We use the CVSS v3.1 scoring system to assess severity:

### Critical (9.0-10.0)
- Remote code execution
- Authentication bypass
- Complete system compromise
- Widespread data exposure

**Response:** Immediate patch, emergency release

### High (7.0-8.9)
- Cross-site scripting (XSS) with significant impact
- SQL injection
- Privilege escalation
- Sensitive data exposure

**Response:** Patch within 14 days, priority release

### Medium (4.0-6.9)
- Cross-site request forgery (CSRF)
- Information disclosure (limited)
- Denial of service (limited impact)

**Response:** Patch within 30 days, regular release

### Low (0.1-3.9)
- Minor information disclosure
- Security best practice violations
- Low-impact issues

**Response:** Patch in next regular release

## Security Best Practices

### For Users

1. **Keep Updated**
   - Enable automatic extension updates in Chrome
   - Check for updates regularly: `chrome://extensions/`
   - Subscribe to security advisories

2. **Review Permissions**
   - Understand what permissions the extension requests
   - See [PRIVACY.md](PRIVACY.md) for data handling details

3. **Report Suspicious Behavior**
   - Unexpected permission requests
   - Unusual network activity
   - Unexpected behavior changes

4. **Secure Your Account**
   - Use strong, unique passwords for BLT account
   - Enable 2FA if available
   - Don't share credentials

### For Developers

1. **Input Validation**
   ```javascript
   // ✅ Good: Validate and sanitize all user input
   function sanitizeInput(input) {
     if (typeof input !== 'string') return '';
     return input.trim().replace(/[<>]/g, '');
   }

   // ❌ Bad: Using user input directly
   element.innerHTML = userInput; // XSS vulnerability!
   ```

2. **Output Encoding**
   ```javascript
   // ✅ Good: Use textContent or properly encode
   element.textContent = userData;

   // ✅ Good: Validate URLs before navigation
   function isValidUrl(url) {
     try {
       const parsed = new URL(url);
       return ['http:', 'https:'].includes(parsed.protocol);
     } catch {
       return false;
     }
   }
   ```

3. **Content Security Policy**
   ```json
   // manifest.json
   "content_security_policy": {
     "extension_pages": "script-src 'self'; object-src 'self'"
   }
   ```

4. **Secure Storage**
   ```javascript
   // ✅ Good: Don't store sensitive data in local storage
   // Use chrome.storage.local for extension data
   // Never store: passwords, tokens, API keys, PII

   // ✅ Good: Clear sensitive data when no longer needed
   await chrome.storage.local.remove(['temporaryAuth']);
   ```

5. **API Security**
   ```javascript
   // ✅ Good: Validate API responses
   async function fetchData(url) {
     try {
       const response = await fetch(url);
       if (!response.ok) {
         throw new Error(`HTTP ${response.status}`);
       }
       const data = await response.json();
       // Validate data structure
       if (!isValidData(data)) {
         throw new Error('Invalid API response');
       }
       return data;
     } catch (error) {
       console.error('API error:', error);
       // Don't expose sensitive error details to users
       throw new Error('Failed to fetch data');
     }
   }
   ```

6. **Permission Minimization**
   ```json
   // manifest.json
   // Only request permissions you actually need
   "permissions": [
     "activeTab",    // Only currently active tab
     "storage"       // Local storage only
   ],
   // Avoid:
   // "tabs" - if you only need activeTab
   // "<all_urls>" - if you only need specific domains
   ```

## Known Security Considerations

### Current Security Measures

1. **Manifest V3** - Using latest security standards
2. **Content Security Policy** - Restricts inline scripts and sources
3. **Host Permissions** - Limited to necessary domains only
4. **Input Sanitization** - User input is validated and sanitized
5. **No eval()** - No dynamic code execution
6. **HTTPS Only** - All external API calls use HTTPS

### Potential Risk Areas

Users and developers should be aware of:

1. **Local Storage** - Job applications stored locally (not encrypted)
   - Mitigation: Data stays on user's machine, not transmitted
   - Consideration: Use encryption for sensitive data in future

2. **Cross-Origin Requests** - Extension makes API calls to owaspblt.org
   - Mitigation: Uses HTTPS, validates responses
   - Consideration: Implement request signing in future

3. **Content Scripts** - Injected into web pages
   - Mitigation: Limited to specific domains, sandboxed
   - Consideration: Follow CSP and same-origin policies

## Security Features

### Current Implementation

1. **Trademark Scanning**
   - API validation and error handling
   - Rate limiting to prevent abuse
   - No sensitive data in requests

2. **Job Tracking**
   - Local-only storage (not synced)
   - No automatic cloud backup
   - User controls all data

3. **Screenshot Capture**
   - Requires explicit user action
   - No automatic uploads
   - Uses secure Chrome API

4. **LinkedIn/Wellfound Monitoring**
   - Content scripts with limited scope
   - No credential interception
   - Data stored locally only

## Vulnerability Disclosure Policy

### Coordinated Disclosure

We follow a **coordinated disclosure** process:

1. **Private Report** - Reporter contacts maintainers privately
2. **Acknowledgment** - Maintainers confirm receipt within 48 hours
3. **Investigation** - Maintainers investigate and develop fix
4. **Fix Development** - Patch is developed and tested
5. **Release** - Security patch is released
6. **Public Disclosure** - After users have had time to update (typically 7-14 days)
7. **Advisory** - Security advisory published with details

### Disclosure Timeline

- **Critical vulnerabilities:** 0-7 days before disclosure
- **High vulnerabilities:** 7-14 days before disclosure
- **Medium vulnerabilities:** 14-30 days before disclosure
- **Low vulnerabilities:** 30-90 days before disclosure

### Credit and Recognition

We believe in recognizing security researchers:

- **Hall of Fame** - Security researchers who report valid vulnerabilities
- **CVE Credit** - Named in CVE if applicable
- **Release Notes** - Mentioned in security release notes
- **Swag/Bounty** - At project maintainer's discretion

## Security Hall of Fame

Thank you to researchers who have helped improve our security:

<!-- Contributors will be listed here after first security report -->
_No security vulnerabilities disclosed yet (or none requiring public disclosure)_

## Compliance and Standards

This project follows:

- **OWASP Top 10** - Web application security risks
- **OWASP ASVS** - Application Security Verification Standard
- **OWASP SAMM** - Software Assurance Maturity Model
- **CWE** - Common Weakness Enumeration
- **CVSS v3.1** - Common Vulnerability Scoring System

## Additional Security Resources

### OWASP Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

### Chrome Extension Security

- [Chrome Extension Security](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Content Security Policy](https://developer.chrome.com/docs/apps/contentSecurityPolicy/)
- [Permission Warnings](https://developer.chrome.com/docs/extensions/mv3/permission_warnings/)

### Security Tools

- **OWASP ZAP** - Web application security scanner
- **Burp Suite** - Web vulnerability scanner
- **npm audit** - Dependency vulnerability scanner
- **Snyk** - Continuous security scanning

## Security Updates

Subscribe to security notifications:

1. **Watch this repository** on GitHub (Security alerts only)
2. **GitHub Security Advisories** - Auto-notification if you have the extension installed
3. **OWASP BLT Mailing List** - Subscribe at https://owasp.org/www-project-bug-logging-tool/

## Questions?

For security-related questions that are not vulnerabilities:

- **General questions:** Open a GitHub Discussion
- **Security best practices:** See [CONTRIBUTING.md](CONTRIBUTING.md#security)
- **Privacy questions:** See [PRIVACY.md](PRIVACY.md)

---

**Remember:** If you discover a security vulnerability, please report it privately using the methods outlined above. Thank you for helping keep OWASP BLT Extension secure!
