// OWASP BLT Extension - Background Service Worker (Manifest V3)
'use strict';

// Track active uploads and notification state
const uploadState = {};

// ─── MD5 helper (needed for BLT upload URL hash) ─────────────────────────────
function md5(str) {
  function safeAdd(x, y) {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function rotateLeft(num, cnt) { return (num << cnt) | (num >>> (32 - cnt)); }
  function md5cmn(q, a, b, x, s, t) { return safeAdd(rotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b); }
  function md5ff(a, b, c, d, x, s, t) { return md5cmn((b & c) | (~b & d), a, b, x, s, t); }
  function md5gg(a, b, c, d, x, s, t) { return md5cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function md5hh(a, b, c, d, x, s, t) { return md5cmn(b ^ c ^ d, a, b, x, s, t); }
  function md5ii(a, b, c, d, x, s, t) { return md5cmn(c ^ (b | ~d), a, b, x, s, t); }

  const CHARS = '0123456789abcdef';
  function hexByte(n) { return CHARS[(n >> 4) & 0x0f] + CHARS[n & 0x0f]; }
  function hexWord(v) {
    return hexByte(v & 0xff) + hexByte((v >> 8) & 0xff) + hexByte((v >> 16) & 0xff) + hexByte((v >> 24) & 0xff);
  }

  function processBlock(m, a0, b0, c0, d0) {
    let a = a0, b = b0, c = c0, d = d0;
    a = md5ff(a,b,c,d, m[0],7,-680876936);   d = md5ff(d,a,b,c, m[1],12,-389564586);
    c = md5ff(c,d,a,b, m[2],17,606105819);   b = md5ff(b,c,d,a, m[3],22,-1044525330);
    a = md5ff(a,b,c,d, m[4],7,-176418897);   d = md5ff(d,a,b,c, m[5],12,1200080426);
    c = md5ff(c,d,a,b, m[6],17,-1473231341); b = md5ff(b,c,d,a, m[7],22,-45705983);
    a = md5ff(a,b,c,d, m[8],7,1770035416);   d = md5ff(d,a,b,c, m[9],12,-1958414417);
    c = md5ff(c,d,a,b, m[10],17,-42063);     b = md5ff(b,c,d,a, m[11],22,-1990404162);
    a = md5ff(a,b,c,d, m[12],7,1804603682);  d = md5ff(d,a,b,c, m[13],12,-40341101);
    c = md5ff(c,d,a,b, m[14],17,-1502002290);b = md5ff(b,c,d,a, m[15],22,1236535329);
    a = md5gg(a,b,c,d, m[1],5,-165796510);   d = md5gg(d,a,b,c, m[6],9,-1069501632);
    c = md5gg(c,d,a,b, m[11],14,643717713);  b = md5gg(b,c,d,a, m[0],20,-373897302);
    a = md5gg(a,b,c,d, m[5],5,-701558691);   d = md5gg(d,a,b,c, m[10],9,38016083);
    c = md5gg(c,d,a,b, m[15],14,-660478335); b = md5gg(b,c,d,a, m[4],20,-405537848);
    a = md5gg(a,b,c,d, m[9],5,568446438);    d = md5gg(d,a,b,c, m[14],9,-1019803690);
    c = md5gg(c,d,a,b, m[3],14,-187363961);  b = md5gg(b,c,d,a, m[8],20,1163531501);
    a = md5gg(a,b,c,d, m[13],5,-1444681467); d = md5gg(d,a,b,c, m[2],9,-51403784);
    c = md5gg(c,d,a,b, m[7],14,1735328473);  b = md5gg(b,c,d,a, m[12],20,-1926607734);
    a = md5hh(a,b,c,d, m[5],4,-378558);      d = md5hh(d,a,b,c, m[8],11,-2022574463);
    c = md5hh(c,d,a,b, m[11],16,1839030562); b = md5hh(b,c,d,a, m[14],23,-35309556);
    a = md5hh(a,b,c,d, m[1],4,-1530992060);  d = md5hh(d,a,b,c, m[4],11,1272893353);
    c = md5hh(c,d,a,b, m[7],16,-155497632);  b = md5hh(b,c,d,a, m[10],23,-1094730640);
    a = md5hh(a,b,c,d, m[13],4,681279174);   d = md5hh(d,a,b,c, m[0],11,-358537222);
    c = md5hh(c,d,a,b, m[3],16,-722521979);  b = md5hh(b,c,d,a, m[6],23,76029189);
    a = md5hh(a,b,c,d, m[9],4,-640364487);   d = md5hh(d,a,b,c, m[12],11,-421815835);
    c = md5hh(c,d,a,b, m[15],16,530742520);  b = md5hh(b,c,d,a, m[2],23,-995338651);
    a = md5ii(a,b,c,d, m[0],6,-198630844);   d = md5ii(d,a,b,c, m[7],10,1126891415);
    c = md5ii(c,d,a,b, m[14],15,-1416354905);b = md5ii(b,c,d,a, m[5],21,-57434055);
    a = md5ii(a,b,c,d, m[12],6,1700485571);  d = md5ii(d,a,b,c, m[3],10,-1894986606);
    c = md5ii(c,d,a,b, m[10],15,-1051523);   b = md5ii(b,c,d,a, m[1],21,-2054922799);
    a = md5ii(a,b,c,d, m[8],6,1873313359);   d = md5ii(d,a,b,c, m[15],10,-30611744);
    c = md5ii(c,d,a,b, m[6],15,-1560198380); b = md5ii(b,c,d,a, m[13],21,1309151649);
    a = md5ii(a,b,c,d, m[4],6,-145523070);   d = md5ii(d,a,b,c, m[11],10,-1120210379);
    c = md5ii(c,d,a,b, m[2],15,718787259);   b = md5ii(b,c,d,a, m[9],21,-343485551);
    return [safeAdd(a, a0), safeAdd(b, b0), safeAdd(c, c0), safeAdd(d, d0)];
  }

  // UTF-8 encode
  let encoded = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code < 128) {
      encoded += String.fromCharCode(code);
    } else if (code < 2048) {
      encoded += String.fromCharCode((code >> 6) | 192, (code & 63) | 128);
    } else {
      encoded += String.fromCharCode((code >> 12) | 224, ((code >> 6) & 63) | 128, (code & 63) | 128);
    }
  }

  const len = encoded.length;
  const blocks = [];
  for (let i = 0; i < len; i++) {
    blocks[i >> 2] = (blocks[i >> 2] || 0) | (encoded.charCodeAt(i) << ((i % 4) * 8));
  }
  blocks[len >> 2] = (blocks[len >> 2] || 0) | (0x80 << ((len % 4) * 8));
  const padIdx = 14 + (((len + 8) >> 6) << 4);
  while (blocks.length <= padIdx + 1) blocks.push(0);
  blocks[padIdx] = len * 8;
  blocks[padIdx + 1] = len >>> 29;

  let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < blocks.length; i += 16) {
    [a, b, c, d] = processBlock(blocks.slice(i, i + 16), a, b, c, d);
  }
  return hexWord(a) + hexWord(b) + hexWord(c) + hexWord(d);
}

