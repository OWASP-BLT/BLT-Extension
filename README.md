# BLT Extension for Chrome

BLT is a Chrome extension that enables users to take screenshots or capture specific sections of webpages and quickly add them to the BLT website. This tool is perfect for users who need to save, annotate, or share parts of a webpage easily.

## Installation Instructions

### For Google Chrome

1. **Download the Extension**: Download the latest version of BLT from the [Releases](https://github.com/OWASP-BLT/BLT-Extension/releases) page on GitHub.

2. **Unzip the File**: After downloading, unzip the file to a directory on your computer.

3. **Load the Extension in Chrome**:
    - Open Google Chrome.
    - Navigate to `chrome://extensions/`.
    - Enable "Developer mode" by toggling the switch in the top right corner.
    - Click on "Load unpacked".
    - Browse to and select the unzipped BLT extension directory.

### Usage

Once installed, using BLT is straightforward:
- Navigate to the webpage you want to capture.
- Activate the BLT extension by clicking on the extension icon.
- Select the area of the webpage you want to capture or take a full-page screenshot.
- The captured content will be automatically uploaded to the BLT website, where you can further annotate, save, or share it.

## Development and Building

### Building the Extension

To build the extension package for distribution:

```bash
npm run build
```

This will create a `dist/extension.zip` file that can be uploaded to the Chrome Web Store.

### Publishing to Chrome Web Store

The extension is automatically published to the Chrome Web Store when a new tag is pushed to the repository. The release workflow handles:
- Building the extension package
- Uploading to the Chrome Web Store
- Publishing the new version

To trigger a release:

1. Create and push a new tag:
   ```bash
   git tag v1.4.1
   git push origin v1.4.1
   ```

2. The GitHub Actions workflow will automatically:
   - Build the extension package
   - Upload it to the Chrome Web Store using the stored API credentials
   - Publish the new version

**Note**: The Chrome Web Store API credentials (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN) must be configured as GitHub repository secrets for automatic publishing to work.

### Manual Upload

If you need to manually upload to the Chrome Web Store:

1. Build the extension: `npm run build`
2. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
3. Select your extension
4. Click "Upload Updated Package"
5. Upload the `dist/extension.zip` file
6. Fill in any required information and submit for review

### Support

Encounter any issues or have questions? Please file an issue on our GitHub [Issues](../issues) page.


https://www.github.com/OWASP/BLT  
https://www.github.com/OWASP/BLT-Flutter  
https://www.github.com/OWASP/BLT-Extension  
https://www.github.com/OWASP/BLT-Bacon  
https://www.github.com/OWASP/BLT-Action  


https://owasp.org/www-project-bug-logging-tool/
