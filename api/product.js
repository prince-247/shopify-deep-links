export default function handler(req, res) {
  const productHandle = req.url.split('/products/')[1]?.split('?')[0] || '';

  const shopifyDomain = 'celestialjewel.co.in';
  const appStoreId = '6751133452'; // Your App Store ID
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  const userAgent = req.headers['user-agent'] || '';
  const isAndroid = /Android/.test(userAgent);

  // Android: Use intent scheme with website fallback
  if (isAndroid) {
    const intentUrl = `intent://product/${productHandle}#Intent;scheme=celestialjewel;package=com.celestial.jewel.com;S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Opening Celestial Jewel...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <p>Opening app...</p>
    <script>window.location.href = '${intentUrl}';</script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  // For iOS: Use Smart App Banner + redirect to website
  // Universal Links will intercept if app installed
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Celestial Jewel - ${productHandle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <!-- Smart App Banner - Shows "Open in App" if installed, "Download" if not -->
    <meta name="apple-itunes-app" content="app-id=${appStoreId}, app-argument=https://shopify-deep-links.vercel.app/products/${productHandle}">
    
    <!-- Immediate redirect to Shopify website -->
    <meta http-equiv="refresh" content="0; url=${webUrl}">
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            display: flex;
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
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div>
        <div class="spinner"></div>
        <p>Redirecting to product page...</p>
    </div>
    <script>
        // Fallback redirect
        setTimeout(function() {
            window.location.href = '${webUrl}';
        }, 100);
    </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