// ─── Notifications ────────────────────────────────────────────────────────────
chrome.notifications.onClicked.addListener(function (notificationId) {
  chrome.notifications.clear(notificationId);
});

chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonIndex) {
  const state = uploadState[notificationId];
  if (!state) return;

  if (state.status === 'uploading' && buttonIndex === 0) {
    // Cancel
    state.cancelled = true;
    chrome.notifications.clear(notificationId);
    delete uploadState[notificationId];
  } else if (state.status === 'success') {
    if (buttonIndex === 0 && state.url) {
      chrome.tabs.create({ url: state.url });
    }
    chrome.notifications.clear(notificationId);
    delete uploadState[notificationId];
  } else if (state.status === 'failed') {
    if (buttonIndex === 0 && state.uploadData) {
      // Retry
      performUpload(notificationId, state.uploadData);
    } else {
      chrome.notifications.clear(notificationId);
      delete uploadState[notificationId];
    }
  }
});

// ─── Message handler ──────────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request) return false;

  if (request.action === 'takeScreenshot') {
    captureScreenshot();
    sendResponse({ success: true });
    return false;
  }

  if (request.name === 'load_screenshot') {
    const key = request.id;
    chrome.storage.local.get(key, function (result) {
      const data = result[key] || '';
      chrome.storage.local.remove(key);
      sendResponse(data);
    });
    return true; // async response
  }

  if (request.name === 'upload_screenshot') {
    handleUploadRequest(request.id, sendResponse);
    return true; // async response
  }

  if (request.action === 'jobTracking') {
    chrome.tabs.create({ url: chrome.runtime.getURL('jobtracking.html') });
    sendResponse({ success: true });
    return false;
  }

  return false;
});

