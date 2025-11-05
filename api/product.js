export default function handler(req, res) {
  const productHandle = req.url.split('/products/')[1]?.split('?')[0] || '';

  // Your Shopify domain
  const shopifyDomain = 'celestialjewel.co.in';
  const flutterAppScheme = 'celestialjewel://';
  const appStoreUrl = 'https://apps.apple.com/in/app/celestial-jewels/id6751133452'; // Replace with actual App Store ID
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.celestial.jewel.com';

  // Get user agent to detect device
  const userAgent = req.headers['user-agent'] || '';
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  // Product URL in your app
  const appDeepLink = `${flutterAppScheme}product/${productHandle}`;

  // Product URL on Shopify website
  const webUrl = `https://${shopifyDomain}/products/${productHandle}`;

  // HTML page with proper iOS fallback handling
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redirecting to Celestial Jewel...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${isIOS ? `<meta name="apple-itunes-app" content="app-id=YOUR_APP_ID">` : ''}
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
        .message {
            font-size: 18px;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="spinner"></div>
    <p class="message">Opening Celestial Jewel...</p>
    
    <script type="text/javascript">
        (function() {
            const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            const appDeepLink = '${appDeepLink}';
            const webUrl = '${webUrl}';
            const appStoreUrl = '${appStoreUrl}';
            const playStoreUrl = '${playStoreUrl}';
            
            let opened = false;
            let visibilityChanged = false;
            
            // iOS-specific handling
            if (isIOS) {
                // Try to open app via custom scheme
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = appDeepLink;
                document.body.appendChild(iframe);
                
                // Listen for visibility change (more reliable than blur on iOS)
                document.addEventListener('visibilitychange', function() {
                    if (document.hidden) {
                        visibilityChanged = true;
                        opened = true;
                    }
                });
                
                // Fallback to website if app doesn't open
                // iOS blocks custom scheme silently if app not installed
                setTimeout(function() {
                    document.body.removeChild(iframe);
                    if (!opened && !visibilityChanged) {
                        // App not installed - redirect to website instead of App Store
                        window.location.href = webUrl;
                    }
                }, 2500);
                
            } 
            // Android handling with intent scheme
            else if (isAndroid) {
                const packageName = 'com.celestial.jewel.com';
                const intentUrl = 'intent://product/' + encodeURIComponent('${productHandle}') + 
                    '#Intent;scheme=celestialjewel;package=' + packageName + 
                    ';S.browser_fallback_url=' + encodeURIComponent(webUrl) + ';end';
                
                window.location.href = intentUrl;
                
                // Additional fallback for older Android versions
                setTimeout(function() {
                    if (!document.hidden) {
                        window.location.href = webUrl;
                    }
                }, 2000);
            } 
            // Desktop or other devices - redirect to web
            else {
                setTimeout(function() {
                    window.location.href = webUrl;
                }, 500);
            }
        })();
    </script>
</body>
</html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
}
