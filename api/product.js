export default function handler(req, res) {
  const productHandle = req.url.split('/products/')[1]?.split('?')[0] || '';
  
  // Configuration
  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/app/idYOUR_APP_ID'; // Replace with actual App Store ID
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com';
  
  // Device detection
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  // Deep link URLs
  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;
  
  // iOS-specific handling with proper fallback
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting to Celestial Jewel...</title>
  ${isIOS ? `
    <meta name="apple-itunes-app" content="app-id=YOUR_APP_ID">
  ` : ''}
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    .spinner {
      border: 4px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top: 4px solid white;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .fallback-btn {
      margin-top: 20px;
      padding: 12px 24px;
      background: white;
      color: #667eea;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <h2>Opening Celestial Jewel...</h2>
  <p id="status">Attempting to open app...</p>
  <a href="${webUrl}" class="fallback-btn" id="fallback" style="display:none;">View on Website</a>
  
  <script>
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const appDeepLink = '${appDeepLink}';
    const webUrl = '${webUrl}';
    const appStoreUrl = '${appStoreUrl}';
    const playStoreUrl = '${playStoreUrl}';
    
    let appOpened = false;
    
    // Detect if app opened successfully
    window.addEventListener('blur', () => {
      appOpened = true;
    });
    
    // For iOS: Try universal link first, then custom scheme
    if (isIOS) {
      // iOS will handle universal link automatically
      // Set timeout for fallback
      setTimeout(() => {
        if (!appOpened && !document.hidden) {
          document.getElementById('status').textContent = 'App not installed';
          document.getElementById('fallback').style.display = 'inline-block';
          // Redirect to website after showing message
          setTimeout(() => {
            window.location.href = webUrl;
          }, 1500);
        }
      }, 2500);
      
      // Try custom scheme as backup
      setTimeout(() => {
        if (!appOpened) {
          window.location.href = appDeepLink;
        }
      }, 500);
    }
    // For Android: Use intent scheme
    else if (isAndroid) {
      const intentUrl = \`intent://product/\${productHandle.split('/').pop()}#Intent;scheme=celestialjewel;package=com.celestial.jewel.com;S.browser_fallback_url=\${encodeURIComponent(webUrl)};end\`;
      window.location.href = intentUrl;
      
      // Fallback to web if intent fails
      setTimeout(() => {
        if (!appOpened && !document.hidden) {
          window.location.href = webUrl;
        }
      }, 2000);
    }
    // For other devices: redirect to web
    else {
      setTimeout(() => {
        window.location.href = webUrl;
      }, 1000);
    }
  </script>
</body>
</html>`;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