// ─── Screenshot capture ───────────────────────────────────────────────────────
function captureScreenshot() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (!tabs || !tabs[0]) return;

    const currentUrl = tabs[0].url;

    chrome.tabs.captureVisibleTab(null, { format: 'png' }, function (dataUrl) {
      if (chrome.runtime.lastError || !dataUrl) return;

      const key = 'screenshot_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);

      chrome.storage.local.set({ [key]: dataUrl, global_url: currentUrl }, function () {
        chrome.tabs.create({
          url: chrome.runtime.getURL('screenshot.html?id=' + key)
        });
      });
    });
  });
}

// ─── Upload handling ──────────────────────────────────────────────────────────
function handleUploadRequest(key, sendResponse) {
  chrome.storage.local.get([key, 'global_url'], function (result) {
    const uploadData = result[key];
    const globalUrl = result['global_url'] || '';

    chrome.storage.local.remove(key);
    sendResponse(); // Let screenshot.html close immediately

    if (uploadData) {
      performUpload(key, Object.assign({}, uploadData, { globalUrl: globalUrl }));
    }
  });
}

async function performUpload(key, data) {
  if (!data || !data.dataUrl) return;

  // Show uploading notification
  chrome.notifications.create(key, {
    type: 'progress',
    title: 'OWASP BLT-Extension',
    message: 'Uploading screenshot...',
    iconUrl: 'img/icon256.png',
    buttons: [{ title: 'Cancel' }],
    isClickable: true,
    progress: 0
  });
  uploadState[key] = { status: 'uploading', uploadData: data };

  try {
    // Convert data URL to Blob via fetch
    const blobRes = await fetch(data.dataUrl);
    const blob = await blobRes.blob();

    const apiKey = '5CE3DF4D45AC';
    const time = Math.floor(Date.now() / 1000);
    const hash = md5(apiKey + '*' + time);
    const uploadUrl = 'https://www.bugheist.com/upload/' + time + '/' + hash + '/';

    if (uploadState[key] && uploadState[key].cancelled) return;

    const formData = new FormData();
    formData.append('image', blob, 'image.png');

    const response = await fetch(uploadUrl, { method: 'POST', body: formData });

    if (!response.ok) throw new Error('Upload failed: ' + response.status);

    const reportUrl = 'https://www.bugheist.com/report/?hash=' + hash + '&time=' + time +
      '&url=' + encodeURIComponent(data.globalUrl || '');

    uploadState[key] = { status: 'success', url: reportUrl };

    chrome.notifications.update(key, {
      type: 'basic',
      title: 'OWASP BLT-Extension',
      message: 'Screenshot uploaded successfully!',
      iconUrl: 'img/icon256.png',
      buttons: [{ title: 'Open Link' }]
    });

    chrome.tabs.create({ url: reportUrl });

  } catch (err) {
    uploadState[key] = { status: 'failed', uploadData: data };

    chrome.notifications.update(key, {
      type: 'basic',
      title: 'OWASP BLT-Extension',
      message: 'Upload failed. Click Retry to try again.',
      iconUrl: 'img/icon256.png',
      buttons: [{ title: 'Retry' }, { title: 'Cancel' }]
    });
  }
}

